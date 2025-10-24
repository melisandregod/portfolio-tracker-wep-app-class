"use client";

import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const t = useTranslations("login");

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <Card className="w-full max-w-sm shadow-lg border border-slate-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
              className="h-5 w-5"
              fill="currentColor"
            >
              <path d="M488 261.8C488 403.3 391.1 504 248.8 504 111.1 504 0 392.9 0 255.2 0 117.5 111.1 6.4 248.8 6.4c66.8 0 122.8 24.5 166.7 64.9l-67.5 64.9C316.1 107.5 284.5 96 248.8 96 156.1 96 83.2 168.3 83.2 255.2S156.1 414.4 248.8 414.4c89.1 0 122.4-63.6 127.6-96.7H248.8v-77.9H488v22z" />
            </svg>
            {t("button")}
          </Button>

          <p className="text-xs text-slate-500 mt-4 text-center">
            {t("terms.text")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
