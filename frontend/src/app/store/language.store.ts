type Lang = 'en' | 'id';

let currentLanguage: Lang = (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as Lang) || 'en';

export function setLang(lang: Lang) {
  currentLanguage = lang;
  localStorage.setItem('lang', lang);
}

export function getLang(): Lang {
  if(typeof window !== 'undefined') {
    const lang = localStorage.getItem('lang') as Lang;
    return lang;
  }
  return 'en' as Lang;
}