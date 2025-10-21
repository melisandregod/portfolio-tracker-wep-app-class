import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/transactions
export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  })

  return NextResponse.json(transactions)
}

// POST /api/transactions
export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { symbol, name, category, type, quantity, price, fee, note, date } = body

    const transaction = await prisma.transaction.create({
      data: {
        symbol,
        name,
        category,
        type,
        quantity: Number(quantity),
        price: Number(price),
        fee: fee ? Number(fee) : null,
        note,
        date: date ? new Date(date) : new Date(),
        userId: session.user.id,
      },
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
