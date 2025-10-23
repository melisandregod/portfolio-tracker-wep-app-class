import { TooltipProps } from "recharts/types/component/Tooltip";

export const CustomTooltip: React.FC<
  TooltipProps<number, string>
> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className="rounded-md border bg-background p-3 shadow-md"
      style={{
        borderColor: "hsl(var(--border))",
        minWidth: "160px",
      }}
    >
      {/* วันที่ */}
      <p className="text-xs text-muted-foreground mb-1">
        {new Date(label as string).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "2-digit",
        })}
      </p>

      {/* รายการข้อมูลแต่ละเส้น */}
      <ul className="space-y-1">
        {payload.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between text-sm gap-5"
          >
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color || "#8884d8" }}
              />
              <span className="font-medium">{item.name}</span>
            </span>
            <span
              className={`font-semibold ${
                (item.value ?? 0) >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {Number(item.value ?? 0).toFixed(2)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};