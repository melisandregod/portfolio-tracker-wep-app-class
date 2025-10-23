"use client";

import { useLocale, useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme-toggle";
import { LanguageSwitcher } from "../language-switcher";

export function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations("Navbar");
  const locale = useLocale();

  return (
    <header className="flex justify-end items-center border-b bg-background px-6 py-3">
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <ThemeToggle />
        <span className="text-sm">{session?.user?.name}</span>
        <Button
          className="cursor-pointer"
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
        >
          {t("signOut")}
        </Button>
      </div>
    </header>
  );
}
