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

import { usePagination } from "@/hooks/use-pagination";
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
  const [targetId, setTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  //  ใช้ hook pagination
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
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground py-6">
            No transactions found.
          </p>
        </CardContent>
      </Card>
    );

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
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                <TableCell>{t.symbol}</TableCell>
                <TableCell
                  className={
                    t.type === "BUY"
                      ? "text-green-500 font-medium"
                      : "text-red-500 font-medium"
                  }
                >
                  {t.type}
                </TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell className="text-right">{t.quantity}</TableCell>
                <TableCell className="text-right">
                  ${t.price.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  ${(t.quantity * t.price).toLocaleString()}
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
                          This action cannot be undone. It will permanently
                          remove this transaction.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setTargetId(null)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(t.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting && targetId === t.id
                            ? "Deleting..."
                            : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIdx.toLocaleString()}–{endIdx.toLocaleString()} of{" "}
            {data.length.toLocaleString()} records
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <span className="text-sm text-muted-foreground self-center">
              Page {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
