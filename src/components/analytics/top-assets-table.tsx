"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";

type Asset = { asset: string; gain: string; value: string };

export function TopAssetsTable({
  top,
  worst,
}: {
  top: Asset[];
  worst: Asset[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top / Worst Performing Assets</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2 text-green-600">Top Performers</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Gain</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {top.map((a, i) => (
                <TableRow key={i}>
                  <TableCell>{a.asset}</TableCell>
                  <TableCell className="text-green-500">{a.gain}</TableCell>
                  <TableCell>{a.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-red-600">Worst Performers</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Loss</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {worst.map((a, i) => (
                <TableRow key={i}>
                  <TableCell>{a.asset}</TableCell>
                  <TableCell className="text-red-500">{a.gain}</TableCell>
                  <TableCell>{a.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
