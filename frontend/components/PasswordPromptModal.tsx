import React, { useState } from 'react';
import type { User } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface PasswordPromptModalProps {
    user: User;
    onConfirm: (password: string) => void;
    onCancel: () => void;
    error: string;
}

const PasswordPromptModal: React.FC<PasswordPromptModalProps> = ({ user, onConfirm, onCancel, error }) => {
    const [password, setPassword] = useState('');
    const t = useTranslations();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(password);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease-out]">
            <div className="w-full max-w-sm p-8 space-y-6 bg-[#251544] rounded-xl shadow-lg border border-white/10">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white text-3xl">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{t('switchToUserTitle', { userName: user.name })}</h2>
                    <p className="mt-2 text-gray-400">{t('passwordPromptInstruction')}</p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="relative">
                         <input
                            type="password"
                            id="switch-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                            placeholder=" "
                            className="block w-full px-4 py-3 text-white bg-transparent border-2 border-violet-700 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-pink-500 peer"
                        />
                        <label
                            htmlFor="switch-password"
                            className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#251544] px-2 peer-focus:px-2 peer-focus:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                        >
                            {t('passwordLabel')}
                        </label>
                    </div>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                    <div className="flex gap-4 pt-2">
                         <button
                            type="button"
                            onClick={onCancel}
                            className="w-full px-4 py-3 font-semibold text-white bg-violet-700/50 rounded-lg hover:bg-violet-700/80 transition-colors"
                        >
                            {t('cancelButton')}
                        </button>
                        <button
                            type="submit"
                            className="w-full px-4 py-3 font-semibold text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
                        >
                            {t('confirmButton')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordPromptModal;