"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { TransactionDialog } from "./transaction-dialog"

export function TransactionFilters() {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Input placeholder="Search by name or symbol..." className="w-60" />

      <Select defaultValue="all">
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Asset Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="stock">Stocks</SelectItem>
          <SelectItem value="etf">ETFs</SelectItem>
          <SelectItem value="crypto">Crypto</SelectItem>
          <SelectItem value="gold">Gold</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Transaction Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="buy">Buy</SelectItem>
          <SelectItem value="sell">Sell</SelectItem>
          <SelectItem value="dividend">Dividend</SelectItem>
          <SelectItem value="deposit">Deposit</SelectItem>
        </SelectContent>
      </Select>
      <TransactionDialog />
    </div>
  )
}
