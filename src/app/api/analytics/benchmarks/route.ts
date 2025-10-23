import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import YahooFinance from "yahoo-finance2";

// ดัชนีที่ใช้เปรียบเทียบ
const BENCHMARKS = {
  sp500: "^GSPC",
  nasdaq: "^NDX",
  btc: "BTC-USD",
  gold: "GC=F",
};

// Normalize series เป็น % การเติบโตจากวันเริ่มลงทุน
function normalizeSeries(series: { date: string; value: number }[]) {
  if (!series.length) return [];

  const firstValidIndex = series.findIndex((s) => s.value > 0);
  if (firstValidIndex === -1)
    return series.map((p) => ({ date: p.date, value: 0 }));

  const base = series[firstValidIndex].value;

  return series.map((p, i) => {
    if (i < firstValidIndex) return { date: p.date, value: 0 };
    const pct = base ? ((p.value - base) / base) * 100 : 0;
    return { date: p.date, value: Number.isFinite(pct) ? pct : 0 };
  });
}

// กำหนดช่วงเวลา พร้อมรองรับ firstTxDate
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
    case "max":
    default:
      // max → ใช้วันลงทุนแรกแทนการลบ 5 ปี
      start.setTime(firstTxDate.getTime());
      break;
  }

  // ถ้า start ก่อนวันลงทุนแรก → ใช้วันนั้นแทน
  if (start < firstTxDate) start.setTime(firstTxDate.getTime());

  return { start, end };
}

export async function GET(req: Request) {
  const yahooFinance = new YahooFinance({ suppressNotices: ["ripHistorical"] });
  const session = await auth();

  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // อ่าน range จาก query
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "month";

  // ดึงธุรกรรมทั้งหมด
  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
  });

  if (!transactions.length)
    return NextResponse.json({ portfolio: [], benchmarks: [] });

  // หาวันลงทุนแรกจริง
  const firstTxDate = new Date(transactions[0].date);

  // ใช้วันนั้นใน getDateRange
  const { start, end } = getDateRange(range, firstTxDate);

  // สร้าง symbol list
  const symbols = [...new Set(transactions.map((t) => t.symbol.toUpperCase()))];

  // ดึงราคาย้อนหลังของแต่ละ symbol
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

  // รวมมูลค่าพอร์ตแต่ละวัน
  const portfolioTimeline: Record<string, number> = {};

  for (const { symbol, data } of historicalData) {
    for (const point of data) {
      const dateStr = point.date.toISOString().split("T")[0];
      const txBefore = transactions.filter(
        (t) => t.symbol.toUpperCase() === symbol && t.date <= point.date
      );

      const quantity = txBefore.reduce(
        (sum, t) => sum + (t.type === "BUY" ? t.quantity : -t.quantity),
        0
      );

      const totalValue = quantity * (point.close ?? 0);
      portfolioTimeline[dateStr] =
        (portfolioTimeline[dateStr] || 0) + totalValue;
    }
  }

  // เรียงวัน + normalize
  const portfolioSeries = Object.entries(portfolioTimeline)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const portfolioNormalized = normalizeSeries(portfolioSeries);

  // ดึง benchmark หลักทั้งหมด
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

  // Align วันให้ตรงกับ portfolio
  const alignedDates = portfolioNormalized.map((p) => p.date);
  const alignedBenchmarks = benchmarks.map((b) => ({
    name: b.name,
    data: b.data.filter((x) => alignedDates.includes(x.date)),
  }));

  // ส่งข้อมูลกลับ
  return NextResponse.json({
    portfolio: portfolioNormalized,
    benchmarks: alignedBenchmarks,
  });
}
