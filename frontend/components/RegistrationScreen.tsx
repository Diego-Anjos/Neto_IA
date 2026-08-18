import React, { useState } from 'react';
import type { User } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface RegistrationScreenProps {
    onRegisterSuccess: (user: User) => void;
    onSwitchToLogin: () => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const t = useTranslations();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password) {
            setError(t('fillAllFieldsError'));
            return;
        }

        try {
            const users = JSON.parse(localStorage.getItem('netoia-users') || '{}');
            
            if (users[email]) {
                setError(t('emailExistsError'));
                return;
            }

            const newUser: User = {
                name,
                email,
                passwordHash: password, 
            };

            users[email] = newUser;
            localStorage.setItem('netoia-users', JSON.stringify(users));
            
            onRegisterSuccess(newUser);

        } catch (err) {
            setError(t('registerError'));
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-[#1e103d] to-[#1b1429]">
            <div className="w-full max-w-md p-8 space-y-8 bg-violet-900/40 rounded-xl shadow-lg border border-white/10">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white">
                        {t('createAccountTitle')}
                    </h1>
                    <p className="mt-2 text-gray-400">{t('createAccountSubtitle')}</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder=" "
                            className="block w-full px-4 py-3 text-white bg-transparent border-2 border-violet-700 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-pink-500 peer"
                        />
                        <label
                            htmlFor="name"
                            className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#251544] px-2 peer-focus:px-2 peer-focus:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                        >
                            {t('fullNameLabel')}
                        </label>
                    </div>
                     <div className="relative">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=" "
                            className="block w-full px-4 py-3 text-white bg-transparent border-2 border-violet-700 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-pink-500 peer"
                        />
                        <label
                            htmlFor="email"
                            className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#251544] px-2 peer-focus:px-2 peer-focus:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                        >
                            {t('emailLabel')}
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=" "
                            className="block w-full px-4 py-3 text-white bg-transparent border-2 border-violet-700 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-pink-500 peer"
                        />
                        <label
                            htmlFor="password"
                            className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#251544] px-2 peer-focus:px-2 peer-focus:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                        >
                            {t('createPasswordLabel')}
                        </label>
                    </div>
                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-3 font-semibold text-white bg-pink-600 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-900 transition-colors"
                        >
                            {t('registerAndLoginButton')}
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-gray-400">
                    {t('alreadyHaveAccount')}{' '}
                    <button onClick={onSwitchToLogin} className="font-medium text-pink-400 hover:underline">
                        {t('login')}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegistrationScreen;