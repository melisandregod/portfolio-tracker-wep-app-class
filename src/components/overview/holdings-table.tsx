"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/use-pagination";
import { useTranslations } from "next-intl";

type Holding = {
  symbol: string;
  category: string;
  quantity: string;
  avgCost: number;
  currentPrice: number;
  currentValue: number;
  gainPercent: number;
};

export function HoldingsTable({ data }: { data: Holding[] }) {
  const t = useTranslations("overview.holdings");
  const { page, setPage, totalPages, paginatedData, startIdx, endIdx } =
    usePagination(data, 6); // แสดง 6 แถวต่อหน้า
  console.log(data);
  
  if (!data?.length)
    return (
      <Card className="border-none bg-muted/30 text-center py-12">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-muted-foreground">
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          {t("noData")}
        </CardContent>
      </Card>
    );

  return (
    <Card className="border-none bg-gradient-to-br from-background to-muted/20 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          {t("title")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg overflow-hidden border border-muted/40">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-left font-semibold text-foreground">
                  {t("headers.asset")}
                </TableHead>
                <TableHead className="text-left font-semibold text-foreground">
                  {t("headers.type")}
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Quantity
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Avg. Cost
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Current Price
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Value
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Gain
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.map((h, i) => {
                const isLoss = h.gainPercent < 0;
                const isGain = h.gainPercent > 0;

                const gainColor = isGain
                  ? "text-green-600"
                  : isLoss
                  ? "text-red-500"
                  : "text-muted-foreground";

                const gainIcon = isGain ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : isLoss ? (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                ) : null;

                return (
                  <TableRow
                    key={i}
                    className="hover:bg-muted/25 transition-all border-b border-muted/20"
                  >
                    <TableCell className="font-semibold text-foreground">
                      {h.symbol}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {h.category}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {parseFloat(h.quantity).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 6,
                      })}
                    </TableCell>
                    <TableCell className="text-right text-foreground font-medium">
                      $
                      {h.avgCost.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right text-foreground font-medium">
                      $
                      {h.currentPrice.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right text-foreground font-medium">
                      $
                      {h.currentValue.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold flex items-center justify-end gap-1 ${gainColor}`}
                    >
                      {gainIcon}
                      {h.gainPercent.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <span>
            Showing {startIdx}–{endIdx} of {data.length}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              {t("pagination.previous")}
            </Button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              {t("pagination.next")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
