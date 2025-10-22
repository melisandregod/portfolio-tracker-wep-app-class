import { redirect } from "next/navigation";

export default function RootPage() {
  // ให้ redirect ไป locale default (en)
  redirect("/en");
}
