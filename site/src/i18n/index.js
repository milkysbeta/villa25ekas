/* ============================================================================
   Languages

   John's decision: English only at launch, other languages later. So the
   machinery is here and wired up, with only English switched on.

   Adding Indonesian, German or French later means dropping a JSON file into
   ./locales and adding the code to LIVE — no component has to change, because
   nothing hard-codes a string. Retrofitting this after launch would have meant
   touching every page, which is why it is here now despite shipping in one
   language.

   Translations must be reviewed by a native speaker before going live. A
   clumsy French sentence does more damage to a luxury brand than no French.
   ========================================================================= */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';

export const ALL_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'fr', label: 'French', native: 'Français' },
];

/** Only these appear in the switcher. Add a code once its file is reviewed. */
export const LIVE = ['en'];

export const liveLanguages = () =>
  ALL_LANGUAGES.filter((l) => LIVE.includes(l.code));

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en } },
    fallbackLng: 'en',
    supportedLngs: LIVE,
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'v25-lang',
      caches: ['localStorage'],
    },
  });

export default i18n;
