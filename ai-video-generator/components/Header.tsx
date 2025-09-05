
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { LanguageSwitcher } from './LanguageSwitcher';
import { FilmIcon } from './icons';

export const Header: React.FC = () => {
  const { t } = useLocalization();

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FilmIcon className="w-8 h-8 text-indigo-400" />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {t('appTitle')}
          </h1>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
};
