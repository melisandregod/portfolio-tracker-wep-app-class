"use client";

import { useTranslations } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";
import { BarChart, Home, List } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();

  const links = [
    { name: t("overview"), href: "/dashboard", icon: Home },
    { name: t("transactions"), href: "/dashboard/transactions", icon: List },
    { name: t("analytics"), href: "/dashboard/analytics", icon: BarChart },
  ];

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
