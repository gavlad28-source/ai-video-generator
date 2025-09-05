
import { useLanguage } from '../contexts/LanguageContext';

export const useLocalization = () => {
  const { t } = useLanguage();
  return { t };
};
