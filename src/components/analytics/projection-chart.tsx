"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type ProjectionPoint = { year: number; value: number }[];

export function ProjectionChart({ data }: { data: ProjectionPoint }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projected Portfolio Value (5 Years)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ value: { label: "Projected Value", color: "#16a34a" } }}>
          <LineChart data={data} width={500} height={300}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
