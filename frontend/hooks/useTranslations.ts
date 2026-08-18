import { useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

type TranslationKey = keyof typeof translations['pt-BR'];

export const useTranslations = () => {
    const { language } = useLanguage();

    const t = useCallback((key: TranslationKey, params?: { [key: string]: string | number }): string => {
        let text = translations[language][key] || key;
        if (params) {
            Object.keys(params).forEach(paramKey => {
                text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(params[paramKey]));
            });
        }
        return text;
    }, [language]);

    return t;
};
