"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type Asset = { asset: string; gain: string; value: string };

export function TopAssetsTable({
  top,
  worst,
}: {
  top: Asset[];
  worst: Asset[];
}) {
  return (
    <Card className="border-none bg-gradient-to-br from-background/80 to-muted/30 shadow-lg hover:shadow-xl transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight">
          Top / Worst Performing Assets
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 🟢 Top Performers */}
        <div>
          <h3 className="flex items-center gap-2 font-semibold mb-3 text-green-600">
            <ArrowUpRight className="w-4 h-4" /> Top Performers
          </h3>
          <Table>
            <TableHeader>
              <TableRow className="border-muted">
                <TableHead className="w-10 text-muted-foreground">#</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Gain</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {top.length ? (
                top.map((a, i) => (
                  <TableRow
                    key={i}
                    className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 transition-colors"
                  >
                    <TableCell className="font-medium text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-medium">{a.asset}</TableCell>
                    <TableCell className="text-right text-green-500 font-semibold">
                      {a.gain}
                    </TableCell>
                    <TableCell className="text-right text-foreground">
                      {a.value}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-4">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* 🔴 Worst Performers */}
        <div>
          <h3 className="flex items-center gap-2 font-semibold mb-3 text-red-600">
            <ArrowDownRight className="w-4 h-4" /> Worst Performers
          </h3>
          <Table>
            <TableHeader>
              <TableRow className="border-muted">
                <TableHead className="w-10 text-muted-foreground">#</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Loss</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {worst.length ? (
                worst.map((a, i) => (
                  <TableRow
                    key={i}
                    className="hover:bg-rose-50/50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <TableCell className="font-medium text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-medium">{a.asset}</TableCell>
                    <TableCell className="text-right text-red-500 font-semibold">
                      {a.gain}
                    </TableCell>
                    <TableCell className="text-right text-foreground">
                      {a.value}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-4">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
