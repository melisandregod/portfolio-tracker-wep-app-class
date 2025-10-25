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

  // ดึงธุรกรรมทั้งหมด
  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
  });

  if (!transactions.length) return NextResponse.json([]);

  // วันลงทุนแรกจริง
  const firstTxDate = new Date(transactions[0].date);

  // คำนวณช่วงเวลา
  const endDate = new Date();
  const startDate = new Date();

  switch (range) {
    case "day":
      startDate.setDate(endDate.getDate() - 2);
      break;
    case "month":
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case "year":
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    case "max":
    default:
      // max ใช้วันลงทุนแรกเสมอ
      startDate.setTime(firstTxDate.getTime());
      break;
  }

  // Check universal: ถ้า startDate < วันลงทุนแรก → ปรับให้เท่ากับวันนั้น
  if (startDate < firstTxDate) startDate.setTime(firstTxDate.getTime());

  // ดึงราคาย้อนหลังจาก Yahoo
  const symbols = [...new Set(transactions.map((t) => t.symbol.toUpperCase()))];

  const historicalData = await Promise.all(
    symbols.map(async (s) => {
      const mapped = s === "BTC" ? "BTC-USD" : s === "ETH" ? "ETH-USD" : s;
      try {
        const data = await yahooFinance.historical(mapped, {
          period1: startDate,
          period2: endDate,
          interval: "1d",
        });
        return { symbol: s, data };
      } catch {
        return { symbol: s, data: [] };
      }
    })
  );

  // รวมมูลค่าพอร์ต
  const portfolioTimeline: Record<string, number> = {};

  
for (const { symbol, data } of historicalData) {
  for (const point of data) {
    const dateStr = point.date.toISOString().split("T")[0];

    const txBefore = transactions.filter(
      (t) => t.symbol.toUpperCase() === symbol && t.date <= point.date
    );

    // ✅ คำนวณ quantity ด้วย Decimal อย่างเดียว
    const quantity = txBefore.reduce((sum, t) => {
      const q = new Decimal(t.quantity);
      return t.type === "BUY" ? sum.add(q) : sum.sub(q);
    }, new Decimal(0));

    // ใช้ Decimal คำนวณมูลค่าทั้งหมด (ไม่ปัดทศนิยม)
    const close = new Decimal(point.close ?? 0);
    const totalValue = quantity.mul(close);

    // รวมค่าของวันนั้นโดยใช้ Decimal ตลอด
    const prev = portfolioTimeline[dateStr]
      ? new Decimal(portfolioTimeline[dateStr])
      : new Decimal(0);

    const newValue = prev.add(totalValue);
    portfolioTimeline[dateStr] = newValue.toNumber(); // แปลงเป็น number ตอนสุดท้าย
  }
}

  // เรียงวันตามลำดับ
  const performance = Object.entries(portfolioTimeline)
    .map(([date, portfolio]) => ({ date, portfolio }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return NextResponse.json(performance);
}
