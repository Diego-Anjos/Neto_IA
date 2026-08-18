import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import { useTranslations } from '../hooks/useTranslations';

const QuestionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-3 text-pink-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-3 text-pink-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>;
const BulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-3 text-pink-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c1.433-.923 2.553-2.52 3.75-4.622m0 0a7.5 7.5 0 0 1 7.5 0c-1.197 2.102-2.317 3.699-3.75 4.622M12 6.75a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Z" /></svg>;


interface WelcomeScreenProps {
    userName: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ userName }) => {
    const t = useTranslations();
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-200 p-8">
            <h2 className="text-4xl font-bold mb-2 text-white">{t('welcomeTitle', { userName })}</h2>
            <p className="mt-2 mb-10 max-w-lg text-lg text-gray-400">{t('welcomeSubtitle')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
                <div className="bg-violet-900/40 p-6 rounded-xl border border-white/10">
                    <QuestionIcon />
                    <h3 className="font-semibold text-lg mb-1 text-white">{t('welcomeCard1Title')}</h3>
                    <p className="text-gray-400 text-sm">{t('welcomeCard1Body')}</p>
                </div>
                <div className="bg-violet-900/40 p-6 rounded-xl border border-white/10">
                    <BookIcon />
                    <h3 className="font-semibold text-lg mb-1 text-white">{t('welcomeCard2Title')}</h3>
                    <p className="text-gray-400 text-sm">{t('welcomeCard2Body')}</p>
                </div>
                <div className="bg-violet-900/40 p-6 rounded-xl border border-white/10">
                    <BulbIcon />
                    <h3 className="font-semibold text-lg mb-1 text-white">{t('welcomeCard3Title')}</h3>
                    <p className="text-gray-400 text-sm">{t('welcomeCard3Body')}</p>
                </div>
            </div>
        </div>
    );
};


interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
    userName: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, userName }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <main className="flex-1 flex flex-col h-screen max-h-screen">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                    <WelcomeScreen userName={userName} />
                ) : (
                    messages.map((msg, index) => (
                        <MessageBubble key={index} message={msg} />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-6 pt-2">
                <InputBar onSendMessage={onSendMessage} />
            </div>
        </main>
    );
};

export default ChatInterface;