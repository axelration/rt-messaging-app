/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { setLang, getLang } from '../../store/language.store';
import { useEffect, useState } from "react";
import { usei18n } from "../../hooks/language";

export default function LanguageToggle() {
  const [lang, setLangState] = useState<'en' | 'id'>('en');

  useEffect(() => {
    const savedLang = getLang();
    if (savedLang && (savedLang === 'en' || savedLang === 'id')) {
      setLangState(savedLang);
    }
  }, []);

  const { t } = usei18n();
  if (!t) return null; // Handle case where translations are not loaded yet

  function toggleLanguage() {
    const newLang = lang === 'en' ? 'id' : 'en';
    setLang(newLang);
    setLangState(newLang);

    window.location.reload(); // Reload to apply language changes across the app
  }

  return (
    <button
      id="toggle_language"
      onClick={toggleLanguage}
      title={t.toggle_language}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
        {lang.toUpperCase()}
    </button>
  );
}