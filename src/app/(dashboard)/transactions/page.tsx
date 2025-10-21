"use client"


import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { TransactionSummary } from "@/components/transactions/transaction-summary"
import { TransactionTable } from "@/components/transactions/transaction-table"

export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <TransactionFilters />
      <TransactionSummary />
      <TransactionTable />
    </div>
  )
}
