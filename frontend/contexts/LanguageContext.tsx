import React, { createContext, useState, useContext, useEffect, useMemo, ReactNode } from 'react';
import type { Language } from '../utils/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        try {
            const savedLang = localStorage.getItem('netoia-language');
            return (savedLang === 'pt-BR' || savedLang === 'es-ES') ? savedLang : 'pt-BR';
        } catch {
            return 'pt-BR';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('netoia-language', language);
            document.documentElement.lang = language === 'es-ES' ? 'es' : 'pt-BR';
        } catch (error) {
            console.error("Failed to save language to localStorage", error);
        }
    }, [language]);

    const value = useMemo(() => ({ language, setLanguage }), [language]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
