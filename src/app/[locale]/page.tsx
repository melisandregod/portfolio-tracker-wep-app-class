// app/[locale]/page.tsx
import { redirect } from "next/navigation";

export default async function HomePage({}) {
  redirect(`/dashboard`);
}
