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

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
  });

  if (!transactions.length) {
    return NextResponse.json({
      summary: { totalValue: 0, totalCost: 0, gainLossPercent: 0 },
      categories: [],
      allocation: [],
      topHoldings: [],
    });
  }

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
      holdings[key].quantity = holdings[key].quantity.sub(qty);
      holdings[key].costBasis = holdings[key].costBasis.sub(cost);
    }
  }

  const symbols = Object.keys(holdings);
  try {
    const prices = await Promise.all(
      symbols.map(async (s) => {
        try {
          const quote = await yahooFinance.quoteSummary(s, {
            modules: ["price"],
          });
          const price = quote?.price?.regularMarketPrice ?? 0;
          return { symbol: s, price: new Decimal(price) };
        } catch {
          console.warn(`Yahoo price fetch failed for ${s}`);
          return { symbol: s, price: new Decimal(0) };
        }
      })
    );

    const priceMap = Object.fromEntries(prices.map((p) => [p.symbol, p.price]));

    for (const s of symbols) {
      const h = holdings[s];
      const price = priceMap[s] ?? new Decimal(0);

      h.currentPrice = price;
      h.currentValue = h.quantity.mul(price);

      h.gainPercent = h.costBasis.gt(0)
        ? h.currentValue.sub(h.costBasis).div(h.costBasis).mul(100)
        : new Decimal(0);
    }
  } catch (err) {
    console.error("Yahoo Finance error:", err);
  }

  const totalValue = Object.values(holdings).reduce(
    (sum, h) => sum.add(h.currentValue),
    new Decimal(0)
  );
  const totalCost = Object.values(holdings).reduce(
    (sum, h) => sum.add(h.costBasis),
    new Decimal(0)
  );

  const gainLossPercent = totalCost.gt(0)
    ? totalValue.sub(totalCost).div(totalCost).mul(100)
    : new Decimal(0);

  const categoryMap: Record<string, { value: Decimal; cost: Decimal }> = {};
  for (const h of Object.values(holdings)) {
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

  const allocation = categories.map((c) => ({
    name: c.name,
    value: totalValue.gt(0)
      ? Number(((c.value / totalValue.toNumber()) * 100).toFixed(2))
      : 0,
  }));

  const holdingList = Object.values(holdings).map((h) => ({
    symbol: h.symbol,
    category: h.category,
    quantity: h.quantity.toNumber(),
    avgCost: h.costBasis.gt(0) ? h.costBasis.div(h.quantity).toNumber() : 0,
    currentPrice: h.currentPrice.toNumber(),
    currentValue: h.currentValue.toNumber(),
    gainPercent: h.gainPercent.toNumber(),
  }));

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
