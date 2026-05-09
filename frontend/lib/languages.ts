import type { Language } from "./api";

// ─────────────────────────────────────────────────────────────
//  languages.ts — Output language options
// ─────────────────────────────────────────────────────────────

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English",   nativeName: "English",   flag: "EN" },
  { code: "hi", name: "Hindi",     nativeName: "हिन्दी",      flag: "HI" },
  { code: "es", name: "Spanish",   nativeName: "Español",    flag: "ES" },
  { code: "fr", name: "French",    nativeName: "Français",   flag: "FR" },
  { code: "de", name: "German",    nativeName: "Deutsch",    flag: "DE" },
  { code: "ja", name: "Japanese",  nativeName: "日本語",      flag: "JA" },
  { code: "ar", name: "Arabic",    nativeName: "العربية",    flag: "AR" },
  { code: "zh", name: "Chinese",   nativeName: "中文",        flag: "ZH" },
];

export function getLanguage(code: Language): LanguageOption {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
