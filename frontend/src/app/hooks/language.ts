/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useEffect, useState } from 'react';
import en from '../i18n/en.json';
import id from '../i18n/id.json';
import { getLang } from '../store/language.store';

const languages = {
  en,
  id,
};

export function usei18n() {
  const [lang, setLangState] = useState<'en' | 'id'>('en');

  useEffect(() => {
    const savedLang = getLang();
    if (savedLang && (savedLang === 'en' || savedLang === 'id')) {
      setLangState(savedLang);
    }
  }, []);

  if (!lang) {
    return { t: en, lang: 'en' }; // fallback during hydration
  }

  return { t: languages[lang] || languages['en'], lang };
}