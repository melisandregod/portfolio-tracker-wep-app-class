"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const locale = useLocale();                // locale ปัจจุบัน เช่น 'en' หรือ 'th'
  const pathname = usePathname();            // path ปัจจุบัน เช่น '/dashboard'
  const router = useRouter();                // locale-aware router จาก next-intl

  const nextLocale = locale === "en" ? "th" : "en";

  const handleSwitch = () => {
    // จะ redirect ไป path เดิม แต่เปลี่ยน locale prefix ให้เอง เช่น '/th/dashboard'
    router.replace({ pathname }, { locale: nextLocale });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={handleSwitch}
    >
      <Globe className="w-4 h-4" />
      {nextLocale === "en" ? "English" : "ไทย"}
    </Button>
  );
}
