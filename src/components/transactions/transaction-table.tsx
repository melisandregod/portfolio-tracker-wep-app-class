"use client";

import { useState } from "react";
import { mutate } from "swr";
import type { Transaction } from "@/types/transaction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { TransactionTableSkeleton } from "../ui/transactions/TransactionTableSkeleton";
import { usePagination } from "@/hooks/use-pagination";
import { useTranslations } from "next-intl";

type Props = {
  data?: Transaction[];
  loading?: boolean;
  pageSize?: number;
};

export function TransactionTable({
  data = [],
  loading = false,
  pageSize = 8,
}: Props) {
  const tr = useTranslations('transactions.table')
  const [targetId, setTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { page, setPage, totalPages, paginatedData, startIdx, endIdx } =
    usePagination<Transaction>(data, pageSize);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) mutate("/api/transactions");
    } finally {
      setIsDeleting(false);
      setTargetId(null);
    }
  };

  if (loading) return <TransactionTableSkeleton />;

  if (!data.length)
    return (
      <Card className="border-none bg-gradient-to-br from-background to-muted/20 text-center py-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-muted-foreground">
            {tr('title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{tr('noData')}</p>
        </CardContent>
      </Card>
    );

  return (
    <Card className="border-none bg-gradient-to-br from-background to-muted/10 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          {tr('title')}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border border-muted/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>{tr('headers.date')}</TableHead>
                <TableHead>{tr('headers.symbol')}</TableHead>
                <TableHead>{tr('headers.type')}</TableHead>
                <TableHead>{tr('headers.category')}</TableHead>
                <TableHead className="text-right">{tr('headers.qty')}</TableHead>
                <TableHead className="text-right">{tr('headers.price')}</TableHead>
                <TableHead className="text-right">{tr('headers.total')}</TableHead>
                <TableHead className="text-center">{tr('headers.actions')}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.map((t) => (
                <TableRow
                  key={t.id}
                  className="hover:bg-muted/25 transition-all border-b border-muted/20"
                >
                  <TableCell className="text-muted-foreground">
                    {new Date(t.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {t.symbol}
                  </TableCell>
                  <TableCell
                    className={
                      t.type === "BUY"
                        ? "text-green-500 font-medium"
                        : "text-red-500 font-medium"
                    }
                  >
                    {t.type}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {t.category}
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    {t.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    ${t.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    ${(t.quantity * t.price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <AlertDialog
                      open={targetId === t.id}
                      onOpenChange={(open) => setTargetId(open ? t.id : null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setTargetId(t.id)}
                          disabled={isDeleting}
                          className="hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete {t.symbol} ({t.type}) transaction?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {tr('delete.description')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setTargetId(null)}>
                            {tr('delete.cancel')}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(t.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting && targetId === t.id
                              ? tr('delete.deleting')
                              : tr('delete.confirm')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Showing {startIdx.toLocaleString()}–{endIdx.toLocaleString()} of{" "}
            {data.length.toLocaleString()} records
          </p>

          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="transition-all"
            >
              {tr('pagination.prev')}
            </Button>
            <span className="text-sm text-muted-foreground">
              Page <span className="font-semibold text-foreground">{page}</span>{" "}
              / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="transition-all"
            >
              {tr('pagination.next')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
