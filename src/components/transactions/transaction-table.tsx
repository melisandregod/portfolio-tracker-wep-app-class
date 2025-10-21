"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table"

const transactions = [
  {
    date: "2025-10-01",
    asset: "NVDA",
    type: "Buy",
    category: "Stock",
    quantity: 5,
    price: 450,
    total: 2250,
  },
  {
    date: "2025-09-20",
    asset: "BTC",
    type: "Buy",
    category: "Crypto",
    quantity: 0.05,
    price: 68000,
    total: 3400,
  },
  {
    date: "2025-08-12",
    asset: "AAPL",
    type: "Sell",
    category: "Stock",
    quantity: 2,
    price: 190,
    total: 380,
  },
]

export function TransactionTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t, i) => (
              <TableRow key={i}>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.asset}</TableCell>
                <TableCell
                  className={
                    t.type === "Buy"
                      ? "text-green-500 font-medium"
                      : "text-red-500 font-medium"
                  }
                >
                  {t.type}
                </TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell>{t.quantity}</TableCell>
                <TableCell>${t.price.toLocaleString()}</TableCell>
                <TableCell>${t.total.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
