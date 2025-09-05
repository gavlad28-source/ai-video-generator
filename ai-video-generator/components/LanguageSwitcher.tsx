
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';

const languageOptions = [
  { code: Language.EN, label: 'EN' },
  { code: Language.RU, label: 'RU' },
  { code: Language.HE, label: 'HE' },
];

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex space-x-1 bg-gray-700 p-1 rounded-full">
      {languageOptions.map((option) => (
        <button
          key={option.code}
          onClick={() => setLanguage(option.code)}
          className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
            language === option.code
              ? 'bg-indigo-600 text-white'
              : 'text-gray-300 hover:bg-gray-600'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
