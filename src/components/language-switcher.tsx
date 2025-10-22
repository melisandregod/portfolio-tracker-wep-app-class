"use client";

import { useLocale } from "next-intl";
import { usePathname, getPathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useLocale(); // locale ปัจจุบัน เช่น 'en' หรือ 'th'
  const pathname = usePathname(); // ได้ '/dashboard' ไม่ใช่ '/en/dashboard'
  const router = useRouter();

  const nextLocale = locale === "en" ? "th" : "en";

  const handleSwitch = () => {
    // getPathname จะเติม prefix ให้ถูกต้อง เช่น '/th/dashboard'
    const newPath = getPathname({ locale: nextLocale, href: pathname })
    console.log(newPath);
    console.log("pathname:", pathname);
    router.replace(newPath);
    
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
