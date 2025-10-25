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

// Normalize series เป็น % การเติบโตจากวันเริ่มลงทุน
function normalizeSeries(series: { date: string; value: number }[]) {
  if (!series.length) return [];
  const first = series.find((s) => s.value > 0);
  if (!first) return series.map((p) => ({ date: p.date, value: 0 }));
  const base = first.value;

  return series.map((p) => ({
    date: p.date,
    value: base ? ((p.value - base) / base) * 100 : 0,
  }));
}

function getDateRange(range: string, firstTxDate: Date) {
  const end = new Date();
  const start = new Date();

  switch (range) {
    case "day":
      start.setDate(end.getDate() - 2);
      break;
    case "month":
      start.setMonth(end.getMonth() - 1);
      break;
    case "year":
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start.setTime(firstTxDate.getTime());
      break;
  }

  if (start < firstTxDate) start.setTime(firstTxDate.getTime());
  return { start, end };
}

export async function GET(req: Request) {
  const yahooFinance = new YahooFinance({ suppressNotices: ["ripHistorical"] });
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "month";

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
  });
  if (!transactions.length)
    return NextResponse.json({ portfolio: [], benchmarks: [] });

  const firstTxDate = new Date(transactions[0].date);
  const { start, end } = getDateRange(range, firstTxDate);

  const symbols = [...new Set(transactions.map((t) => t.symbol.toUpperCase()))];

  const historicalData = await Promise.all(
    symbols.map(async (s) => {
      const mapped = s === "BTC" ? "BTC-USD" : s === "ETH" ? "ETH-USD" : s;
      try {
        const data = await yahooFinance.historical(mapped, {
          period1: start,
          period2: end,
          interval: "1d",
        });
        return { symbol: s, data };
      } catch {
        return { symbol: s, data: [] };
      }
    })
  );

  const portfolioTimeline: Record<string, number> = {};

  for (const { symbol, data } of historicalData) {
    for (const point of data) {
      const dateStr = point.date.toISOString().split("T")[0];
      const txBefore = transactions.filter(
        (t) => t.symbol.toUpperCase() === symbol && t.date <= point.date
      );

      // ใช้ Decimal แทน number
      const quantity = txBefore.reduce((sum, t) => {
        const qty = new Decimal(t.quantity);
        return t.type === "BUY" ? sum.add(qty) : sum.sub(qty);
      }, new Decimal(0));

      const close = new Decimal(point.close ?? 0);
      const totalValue = quantity.mul(close);
      const prev = portfolioTimeline[dateStr]
        ? new Decimal(portfolioTimeline[dateStr])
        : new Decimal(0);

      portfolioTimeline[dateStr] = prev.add(totalValue).toNumber();
    }
  }

  const portfolioSeries = Object.entries(portfolioTimeline)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const portfolioNormalized = normalizeSeries(portfolioSeries);

  // ดึง benchmark
  const benchmarks = await Promise.all(
    Object.entries(BENCHMARKS).map(async ([key, symbol]) => {
      try {
        const data = await yahooFinance.historical(symbol, {
          period1: start,
          period2: end,
          interval: "1d",
        });
        const series = data.map((q) => ({
          date: q.date.toISOString().split("T")[0],
          value: q.close as number,
        }));
        return { name: key, data: normalizeSeries(series) };
      } catch {
        return { name: key, data: [] };
      }
    })
  );

  const alignedDates = portfolioNormalized.map((p) => p.date);
  const alignedBenchmarks = benchmarks.map((b) => ({
    name: b.name,
    data: b.data.filter((x) => alignedDates.includes(x.date)),
  }));

  return NextResponse.json({
    portfolio: portfolioNormalized,
    benchmarks: alignedBenchmarks,
  });
}
