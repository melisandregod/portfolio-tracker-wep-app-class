// /types/transaction.ts

export type TransactionType = "BUY" | "SELL"

export type AssetCategory = "STOCK" | "ETF" | "CRYPTO" | "GOLD"

export interface Transaction {
  id: number
  symbol: string
  name?: string
  category: AssetCategory
  type: TransactionType
  quantity: number
  price: number
  fee?: number | null
  note?: string | null
  date: string
  createdAt: string
  userId: string
}

export interface CreateTransactionInput {
  symbol: string
  name?: string
  category: AssetCategory
  type: TransactionType
  quantity: number
  price: number
  fee?: number | null
  note?: string | null
  date?: string
}
