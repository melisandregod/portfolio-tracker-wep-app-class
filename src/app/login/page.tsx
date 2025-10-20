"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6">
        Sign in to Portfolio Tracker
      </h1>
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </div>
  );
}
