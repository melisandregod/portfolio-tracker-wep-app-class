"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function TransactionTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[8rem]">Date</TableHead>
              <TableHead className="w-[7rem]">Symbol</TableHead>
              <TableHead className="w-[6rem]">Type</TableHead>
              <TableHead className="w-[8rem]">Category</TableHead>
              <TableHead className="w-[6rem] text-right">Qty</TableHead>
              <TableHead className="w-[6rem] text-right">Price</TableHead>
              <TableHead className="w-[7rem] text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[6rem]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[4rem]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[3rem]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[5rem]" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-[3rem] ml-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-[3rem] ml-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-[4rem] ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
