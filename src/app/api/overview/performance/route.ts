import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import YahooFinance from "yahoo-finance2";
import { Decimal } from "@prisma/client/runtime/library";

export async function GET(req: Request) {
  const yahooFinance = new YahooFinance({ suppressNotices: ["ripHistorical"] });
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "month";

  // set interval
  let interval: "1d" | "1wk" | "1mo" = "1d";
  if (range === "year") interval = "1wk";
  if (range === "max") interval = "1mo";

  // ดึงธุรกรรมทั้งหมดของ user
  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
  });

  if (!transactions.length) return NextResponse.json([]);

  // คำนวณช่วงที่ต้องการดู
  const firstTxDate = new Date(transactions[0].date);
  const endDate = new Date();

  // ดึงข้อมูลทั้งหมดแบบ "max" เสมอ
  const symbols = [...new Set(transactions.map((t) => t.symbol.toUpperCase()))];
  const mapSymbol = (s: string) =>
    s === "BTC"
      ? "BTC-USD"
      : s === "ETH"
      ? "ETH-USD"
      : s === "XAUUSD"
      ? "GC=F"
      : s;

  // สร้าง timeline เต็มตั้งแต่เริ่มลงทุนจนวันนี้
  const allDates: string[] = [];
  const cursor = new Date(firstTxDate);
  while (cursor <= endDate) {
    allDates.push(cursor.toISOString().split("T")[0]);
    cursor.setDate(cursor.getDate() + 1);
  }

  // ดึงราคาย้อนหลังทั้งหมด (1d พอ)
  const historicalData = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const mapped = mapSymbol(symbol);
        const data = await yahooFinance.historical(mapped, {
          period1: firstTxDate,
          period2: endDate,
          interval: interval,
        });
        return { symbol, data };
      } catch (err) {
        console.error(`Error fetching ${symbol}:`, err);
        return { symbol, data: [] };
      }
    })
  );

  // คำนวณพอร์ตสะสม (ไม่ต้องสน range ก่อน)
  const portfolioTimeline: Record<string, Decimal> = {};
  for (const date of allDates) portfolioTimeline[date] = new Decimal(0);

  for (const { symbol, data } of historicalData) {
    let lastPrice = new Decimal(0);

    for (const date of allDates) {
      const found = data.find(
        (p) => p.date.toISOString().split("T")[0] === date
      );
      if (found?.close) lastPrice = new Decimal(found.close);
      if (lastPrice.eq(0)) continue;

      const txBefore = transactions.filter(
        (t) =>
          t.symbol.toUpperCase() === symbol &&
          new Date(t.date).getTime() <= new Date(date).getTime()
      );
      if (!txBefore.length) continue;

      const quantity = txBefore.reduce((sum, t) => {
        const q = new Decimal(t.quantity);
        return t.type === "BUY" ? sum.add(q) : sum.sub(q);
      }, new Decimal(0));

      if (quantity.lte(0)) continue;
      portfolioTimeline[date] = portfolioTimeline[date].add(
        quantity.mul(lastPrice)
      );
    }
  }

  // แปลงเป็น array ทั้งหมดก่อน filter
  const fullPerformance = allDates.map((date) => ({
    date,
    portfolio: portfolioTimeline[date].toNumber(),
  }));

  // ตัดช่วงเวลาที่ต้องการแสดง
  const cutoff = new Date(endDate);
  switch (range) {
    case "day":
      cutoff.setDate(endDate.getDate() - 3);
      break;
    case "week":
      cutoff.setDate(endDate.getDate() - 7);
      break;
    case "month":
      cutoff.setMonth(endDate.getMonth() - 1);
      break;
    case "year":
      cutoff.setFullYear(endDate.getFullYear() - 1);
      break;
    case "max":
    default:
      return NextResponse.json(fullPerformance);
  }

  const filtered = fullPerformance.filter(
    (p) => new Date(p.date).getTime() >= cutoff.getTime()
  );

  return NextResponse.json(filtered);
}
