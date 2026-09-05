import React from 'react';
import { useTranslation } from '../context/I18nContext';
import { Languages } from 'lucide-react';

export const LanguageSelector: React.FC<{ variant?: 'navbar' | 'compact' | 'pill' }> = ({ variant = 'navbar' }) => {
  const { language, setLanguage } = useTranslation();

  if (variant === 'pill') {
    return (
      <div className="inline-flex items-center bg-[#FAF8F5] border border-[#D6C7B2] p-0.5 rounded-full text-xs">
        <button
          onClick={() => setLanguage('en')}
          className={`px-2.5 py-1 rounded-full font-medium transition ${
            language === 'en' ? 'bg-amber-700 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('hi')}
          className={`px-2.5 py-1 rounded-full font-medium transition ${
            language === 'hi' ? 'bg-amber-700 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          हिन्दी
        </button>
      </div>
    );
  }

  return (
    <div className="h-9 flex items-center space-x-1 bg-[#FAF8F5] p-1 rounded-full border border-[#D6C7B2] text-xs">
      <Languages className="w-3.5 h-3.5 text-stone-500 ml-1.5" />
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-full font-semibold transition ${
          language === 'en'
            ? 'bg-amber-700 text-white shadow-2xs'
            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('hi')}
        className={`px-2.5 py-1 rounded-full font-semibold transition ${
          language === 'hi'
            ? 'bg-amber-700 text-white shadow-2xs'
            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
};
