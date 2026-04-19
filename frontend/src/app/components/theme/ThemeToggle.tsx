/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usei18n } from "../../hooks/language";
import { LuMoon, LuSun } from "react-icons/lu";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [ mounted, setMounted ] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { t } = usei18n();
  if (!t) return null; // Handle case where translations are not loaded yet

  // Prevents hydration mismatch by ensuring the component is only rendered on the client
  if (!mounted) {
    return null;
  }

  return (
    <button
      id="toggle_theme"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      >
      {t.toggle_theme}
    </button>
  );
}