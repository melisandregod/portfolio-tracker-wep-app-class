// components/navbar.tsx
"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Navbar() {
  const { data: session } = useSession();

  const pathname = usePathname();

  // แยก path ออกเป็น segment
  const segments = pathname.split("/").filter((segment) => segment !== "");

  // ฟังก์ชันแปลง segment เป็นตัวอักษรให้อ่านง่าย
  const formatSegment = (segment: string) => {
    return segment
      .replace(/-/g, " ") // แปลง "-" เป็นช่องว่าง
      .replace(/\b\w/g, (l) => l.toUpperCase()); // ตัวแรกเป็นพิมพ์ใหญ่
  };

  return (
    <header className="flex justify-between items-center border-b bg-background px-6 py-3">
      {/* Dynamic Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {segments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/");
            const isLast = index === segments.length - 1;

            return (
              <div key={index} className="flex items-center">
               <BreadcrumbSeparator className="mr-2.5"/>
                <BreadcrumbItem>
                  {isLast ? (
                    <span className="font-medium text-foreground/70">
                      {formatSegment(segment)}
                    </span>
                  ) : (
                    <BreadcrumbLink asChild className="pl-5">
                      <Link href={href}>{formatSegment(segment)}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <span className="text-sm">{session?.user?.name}</span>
        <Button
          className="cursor-pointer"
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Sign out
        </Button>
      </div>
    </header>
  );
}
