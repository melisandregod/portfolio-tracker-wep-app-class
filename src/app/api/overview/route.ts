import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import YahooFinance from "yahoo-finance2";

type HoldingSummary = {
  symbol: string;
  category: string;
  quantity: number;
  costBasis: number;
  currentPrice: number;
  currentValue: number;
  gainPercent: number;
};

export async function GET() {
  const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ดึงธุรกรรมทั้งหมด
  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
  });

  if (!transactions.length) {
    return NextResponse.json({
      summary: { totalValue: 0, totalCost: 0, gainLossPercent: 0 },
      categories: [],
      allocation: [],
      topHoldings: [],
      performance: [],
    });
  }

  // รวมยอดคงเหลือต่อ symbol
  const holdings: Record<string, HoldingSummary> = {};

  for (const tx of transactions) {
    const key = tx.symbol.toUpperCase();
    if (!holdings[key]) {
      holdings[key] = {
        symbol: key,
        category: tx.category,
        quantity: 0,
        costBasis: 0,
        currentPrice: 0,
        currentValue: 0,
        gainPercent: 0,
      };
    }

    if (tx.type === "BUY") {
      holdings[key].quantity += tx.quantity;
      holdings[key].costBasis += tx.quantity * tx.price;
    } else if (tx.type === "SELL") {
      holdings[key].quantity -= tx.quantity;
      holdings[key].costBasis -= tx.quantity * tx.price;
    }
  }

  // 3ดึงราคาปัจจุบันจาก Yahoo Finance แบบ promise all
  const symbols = Object.keys(holdings);
  try {
    const prices = await Promise.all(
      symbols.map(async (s) => {
        try {
          const quote = await yahooFinance.quoteSummary(s, {
            modules: ["price"],
          });
          const price = quote?.price?.regularMarketPrice ?? 0;
          return { symbol: s, price };
        } catch {
          console.warn(`Yahoo price fetch failed for ${s}`);
          return { symbol: s, price: 0 };
        }
      })
    );

    // สร้าง map symbol → price
    const priceMap = Object.fromEntries(prices.map((p) => [p.symbol, p.price]));

    for (const s of symbols) {
      const price = priceMap[s] ?? 0;
      const h = holdings[s];
      h.currentPrice = price;
      h.currentValue = h.quantity * price;
      h.gainPercent =
        h.costBasis > 0
          ? ((h.currentValue - h.costBasis) / h.costBasis) * 100
          : 0;
    }
  } catch (err) {
    console.error("Yahoo Finance error:", err);
  }

  // สรุปรวมทั้งพอร์ต
  const totalValue = Object.values(holdings).reduce(
    (sum, h) => sum + h.currentValue,
    0
  );
  const totalCost = Object.values(holdings).reduce(
    (sum, h) => sum + h.costBasis,
    0
  );
  const gainLossPercent =
    totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

  // รวมตามหมวด
  const categoryMap: Record<string, { value: number; cost: number }> = {};
  for (const h of Object.values(holdings)) {
    if (!categoryMap[h.category])
      categoryMap[h.category] = { value: 0, cost: 0 };
    categoryMap[h.category].value += h.currentValue;
    categoryMap[h.category].cost += h.costBasis;
  }

  const categories = Object.entries(categoryMap).map(([name, v]) => ({
    name,
    value: v.value,
    gain: v.cost > 0 ? ((v.value - v.cost) / v.cost) * 100 : 0,
  }));

  // Allocation chart (%)
  const allocation = categories.map((c) => ({
    name: c.name,
    value:
      totalValue > 0
        ? parseFloat(((c.value / totalValue) * 100).toFixed(2)) // ทศนิยม 2 ตำแหน่ง
        : 0,
  }));

  // Top holdings
  const topHoldings = Object.values(holdings)
    .filter((h) => h.quantity > 0)
    .sort((a, b) => b.currentValue - a.currentValue)
    .slice(0, 5)
    .map((h) => ({
      symbol: h.symbol,
      type: h.category,
      value: h.currentValue,
      gain: `${h.gainPercent.toFixed(2)}%`,
      allocation: `${
        totalValue > 0 ? ((h.currentValue / totalValue) * 100).toFixed(1) : 0
      }%`,
    }));

  // 8Mock performance
  const performance = [
    { date: "Jan", portfolio: 10000, benchmark: 9800 },
    { date: "Feb", portfolio: 10200, benchmark: 9950 },
    { date: "Mar", portfolio: 10500, benchmark: 10100 },
  ];

  return NextResponse.json({
    summary: { totalValue, totalCost, gainLossPercent },
    categories,
    allocation,
    topHoldings,
    performance,
  });
}
