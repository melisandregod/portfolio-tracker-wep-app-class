"use client";

import { usePathname } from "@/i18n/navigation"; // ✅ ใช้ usePathname ของ next-intl
import { Link } from "@/i18n/navigation"; // ✅ ใช้ Link ของ next-intl
import { BarChart, Home, List } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Transactions", href: "/dashboard/transactions", icon: List },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
];

export function Sidebar() {
  const pathname = usePathname(); // pathname จะมี locale prefix เช่น /en/dashboard

  return (
    <aside className="w-64 border-r bg-muted/20 p-4">
      <h1 className="text-xl font-bold mb-6 text-primary">Portify</h1>
      <nav className="space-y-2">
        {links.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href || pathname === `${href}/`;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <Icon className="h-4 w-4" />
              {name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
