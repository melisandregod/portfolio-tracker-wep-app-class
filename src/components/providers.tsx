"use client"

import { SessionProvider } from "next-auth/react"
import { SWRConfig } from "swr"
import { ThemeProvider } from "@/components/theme-provider"
import { fetcher } from "@/lib/fetcher"
import { Sidebar } from "@/components/layouts/sidebar"
import { Navbar } from "@/components/layouts/navbar"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          fetcher,
          revalidateOnFocus: true,
          dedupingInterval: 5000,
          shouldRetryOnError: false,
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-y-auto">
              <Navbar />
              <div className="p-6 flex-1">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </SWRConfig>
    </SessionProvider>
  )
}
