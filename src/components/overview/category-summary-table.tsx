"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type Category = {
  name: string;
  value: number;
  gain: number;
};

export function CategorySummaryTable({ data }: { data: Category[] }) {
  const total = data.reduce((sum, c) => sum + c.value, 0);

  return (
    <Card className="border-none bg-gradient-to-br from-background to-muted/20 shadow-sm hover:shadow-md transition-all">
      <CardContent>
        <div className="rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left font-semibold text-foreground">
                  Category
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Value
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Gain / Loss
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((c, i) => {
                const isGain = c.gain > 0;
                const isLoss = c.gain < 0;
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

                const percent = total > 0 ? (c.value / total) * 100 : 0;

                return (
                  <TableRow
                    key={i}
                    className="hover:bg-muted/30 transition-all border-b border-muted/20"
                  >
                    {/* Category Name + Progress bar */}
                    <TableCell className="font-medium text-foreground">
                      <div className="flex flex-col">
                        <span>{c.name}</span>
                        <div className="mt-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              isGain
                                ? "bg-green-500"
                                : isLoss
                                ? "bg-red-400"
                                : "bg-gray-400"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    {/* Value */}
                    <TableCell className="text-right text-foreground font-medium">
                      $
                      {c.value.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>

                    {/* Gain / Loss */}
                    <TableCell
                      className={`text-right font-semibold flex items-center justify-end gap-1 ${gainColor}`}
                    >
                      {gainIcon}
                      {c.gain.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
