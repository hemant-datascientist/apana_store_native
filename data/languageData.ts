// ============================================================
// LANGUAGE DATA — Apana Store
//
// All languages available in the app.
// nativeName — shown in the language's own script (primary)
// englishName — shown as subtitle for discoverability
// Currently English is the only fully translated locale;
// others are ready slots for future i18n implementation.
// ============================================================

export interface Language {
  code:        string;
  nativeName:  string;
  englishName: string;
  flag:        string;
}

export const DEFAULT_LANGUAGE_CODE = "en";

export const LANGUAGES: Language[] = [
  { code: "en", nativeName: "English",    englishName: "English",    flag: "🇬🇧" },
  { code: "hi", nativeName: "हिंदी",      englishName: "Hindi",      flag: "🇮🇳" },
  { code: "mr", nativeName: "मराठी",      englishName: "Marathi",    flag: "🇮🇳" },
  { code: "bn", nativeName: "বাংলা",      englishName: "Bengali",    flag: "🇮🇳" },
  { code: "ta", nativeName: "தமிழ்",      englishName: "Tamil",      flag: "🇮🇳" },
  { code: "te", nativeName: "తెలుగు",     englishName: "Telugu",     flag: "🇮🇳" },
  { code: "kn", nativeName: "ಕನ್ನಡ",      englishName: "Kannada",    flag: "🇮🇳" },
  { code: "gu", nativeName: "ગુજરાતી",    englishName: "Gujarati",   flag: "🇮🇳" },
  { code: "pa", nativeName: "ਪੰਜਾਬੀ",     englishName: "Punjabi",    flag: "🇮🇳" },
  { code: "ml", nativeName: "മലയാളം",     englishName: "Malayalam",  flag: "🇮🇳" },
  { code: "or", nativeName: "ଓଡ଼ିଆ",       englishName: "Odia",       flag: "🇮🇳" },
  { code: "as", nativeName: "অসমীয়া",    englishName: "Assamese",   flag: "🇮🇳" },
  { code: "ur", nativeName: "اردو",       englishName: "Urdu",       flag: "🇵🇰" },
];
