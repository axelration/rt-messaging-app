/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { useState } from "react";
import { usei18n } from "@/hooks/language";
import { apiFetch } from "@/lib/api";
import { setAuthState } from "@/store/auth.store";
import { connectSocket } from "@/lib/socket";

export default function LoginPage() {
  const { t } = usei18n();
  if (!t) return null; // Handle case where translations are not loaded yet

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }).then((res) => {
        setAuthState(res);

        // Store access token in cookie for Socket.IO authentication and route protection
        document.cookie = `accessToken=${res.accessToken}; path=/`;
        document.cookie = `refreshToken=${res.refreshToken}; path=/`;

        connectSocket(res.accessToken);
      }).finally(() => window.location.href = '/chat');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.login_error;
      alert(errorMessage);
    }
  }

  return (
    // Fullscreen centered container with light/dark background
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      {/* Login form container with white/dark background, padding, rounded corners, and shadow */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded shadow w-80">
        {/* Header with title */}
        <h1 className="text-2xl mb-4 text-center dark:text-white">
          {t.login_title}
        </h1>

      </div>
    </div>
  );
}