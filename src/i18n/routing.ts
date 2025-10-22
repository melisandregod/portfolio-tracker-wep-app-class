import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "th"], // ภาษาที่รองรับ
  defaultLocale: "en", // fallback
  localePrefix: "as-needed",
});
