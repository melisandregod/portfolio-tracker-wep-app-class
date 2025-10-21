import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import YahooFinance from "yahoo-finance2";

export async function GET(req: Request) {
  const yahooFinance = new YahooFinance({ suppressNotices: ['ripHistorical'] });
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "month";

  const startDate = new Date();
  if (range === "day") startDate.setDate(startDate.getDate() - 1);
  else if (range === "month") startDate.setMonth(startDate.getMonth() - 1);
  else if (range === "year") startDate.setFullYear(startDate.getFullYear() - 1);
  else startDate.setFullYear(startDate.getFullYear() - 5);

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
  });

  const symbols = [...new Set(transactions.map((t) => t.symbol.toUpperCase()))];

  const historicalData = await Promise.all(
    symbols.map(async (s) => {
      const mapped = s === "BTC" ? "BTC-USD" : s === "ETH" ? "ETH-USD" : s;
      try {
        const data = await yahooFinance.historical(mapped, {
          period1: startDate,
          period2: new Date(),
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
      const txForDate = transactions.filter(
        (t) => t.symbol.toUpperCase() === symbol && t.date <= point.date
      );
      const quantity = txForDate.reduce(
        (sum, t) => sum + (t.type === "BUY" ? t.quantity : -t.quantity),
        0
      );
      const totalValue = quantity * point.close;
      portfolioTimeline[dateStr] =
        (portfolioTimeline[dateStr] || 0) + totalValue;
    }
  }

  const performance = Object.entries(portfolioTimeline)
    .map(([date, portfolio]) => ({ date, portfolio }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return NextResponse.json(performance);
}
