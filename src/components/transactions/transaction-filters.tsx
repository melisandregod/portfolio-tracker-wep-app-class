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

export function TransactionFilters() {
  const { data, isLoading } = useSWR<Transaction[]>("/api/transactions");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");

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
    <div className="flex flex-col gap-4">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Search by name or symbol..."
          className="w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select defaultValue="all" onValueChange={setCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Asset Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="STOCK">Stocks</SelectItem>
            <SelectItem value="ETF">ETFs</SelectItem>
            <SelectItem value="CRYPTO">Crypto</SelectItem>
            <SelectItem value="GOLD">Gold</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all" onValueChange={setType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="BUY">Buy</SelectItem>
            <SelectItem value="SELL">Sell</SelectItem>
          </SelectContent>
        </Select>

        <TransactionDialog />
      </div>
      <TransactionSummary />
      {/* ส่ง data ที่กรองแล้วไปแสดงในตาราง */}
      <TransactionTable data={filtered} loading={isLoading} />
    </div>
  );
}
