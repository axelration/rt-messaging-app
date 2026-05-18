/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { logout } from "@/lib/auth";

export default function LoginPage() {
  logout();
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-300 dark:bg-gray-900">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">You have been logged out.</h1>
    </div>
  );
}