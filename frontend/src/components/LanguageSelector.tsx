import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../context/I18nContext';
import { Language, LANGUAGE_LABELS } from '../i18n/translations';
import { ChevronDown, Globe } from 'lucide-react';

const LANGUAGES: Language[] = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa'];

export const LanguageSelector: React.FC<{ variant?: 'navbar' | 'compact' | 'pill' }> = ({ variant = 'navbar' }) => {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = LANGUAGE_LABELS[language];

  if (variant === 'pill') {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 bg-[#FAF8F5] border border-[#D6C7B2] px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:bg-amber-50 transition"
        >
          <Globe className="w-3.5 h-3.5 text-stone-500" />
          <span>{currentLabel.native}</span>
          <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#D6C7B2] rounded-xl shadow-lg py-1 z-50 max-h-64 overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-amber-50 transition ${
                  language === lang ? 'bg-amber-50 text-amber-900 font-bold' : 'text-stone-700'
                }`}
              >
                <span>{LANGUAGE_LABELS[lang].native}</span>
                <span className="text-[10px] text-stone-400 font-normal">{LANGUAGE_LABELS[lang].english}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 flex items-center gap-1.5 bg-[#FAF8F5] px-3 rounded-full border border-[#D6C7B2] text-xs font-semibold text-stone-700 hover:bg-amber-50 hover:border-amber-400 transition"
      >
        <Globe className="w-3.5 h-3.5 text-stone-500" />
        <span>{currentLabel.native}</span>
        <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-[#D6C7B2] rounded-xl shadow-lg py-1 z-50 max-h-72 overflow-y-auto">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => { setLanguage(lang); setIsOpen(false); }}
              className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-amber-50 transition ${
                language === lang ? 'bg-amber-50 text-amber-900 font-bold' : 'text-stone-700'
              }`}
            >
              <span>{LANGUAGE_LABELS[lang].native}</span>
              <span className="text-[10px] text-stone-400 font-normal">{LANGUAGE_LABELS[lang].english}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
