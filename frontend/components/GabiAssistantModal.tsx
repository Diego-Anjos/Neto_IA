import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface GabiAssistantModalProps {
    onClose: () => void;
    onSubmit: (feedback: string) => void;
}

const GabiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-pink-400">
        <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3.375a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75zm0 3.75a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75zm0 3.75a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" clipRule="evenodd" />
    </svg>
);

const GabiAssistantModal: React.FC<GabiAssistantModalProps> = ({ onClose, onSubmit }) => {
    const [feedback, setFeedback] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const t = useTranslations();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedback.trim()) {
            onSubmit(feedback);
            setIsSubmitted(true);
        }
    };

    const handleSendAnother = () => {
        setFeedback('');
        setIsSubmitted(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease-out]">
            <div className="w-full max-w-lg p-8 space-y-6 bg-[#251544] rounded-xl shadow-lg border border-white/10">
                {isSubmitted ? (
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-violet-900/50 flex items-center justify-center">
                            <GabiIcon />
                        </div>
                        <h2 className="text-3xl font-bold text-white">{t('gabiSuccessTitle')}</h2>
                        <p className="mt-2 text-gray-400">
                            {t('gabiSuccessMessage')}
                        </p>
                        <div className="flex gap-4 pt-8">
                             <button
                                type="button"
                                onClick={onClose}
                                className="w-full px-4 py-3 font-semibold text-white bg-violet-700/50 rounded-lg hover:bg-violet-700/80 transition-colors"
                            >
                                {t('closeButton')}
                            </button>
                            <button
                                type="button"
                                onClick={handleSendAnother}
                                className="w-full px-4 py-3 font-semibold text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
                            >
                                {t('sendAnotherFeedbackButton')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-violet-900/50 flex items-center justify-center">
                                <GabiIcon />
                            </div>
                            <h2 className="text-3xl font-bold text-white">{t('gabiTitle')}</h2>
                            <p className="mt-2 text-gray-400">
                                {t('gabiSubtitle')}
                            </p>
                        </div>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder={t('feedbackPlaceholder')}
                                rows={5}
                                className="block w-full px-4 py-3 text-white bg-transparent border-2 border-violet-700 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-pink-500 resize-none"
                                aria-label={t('feedbackPlaceholder')}
                            />

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full px-4 py-3 font-semibold text-white bg-violet-700/50 rounded-lg hover:bg-violet-700/80 transition-colors"
                                >
                                    {t('cancelButton')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={!feedback.trim()}
                                    className="w-full px-4 py-3 font-semibold text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t('sendFeedbackButton')}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default GabiAssistantModal;