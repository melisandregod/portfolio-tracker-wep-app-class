"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import type { Transaction } from "@/types/transaction";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { TransactionDialog } from "./transaction-dialog";
import { TransactionTable } from "./transaction-table";
import { TransactionSummary } from "./transaction-summary";
import { useTranslations } from "next-intl";

export function TransactionFilters() {
  const { data, isLoading } = useSWR<Transaction[]>("/api/transactions");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const t = useTranslations('transactions.filters');

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((t) => {
      const matchSearch =
        t.symbol.toLowerCase().includes(search.toLowerCase()) ||
        (t.name?.toLowerCase() ?? "").includes(search.toLowerCase());
      const matchCategory =
        category === "all" ||
        t.category.toLowerCase() === category.toLowerCase();
      const matchType =
        type === "all" || t.type.toLowerCase() === type.toLowerCase();
      return matchSearch && matchCategory && matchType;
    });
  }, [data, search, category, type]);

  return (
    <section className="flex flex-col gap-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 justify-between md:justify-start bg-gradient-to-br from-background to-muted/20 p-4 rounded-xl border border-muted/30 shadow-sm hover:shadow-md transition-all">
        {/* Search box */}
        <div className="flex items-center gap-3">
          <Input
            placeholder={t('searchPlaceholder')}
            className="w-64 bg-background border-muted/40 focus:ring-1 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Category select */}
          <Select defaultValue="all" onValueChange={setCategory}>
            <SelectTrigger className="w-44 bg-background border-muted/40">
              <SelectValue placeholder={t('categoryPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="STOCK">{t('categories.STOCK')}</SelectItem>
              <SelectItem value="ETF">{t('categories.ETF')}</SelectItem>
              <SelectItem value="CRYPTO">{t('categories.CRYPTO')}</SelectItem>
              <SelectItem value="GOLD">{t('categories.GOLD')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Transaction type select */}
          <Select defaultValue="all" onValueChange={setType}>
            <SelectTrigger className="w-44 bg-background border-muted/40">
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="BUY">{t('types.BUY')}</SelectItem>
              <SelectItem value="SELL">{t('types.SELL')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add new transaction button */}
        <div className="ml-auto">
          <TransactionDialog />
        </div>
      </div>

      {/* Summary section */}
      <TransactionSummary />

      {/* Table section */}
      <div className="rounded-xl border border-muted/40 bg-gradient-to-b from-background to-muted/10 shadow-sm">
        <TransactionTable data={filtered} loading={isLoading} />
      </div>
    </section>
  );
}
