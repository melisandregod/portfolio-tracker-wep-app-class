import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import YahooFinance from "yahoo-finance2";
import { Decimal } from "@prisma/client/runtime/library";
import {
  calculateCAGR,
  calculateSharpeRatio,
  calculateMaxDrawdown,
} from "@/lib/analytics-utils";

export async function GET() {
  const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey","ripHistorical"] });
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  // 1. ดึงธุรกรรมทั้งหมด
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });
  if (!transactions.length)
    return NextResponse.json({ message: "ไม่มีข้อมูลธุรกรรม" });

  // 2. รวมถือครองจริงต่อ symbol
  const holdings: Record<
    string,
    { quantity: Decimal; avgCost: Decimal; category: string }
  > = {};

  for (const t of transactions) {
    if (!holdings[t.symbol]) {
      holdings[t.symbol] = {
        quantity: new Decimal(0),
        avgCost: new Decimal(0),
        category: t.category,
      };
    }

    const qty = new Decimal(t.quantity);
    const price = new Decimal(t.price);

    if (t.type === "BUY") {
      const prev = holdings[t.symbol];
      const prevValue = prev.avgCost.mul(prev.quantity);
      const newValue = price.mul(qty);
      const newQty = prev.quantity.add(qty);
      const newAvg = newQty.gt(0)
        ? prevValue.add(newValue).div(newQty)
        : new Decimal(0);
      prev.quantity = newQty;
      prev.avgCost = newAvg;
    } else if (t.type === "SELL") {
      holdings[t.symbol].quantity = Decimal.max(
        holdings[t.symbol].quantity.sub(qty),
        new Decimal(0)
      );
    }
  }

  // 3. ดึงราคาปัจจุบันของแต่ละ symbol
  const symbols = Object.keys(holdings);
  const quotes = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const quote = await yahooFinance.quote(symbol);
        return { symbol, price: new Decimal(quote.regularMarketPrice ?? 0) };
      } catch {
        console.warn(`⚠️ ดึงราคา ${symbol} ไม่ได้`);
        return { symbol, price: new Decimal(0) };
      }
    })
  );

  // 4. คำนวณมูลค่าปัจจุบัน
  const result = symbols.map((s) => {
    const h = holdings[s];
    const q = quotes.find((q) => q.symbol === s);
    const price = q?.price ?? new Decimal(0);
    const currentValue = h.quantity.mul(price);
    const costBasis = h.quantity.mul(h.avgCost);
    const gainLoss = currentValue.sub(costBasis);
    const gainPct = costBasis.gt(0) ? gainLoss.div(costBasis) : new Decimal(0);

    return {
      symbol: s,
      category: h.category,
      quantity: h.quantity.toNumber(),
      avgCost: h.avgCost.toNumber(),
      currentPrice: price.toNumber(),
      currentValue: currentValue.toNumber(),
      gainLoss: gainLoss.toNumber(),
      gainPct: gainPct.toNumber(),
    };
  });

  // 5. คำนวณ Metrics รวม
  const totalStartValue = result.reduce(
    (sum, r) => sum + r.avgCost * r.quantity,
    0
  );
  const totalEndValue = result.reduce((sum, r) => sum + r.currentValue, 0);

  const firstDate = transactions[0].date;
  const lastDate = new Date();
  const rawYears =
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  const yearsHeld = rawYears < 1 ? 1 : rawYears;

  const cagr = calculateCAGR(totalStartValue, totalEndValue, yearsHeld);
  const returns = result.map((r) => r.gainPct);
  const sharpe = calculateSharpeRatio(returns);

  // 6. คำนวณ Drawdown จริงจาก historical timeline
  const start = firstDate;
  const end = lastDate;
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
        console.warn(`historical fetch failed for ${s}`);
        return { symbol: s, data: [] };
      }
    })
  );

  // รวมมูลค่าพอร์ตต่อสัปดาห์
  const timeline: Record<string, number> = {};
  for (const { symbol, data } of historicalData) {
    for (const point of data) {
      const dateStr = point.date.toISOString().split("T")[0];
      const txBefore = transactions.filter(
        (t) => t.symbol.toUpperCase() === symbol && t.date <= point.date
      );
      const quantity = txBefore.reduce((sum, t) => {
        const qty = new Decimal(t.quantity);
        return t.type === "BUY" ? sum.add(qty) : sum.sub(qty);
      }, new Decimal(0));
      const close = new Decimal(point.close ?? 0);
      const totalValue = quantity.mul(close);
      const prev = timeline[dateStr]
        ? new Decimal(timeline[dateStr])
        : new Decimal(0);
      timeline[dateStr] = prev.add(totalValue).toNumber();
    }
  }

  const series = Object.entries(timeline)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const portfolioValues = series.map((p) => p.value);
  const drawdown = calculateMaxDrawdown(portfolioValues);

  // 7. Top / Worst performers
  const positives = result
    .filter((r) => r.gainPct > 0)
    .sort((a, b) => b.gainPct - a.gainPct);
  const negatives = result
    .filter((r) => r.gainPct < 0)
    .sort((a, b) => a.gainPct - b.gainPct);

  const toRow = (a: (typeof result)[number]) => ({
    asset: a.symbol,
    gain: `${a.gainPct >= 0 ? "+" : ""}${(a.gainPct * 100).toFixed(2)}%`,
    value: `$${a.currentValue.toFixed(2)}`,
  });

  const topAssets = positives.slice(0, 3).map(toRow);
  const worstAssets = negatives.slice(0, 3).map(toRow);

  // 8. Projection (5 ปี)
  const projection = Array.from({ length: 5 }).map((_, i) => ({
    year: new Date().getFullYear() + i + 1,
    value: totalEndValue * Math.pow(1 + cagr, i + 1),
  }));

  return NextResponse.json({
    metrics: { cagr, sharpe, drawdown },
    topAssets,
    worstAssets,
    projection,
  });
}
