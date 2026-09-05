import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, translations } from '../i18n/translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = 'honeychain_lang';

// Alias map for dot-notation keys used across components
const KEY_ALIASES: Record<string, keyof Translations> = {
  'nav.title': 'appName',
  'nav.verifyHoney': 'navVerifyHoney',
  'nav.signIn': 'navSignIn',
  'nav.signOut': 'navSignOut',
  'common.search': 'btnSubmit',
  'common.loading': 'passportPending',
  'common.back': 'btnBack',
  'common.batch': 'passportBatch',
  'landing.enterBatchPlaceholder': 'manualInputPlaceholder',
  'provenance.title': 'twoModelsTitle',
  'provenance.directBeekeeper': 'modelDirectBeekeeper',
  'provenance.directDesc': 'modelDirectBeekeeperDesc',
  'provenance.companyManaged': 'modelCompanyManaged',
  'provenance.companyDesc': 'modelCompanyManagedDesc',
  'passport.title': 'passportTitle',
  'passport.verified': 'passportStatusVerified',
  'passport.blockchain': 'passportPillarBlockchain',
  'passport.aiEvidence': 'passportPillarAi',
  'passport.labAssay': 'passportPillarLab',
  'passport.originApiary': 'passportOriginApiary',
  'passport.floralSource': 'passportFloralSource',
  'passport.batchVolume': 'passportVolume',
  'passport.evidenceScore': 'passportEvidenceScore',
  'passport.timeline': 'passportTimelineTitle',
  'passport.disclaimer': 'passportDisclaimer'
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'hi') return stored;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.en;
    
    // Check alias or direct key
    const resolvedKey = KEY_ALIASES[key] || (key as keyof Translations);
    let str = dict[resolvedKey] || translations.en[resolvedKey] || (key as string);

    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        str = str.replace(new RegExp(`{${paramKey}}`, 'g'), String(val));
      });
    }
    return str;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};

