// app/(dashboard)/analytics/page.tsx
export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="text-muted-foreground">
        Performance charts, allocation ratios, and trend analysis.
      </p>
      {/* TODO: Add chart components using Recharts or Chart.js */}
    </div>
  )
}
