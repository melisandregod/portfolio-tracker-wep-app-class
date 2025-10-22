// components/navbar.tsx
"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme-toggle";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-end items-center border-b bg-background px-6 py-3">
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <span className="text-sm">{session?.user?.name}</span>
        <Button
          className="cursor-pointer"
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Sign out
        </Button>
      </div>
    </header>
  );
}
