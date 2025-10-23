"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

type Metrics = { cagr: number; sharpe: number; drawdown: number };

export function PerformanceMetrics({ data }: { data: Metrics }) {
  const formatPercent = (v: number) =>
    `${(v * 100).toFixed(2)}%`;

  const isPositive = data.cagr >= 0;
  const cagrColor = isPositive ? "text-emerald-600" : "text-red-500";
  const ddColor = data.drawdown <= 0 ? "text-red-500" : "text-emerald-600";

  const metricCards = [
    {
      title: "CAGR",
      value: formatPercent(data.cagr),
      color: cagrColor,
      icon: isPositive ? (
        <TrendingUp className="w-5 h-5 text-emerald-600" />
      ) : (
        <TrendingDown className="w-5 h-5 text-red-500" />
      ),
      subtext: "Compound Annual Growth Rate",
      bg: "from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/30",
    },
    {
      title: "Sharpe Ratio",
      value: data.sharpe.toFixed(2),
      color: "text-blue-600",
      icon: <Activity className="w-5 h-5 text-blue-600" />,
      subtext: "Risk-adjusted return indicator",
      bg: "from-blue-50 to-blue-100/40 dark:from-blue-950/40 dark:to-blue-900/30",
    },
    {
      title: "Max Drawdown",
      value: formatPercent(data.drawdown),
      color: ddColor,
      icon:
        data.drawdown <= 0 ? (
          <TrendingDown className="w-5 h-5 text-red-500" />
        ) : (
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        ),
      subtext: "Largest portfolio decline from peak",
      bg: "from-rose-50 to-rose-100/40 dark:from-rose-950/40 dark:to-rose-900/30",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
      {metricCards.map((m) => (
        <Card
          key={m.title}
          className={`relative border-none shadow-sm hover:shadow-md transition-all bg-gradient-to-br ${m.bg}`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              {m.icon}
              {m.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${m.color}`}>{m.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{m.subtext}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
