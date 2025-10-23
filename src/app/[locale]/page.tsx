// app/[locale]/page.tsx
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { notFound, redirect } from "next/navigation";

export default async function LocaleRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value || "en";
  redirect(`/${locale}/dashboard`);
}
