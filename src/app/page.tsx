// app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootRedirect() {
  const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value || "en";
  redirect(`/${cookieLocale}`);
}
