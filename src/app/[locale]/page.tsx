// app/[locale]/page.tsx
import {redirect} from 'next/navigation';

export default async function LocaleRootPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  redirect(`/${locale}/dashboard`);
}
