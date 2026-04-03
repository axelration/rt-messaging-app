"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/lib/auth";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const doLogout = async () => {
      try {
        await logout();
      } finally {
        if (active) {
          router.replace("/login");
        }
      }
    };
    doLogout();
    return () => {
      active = false;
    };
  }, [router]);

  return <p>Logging out...</p>;
}