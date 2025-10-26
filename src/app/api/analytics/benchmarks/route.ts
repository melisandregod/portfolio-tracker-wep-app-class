import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import YahooFinance from "yahoo-finance2";
import { Decimal } from "@prisma/client/runtime/library";

const BENCHMARKS = {
  sp500: "^GSPC",
  nasdaq: "^NDX",
  btc: "BTC-USD",
  gold: "GC=F",
};

// getDateRange ใช้สำหรับ "max" เท่านั้น (เต็มตั้งแต่วันแรกถึงปัจจุบัน)
function getMaxRange(firstTxDate: Date) {
  const start = new Date(firstTxDate);
  const end = new Date();
  return { start, end };
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const yahooFinance = new YahooFinance({ suppressNotices: ["ripHistorical"] });
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "month";

  // ดึงธุรกรรมทั้งหมด
  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
  });

  if (!transactions.length)
    return NextResponse.json({ portfolio: [], benchmarks: [] });

  // ดึงข้อมูลเต็ม (max) ก่อน แล้ว filter ทีหลัง
  const firstTxDate = new Date(transactions[0].date);
  const { start, end } = getMaxRange(firstTxDate);

  // เริ่มส่วนคำนวณเดิมทั้งหมด (ห้ามแตะ)
  let totalCost = new Decimal(0);
  const symbolCost: Record<string, Decimal> = {};

  for (const tx of transactions) {
    if (new Date(tx.date).getTime() > end.getTime()) continue;
    const cost = new Decimal(tx.price)
      .mul(new Decimal(tx.quantity))
      .add(new Decimal(tx.fee ?? 0));

    const key = tx.symbol.toUpperCase();
    if (!symbolCost[key]) symbolCost[key] = new Decimal(0);

    if (tx.type === "BUY") symbolCost[key] = symbolCost[key].add(cost);
    else symbolCost[key] = symbolCost[key].sub(cost);
  }

  for (const k in symbolCost) {
    if (symbolCost[k].gt(0)) totalCost = totalCost.add(symbolCost[k]);
  }

  const allDates: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    allDates.push(cursor.toISOString().split("T")[0]);
    cursor.setDate(cursor.getDate() + 1);
  }

  const symbols = [...new Set(transactions.map((t) => t.symbol.toUpperCase()))];
  const mapSymbol = (s: string) =>
    s === "BTC"
      ? "BTC-USD"
      : s === "ETH"
      ? "ETH-USD"
      : s === "XAUUSD"
      ? "GC=F"
      : s;

  const historicalData = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const data = await yahooFinance.historical(mapSymbol(symbol), {
          period1: start,
          period2: end,
          interval: "1d",
        });
        return { symbol, data };
      } catch {
        return { symbol, data: [] };
      }
    })
  );

  const portfolioTimeline: Record<string, Decimal> = {};
  for (const date of allDates) portfolioTimeline[date] = new Decimal(0);

  for (const { symbol, data } of historicalData) {
    let lastPrice = new Decimal(0);
    for (const date of allDates) {
      const found = data.find(
        (p) => p.date.toISOString().split("T")[0] === date
      );
      if (found?.close) lastPrice = new Decimal(found.close);

      const txBefore = transactions.filter(
        (t) =>
          t.symbol.toUpperCase() === symbol &&
          new Date(t.date).getTime() <= new Date(date).getTime()
      );

      const quantity = txBefore.reduce((sum, t) => {
        const q = new Decimal(t.quantity);
        return t.type === "BUY" ? sum.add(q) : sum.sub(q);
      }, new Decimal(0));

      if (quantity.lte(0)) continue;
      const totalValue = quantity.mul(lastPrice);
      portfolioTimeline[date] = portfolioTimeline[date].add(totalValue);
    }
  }

  if (allDates.length) {
    const firstDate = allDates[0];
    portfolioTimeline[firstDate] = new Decimal(totalCost);
  }

  const portfolioSeries = allDates.map((date) => ({
    date,
    value: portfolioTimeline[date].toNumber(),
  }));

  const portfolioWithGain = portfolioSeries.map((p) => ({
    ...p,
    gain: ((p.value - totalCost.toNumber()) / totalCost.toNumber()) * 100,
  }));

  const benchmarks = await Promise.all(
    Object.entries(BENCHMARKS).map(async ([key, symbol]) => {
      try {
        const data = await yahooFinance.historical(symbol, {
          period1: start,
          period2: end,
          interval: "1d",
        });

        let lastPrice = 0;
        const filled = allDates.map((date) => {
          const found = data.find(
            (p) => p.date.toISOString().split("T")[0] === date
          );
          if (found?.close) lastPrice = found.close ?? 0;
          return { date, value: lastPrice };
        });

        const base = filled.find((f) => f.value > 0)?.value ?? 1;
        const norm = filled.map((f) => ({
          date: f.date,
          gain: ((f.value - base) / base) * 100,
        }));

        return { name: key, data: norm };
      } catch {
        return { name: key, data: [] };
      }
    })
  );

  // 🟢 filter หลังจากคำนวณเสร็จแล้ว (ไม่แตะ logic คำนวณ)
  const cutoff = new Date(end);
  switch (range) {
    case "day":
      cutoff.setDate(end.getDate() - 1);
      break;
    case "week":
      cutoff.setDate(end.getDate() - 7);
      break;
    case "month":
      cutoff.setMonth(end.getMonth() - 1);
      break;
    case "year":
      cutoff.setFullYear(end.getFullYear() - 1);
      break;
    case "max":
    default:
      return NextResponse.json({
        portfolio: portfolioWithGain,
        benchmarks,
        totalCost: totalCost.toNumber(),
      });
  }

  const filteredPortfolio = portfolioWithGain.filter(
    (p) => new Date(p.date).getTime() >= cutoff.getTime()
  );

  const filteredBenchmarks = benchmarks.map((b) => ({
    ...b,
    data: b.data.filter((d) => new Date(d.date).getTime() >= cutoff.getTime()),
  }));

  return NextResponse.json({
    portfolio: filteredPortfolio,
    benchmarks: filteredBenchmarks,
    totalCost: totalCost.toNumber(),
  });
}
