/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { RegisterForm } from "@/components/register-form";
import { GlobalAlert } from "@/components/alert";

export default function RegisterPage() {
  return (
    // Fullscreen centered container with light/dark background
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-300 dark:bg-gray-900">
      <div className="w-full max-w-sm">
        <RegisterForm />
        <GlobalAlert />
      </div>
    </div>
  );
}