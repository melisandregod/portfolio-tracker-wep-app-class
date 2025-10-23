import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import YahooFinance from "yahoo-finance2";
import {
  calculateCAGR,
  calculateSharpeRatio,
  calculateMaxDrawdown,
} from "@/lib/analytics-utils";

export async function GET() {
  const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });
  // ตรวจสอบ session ก่อน
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  // 1. ดึงธุรกรรมของผู้ใช้
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });
  if (transactions.length === 0)
    return NextResponse.json({ message: "ไม่มีข้อมูลธุรกรรม" });

  // 2. รวมจำนวนถือครองจริงของแต่ละ symbol
  const holdings: Record<
    string,
    { quantity: number; avgCost: number; category: string }
  > = {};

  for (const t of transactions) {
    if (!holdings[t.symbol]) {
      holdings[t.symbol] = { quantity: 0, avgCost: 0, category: t.category };
    }

    // คำนวณต้นทุนเฉลี่ยแบบถ่วงน้ำหนัก
    if (t.type === "BUY") {
      const prev = holdings[t.symbol];
      holdings[t.symbol].avgCost =
        (prev.avgCost * prev.quantity + t.price * t.quantity) /
        (prev.quantity + t.quantity);
      holdings[t.symbol].quantity += t.quantity;
    } else if (t.type === "SELL") {
      holdings[t.symbol].quantity -= t.quantity;
    }
  }

  // 3. ดึงราคาปัจจุบันจาก Yahoo Finance
  const symbols = Object.keys(holdings);
  const quotes = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const quote = await yahooFinance.quote(symbol);
        return { symbol, price: quote.regularMarketPrice as number };
      } catch {
        console.warn(`ดึงราคา ${symbol} ไม่ได้`);
        return { symbol, price: 0 };
      }
    })
  );

  // 4. คำนวณมูลค่าและกำไร/ขาดทุนของแต่ละสินทรัพย์
  const result = symbols.map((s) => {
    const holding = holdings[s];
    const quote = quotes.find((q) => q.symbol === s);
    const currentPrice = quote?.price ?? 0;
    const currentValue = holding.quantity * currentPrice;
    const costBasis = holding.quantity * holding.avgCost;
    const gainLoss = currentValue - costBasis;
    const gainPct = costBasis > 0 ? gainLoss / costBasis : 0;

    return {
      symbol: s,
      category: holding.category,
      quantity: holding.quantity,
      avgCost: holding.avgCost,
      currentPrice,
      currentValue,
      gainLoss,
      gainPct,
    };
  });

  // 5. คำนวณ Metrics รวม
  const totalStartValue = result.reduce(
    (sum, r) => sum + r.avgCost * r.quantity,
    0
  );
  const totalEndValue = result.reduce((sum, r) => sum + r.currentValue, 0);
  // แทนที่ const yearsHeld = 1 ด้วย:
  const firstDate = transactions[0].date;
  const lastDate = new Date();
  const rawYearsHeld =
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  const yearsHeld = rawYearsHeld < 1 ? 1 : rawYearsHeld;

  const cagr = calculateCAGR(totalStartValue, totalEndValue, yearsHeld);
  const returns = result.map((r) => r.gainPct);
  const sharpe = calculateSharpeRatio(returns);
  const drawdown = calculateMaxDrawdown(result.map((r) => r.currentValue));

  // 6. Top / Worst performers
  // ใน app/api/analytics/route.ts ตอนข้อ 6: Top / Worst performers
  const positives = result
    .filter((r) => r.gainPct > 0)
    .sort((a, b) => b.gainPct - a.gainPct);

  const negatives = result
    .filter((r) => r.gainPct < 0)
    .sort((a, b) => a.gainPct - b.gainPct); // ลบมากสุดมาก่อน

  const toRow = (a: (typeof result)[number]) => ({
    asset: a.symbol,
    gain: `${a.gainPct >= 0 ? "+" : ""}${(a.gainPct * 100).toFixed(2)}%`,
    value: `$${a.currentValue.toFixed(2)}`,
  });

  const topAssets = positives.slice(0, 3).map(toRow);
  const worstAssets = negatives.slice(0, 3).map(toRow);

  // 7. จำลองมูลค่าอีก 5 ปี (Projection)
  const projection = Array.from({ length: 5 }).map((_, i) => ({
    year: new Date().getFullYear() + i + 1,
    value: totalEndValue * Math.pow(1 + cagr, i + 1),
  }));

  // ส่งข้อมูลกลับ
  return NextResponse.json({
    metrics: { cagr, sharpe, drawdown },
    topAssets,
    worstAssets,
    projection,
  });
}
