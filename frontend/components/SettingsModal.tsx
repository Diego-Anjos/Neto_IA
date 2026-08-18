import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../hooks/useTranslations';

interface SettingsModalProps {
    onClose: () => void;
    onClearHistory: () => void;
}

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-pink-400">
        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 5.85c-.09.55-.525.954-1.095 1.034l-3.026.504a1.875 1.875 0 0 0-1.685 1.686l-.505 3.026c-.08.57.345 1.006.915 1.095l2.454.409c.57.095.955.526 1.035 1.095l.41 2.454c.08.57.525.915 1.095.915h3.85c.57 0 1.015-.345 1.095-.915l.41-2.454c.08-.57.465-1 .915-1.095l2.454-.409c.57-.08.995-.526.915-1.095l-.505-3.026a1.875 1.875 0 0 0-1.685-1.686l-3.026-.504c-.57-.095-1.005-.484-1.095-1.034l-.178-2.032a1.875 1.875 0 0 0-1.85-1.567h-3.85Zm-1.23 12.585c0 .03.002.06.006.09l.41 2.454a.375.375 0 0 0 .33.33l2.454.409a.375.375 0 0 0 .33-.006l.09-.006a2.25 2.25 0 1 0-3.95-2.954ZM12 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" clipRule="evenodd" />
    </svg>
);


const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onClearHistory }) => {
    const { language, setLanguage } = useLanguage();
    const t = useTranslations();

    const handleClearClick = () => {
        if (window.confirm(t('clearHistoryConfirmation'))) {
            onClearHistory();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease-out]">
            <div className="w-full max-w-lg p-8 space-y-6 bg-[#251544] rounded-xl shadow-lg border border-white/10">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-violet-900/50 flex items-center justify-center">
                        <SettingsIcon />
                    </div>
                    <h2 className="text-3xl font-bold text-white">{t('settingsTitle')}</h2>
                    <p className="mt-2 text-gray-400">{t('settingsSubtitle')}</p>
                </div>

                <div className="space-y-6 pt-4">
                    <div>
                        <h3 className="font-semibold text-lg text-white mb-2">{t('language')}</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setLanguage('pt-BR')}
                                className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-colors ${
                                    language === 'pt-BR'
                                        ? 'bg-pink-600 text-white'
                                        : 'bg-violet-700/50 text-gray-300 hover:bg-violet-700/80'
                                }`}
                            >
                                Português
                            </button>
                            <button
                                onClick={() => setLanguage('es-ES')}
                                className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-colors ${
                                    language === 'es-ES'
                                        ? 'bg-pink-600 text-white'
                                        : 'bg-violet-700/50 text-gray-300 hover:bg-violet-700/80'
                                }`}
                            >
                                Español
                            </button>
                        </div>
                    </div>

                    <div className="border-2 border-red-500/50 rounded-lg p-4">
                        <h3 className="font-semibold text-lg text-red-400">{t('dangerZone')}</h3>
                        <p className="text-sm text-gray-400 mt-1 mb-4">{t('dangerZoneDescription')}</p>
                        <button
                            onClick={handleClearClick}
                            className="w-full px-4 py-3 font-semibold text-white bg-red-600/80 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            {t('clearHistoryButton')}
                        </button>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 font-semibold text-white bg-violet-700/50 rounded-lg hover:bg-violet-700/80 transition-colors"
                    >
                        {t('closeButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
