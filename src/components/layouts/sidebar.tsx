// components/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Home, List } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Transactions", href: "/dashboard/transactions", icon: List },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-muted/20 p-4">
      <h1 className="text-xl font-bold mb-6 text-primary">Portify</h1>
      <nav className="space-y-2">
        {links.map(({ name, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition hover:bg-accent hover:text-accent-foreground",
              pathname === href && "bg-accent text-accent-foreground font-medium"
            )}
          >
            <Icon className="h-4 w-4" />
            {name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
