import "@/app/globals.css";
import { Navbar } from "@/components/layouts/navbar";
import { Sidebar } from "@/components/layouts/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <div className="p-6 flex-1">{children}</div>
      </main>
    </div>
  );
}
