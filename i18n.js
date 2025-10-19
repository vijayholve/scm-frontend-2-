// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 1. Import translation files for UTILITIES (menu sidebar)
import en_util from './locales/en/utilities.json';
import mr_util from './locales/mr/utilities.json';
import hi_util from './locales/hi/utilities.json';

// 2. Import translation files for DASHBOARD
import en_dash from './locales/en/dashboard.json';
import mr_dash from './locales/mr/dashboard.json';
import hi_dash from './locales/hi/dashboard.json';

// 3. Import other namespaces
import en_datagrid from './locales/en/datagrid.json';
import mr_Datagrid from './locales/mr/datagrid.json';
import hi_Datagrid from './locales/hi/datagrid.json';

// 4. NEW: ListGridFilters namespace
import en_lgf from './locales/en/ListGridFilters.json';
import mr_lgf from './locales/mr/ListGridFilters.json';
import hi_lgf from './locales/hi/ListGridFilters.json';


// 5. mainlayout namespace for Navbar title 
import en_mainlayout from './locales/en/mainlayout.json';
import mr_mainlayout from './locales/mr/mainlayout.json';
import hi_mainlayout from './locales/hi/mainlayout.json';
const resources = {
  en: {
    utilities: en_util.menu.masters,
    dashboard: en_dash,
    translation: { ...en_util, ...en_dash },
    datagrid: en_datagrid,
    ListGridFilters: en_lgf ,
    mainlayout: en_mainlayout
  },
  mr: {
    utilities: mr_util.menu.masters,
    dashboard: mr_dash,
    translation: { ...mr_util, ...mr_dash },
    datagrid: mr_Datagrid,
    ListGridFilters: mr_lgf ,
    mainlayout: mr_mainlayout
  },
  hi: {
    utilities: hi_util.menu.masters,
    dashboard: hi_dash,
    translation: { ...hi_util, ...hi_dash },
    datagrid: hi_Datagrid,
    ListGridFilters: hi_lgf ,
    mainlayout: hi_mainlayout
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    ns: ['utilities', 'dashboard', 'translation', 'datagrid', 'ListGridFilters'], // added
    defaultNS: 'translation',
    keySeparator: '.',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] }
  });

export default i18n;
