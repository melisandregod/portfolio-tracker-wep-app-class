import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import YahooFinance from "yahoo-finance2";
import { Decimal } from "@prisma/client/runtime/library";

type HoldingSummary = {
  symbol: string;
  category: string;
  quantity: Decimal;
  costBasis: Decimal;
  currentPrice: Decimal;
  currentValue: Decimal;
  gainPercent: Decimal;
};

export async function GET() {
  const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ดึงธุรกรรมทั้งหมดของ user
  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
  });

  // ถ้ายังไม่มีธุรกรรมเลย
  if (!transactions.length) {
    return NextResponse.json({
      summary: { totalValue: 0, totalCost: 0, gainLossPercent: 0 },
      categories: [],
      allocation: [],
      holdingList: [],
    });
  }

  // รวมธุรกรรมเป็นสถานะล่าสุดของแต่ละ symbol
  const holdings: Record<string, HoldingSummary> = {};

  for (const tx of transactions) {
    const key = tx.symbol.toUpperCase();
    if (!holdings[key]) {
      holdings[key] = {
        symbol: key,
        category: tx.category,
        quantity: new Decimal(0),
        costBasis: new Decimal(0),
        currentPrice: new Decimal(0),
        currentValue: new Decimal(0),
        gainPercent: new Decimal(0),
      };
    }

    const qty = new Decimal(tx.quantity);
    const price = new Decimal(tx.price);
    const cost = qty.mul(price);

    if (tx.type === "BUY") {
      holdings[key].quantity = holdings[key].quantity.add(qty);
      holdings[key].costBasis = holdings[key].costBasis.add(cost);
    } else if (tx.type === "SELL") {
      // ❗ หักออกเฉพาะส่วนที่ยังเหลือ
      const available = holdings[key].quantity;
      const sellQty = Decimal.min(qty, available); // ป้องกันติดลบ
      const avgCost = available.gt(0)
        ? holdings[key].costBasis.div(available)
        : new Decimal(0);

      holdings[key].quantity = holdings[key].quantity.sub(sellQty);
      holdings[key].costBasis = holdings[key].costBasis.sub(
        avgCost.mul(sellQty)
      );
    }
  }

  // เอาเฉพาะสินทรัพย์ที่ยังถืออยู่จริง
  const activeHoldings = Object.values(holdings).filter((h) =>
    h.quantity.gt(0)
  );

  if (!activeHoldings.length) {
    return NextResponse.json({
      summary: { totalValue: 0, totalCost: 0, gainLossPercent: 0 },
      categories: [],
      allocation: [],
      holdingList: [],
    });
  }

  // ดึงราคาปัจจุบันจาก Yahoo Finance
  try {
    const prices = await Promise.all(
      activeHoldings.map(async (h) => {
        try {
          const quote = await yahooFinance.quoteSummary(h.symbol, {
            modules: ["price"],
          });
          const price = quote?.price?.regularMarketPrice ?? 0;
          return { symbol: h.symbol, price: new Decimal(price) };
        } catch {
          console.warn(`Yahoo price fetch failed for ${h.symbol}`);
          return { symbol: h.symbol, price: new Decimal(0) };
        }
      })
    );

    const priceMap = Object.fromEntries(prices.map((p) => [p.symbol, p.price]));

    for (const h of activeHoldings) {
      const price = priceMap[h.symbol] ?? new Decimal(0);
      h.currentPrice = price;
      h.currentValue = h.quantity.mul(price);
      h.gainPercent = h.costBasis.gt(0)
        ? h.currentValue.sub(h.costBasis).div(h.costBasis).mul(100)
        : new Decimal(0);
    }
  } catch (err) {
    console.error("Yahoo Finance error:", err);
  }

  // คำนวณ summary เฉพาะสินทรัพย์ที่เหลืออยู่
  const totalValue = activeHoldings.reduce(
    (sum, h) => sum.add(h.currentValue),
    new Decimal(0)
  );
  const totalCost = activeHoldings.reduce(
    (sum, h) => sum.add(h.costBasis),
    new Decimal(0)
  );
  const gainLossPercent = totalCost.gt(0)
    ? totalValue.sub(totalCost).div(totalCost).mul(100)
    : new Decimal(0);

  // Category summary
  const categoryMap: Record<string, { value: Decimal; cost: Decimal }> = {};
  for (const h of activeHoldings) {
    if (!categoryMap[h.category])
      categoryMap[h.category] = { value: new Decimal(0), cost: new Decimal(0) };
    categoryMap[h.category].value = categoryMap[h.category].value.add(
      h.currentValue
    );
    categoryMap[h.category].cost = categoryMap[h.category].cost.add(
      h.costBasis
    );
  }

  const categories = Object.entries(categoryMap).map(([name, v]) => ({
    name,
    value: v.value.toNumber(),
    gain: v.cost.gt(0)
      ? v.value.sub(v.cost).div(v.cost).mul(100).toNumber()
      : 0,
  }));

  // Allocation
  const allocation = categories.map((c) => ({
    name: c.name,
    value: totalValue.gt(0)
      ? Number(((c.value / totalValue.toNumber()) * 100).toFixed(2))
      : 0,
  }));

  // Holding list
  const holdingList = activeHoldings.map((h) => ({
    symbol: h.symbol,
    category: h.category,
    quantity: h.quantity.toNumber(),
    avgCost:
      h.quantity.gt(0) && h.costBasis.gt(0)
        ? h.costBasis.div(h.quantity).toNumber()
        : 0,
    currentPrice: h.currentPrice.toNumber(),
    currentValue: h.currentValue.toNumber(),
    gainPercent: h.gainPercent.toNumber(),
  }));

  // ส่งออกเฉพาะสินทรัพย์ที่ยังถืออยู่
  return NextResponse.json({
    summary: {
      totalValue: totalValue.toNumber(),
      totalCost: totalCost.toNumber(),
      gainLossPercent: gainLossPercent.toNumber(),
    },
    categories,
    allocation,
    holdingList,
  });
}
