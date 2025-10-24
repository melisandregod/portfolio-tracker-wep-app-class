"use client"


import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { useTranslations } from "next-intl";


export default function TransactionsPage() {
  const t = useTranslations("transactions");
  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <TransactionFilters />
    </div>
  )
}
