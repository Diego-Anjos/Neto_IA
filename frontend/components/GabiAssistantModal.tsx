import React, { useState } from 'react';
import { Bot, Check } from 'lucide-react';
import { useTranslations } from '../hooks/useTranslations';
import { sendFeedback } from '../services/api';

interface GabiAssistantModalProps {
    onClose: () => void;
    userId?: string;
}

const GabiAssistantModal: React.FC<GabiAssistantModalProps> = ({ onClose, userId }) => {
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const t = useTranslations();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const message = feedback.trim();
        if (!message || isSubmitting) return;

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            await sendFeedback(message, userId);
            setIsSuccess(true);
        } catch (error) {
            console.error('Falha ao enviar feedback', error);
            setErrorMessage(t('gabiFeedbackError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="gabi-modal-title"
                className="w-full max-w-lg bg-[#1b1429] border border-violet-700 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                {isSuccess ? (
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-600/30 border border-pink-400/30 flex items-center justify-center shadow-lg shadow-pink-600/10">
                            <Check className="w-10 h-10 text-pink-400" strokeWidth={2.5} aria-hidden="true" />
                        </div>
                        <h2 id="gabi-modal-title" className="text-3xl font-bold text-white">
                            {t('gabiSuccessTitle')}
                        </h2>
                        <p className="mt-3 text-lg text-gray-300">
                            {t('gabiSuccessMessage')}
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-8 w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-pink-600/20 transition-all"
                        >
                            {t('closeButton')}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-600/30 border border-pink-400/30 flex items-center justify-center shadow-lg shadow-pink-600/10">
                                <Bot className="w-10 h-10 text-pink-300" strokeWidth={1.8} aria-hidden="true" />
                            </div>
                            <h2 id="gabi-modal-title" className="text-3xl font-bold text-white">
                                {t('gabiTitle')}
                            </h2>
                            <p className="mt-2 text-lg text-gray-300">
                                {t('gabiSubtitle')}
                            </p>
                        </div>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder={t('feedbackPlaceholder')}
                                disabled={isSubmitting}
                                className="w-full bg-[#140f1f] border border-violet-700/50 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all rounded-xl p-4 text-lg text-white resize-none min-h-[120px] placeholder:text-gray-500 focus:outline-none disabled:opacity-60"
                                aria-label={t('feedbackPlaceholder')}
                            />

                            {errorMessage && (
                                <p className="text-base text-red-400" role="alert">
                                    {errorMessage}
                                </p>
                            )}

                            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="px-6 py-3 text-gray-400 font-semibold hover:text-white hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {t('cancelButton')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={!feedback.trim() || isSubmitting}
                                    className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-pink-600/20 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? t('sendingFeedbackButton') : t('sendFeedbackButton')}
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
