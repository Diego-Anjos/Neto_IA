import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import LoginScreen from './components/LoginScreen';
import RegistrationScreen from './components/RegistrationScreen';
import PasswordPromptModal from './components/PasswordPromptModal';
import GabiAssistantModal from './components/GabiAssistantModal';
import SettingsModal from './components/SettingsModal';
import { getInstructionsFromGemini, generateTitleFromQuery } from './services/geminiService';
import { useLanguage } from './contexts/LanguageContext';
import { useTranslations } from './hooks/useTranslations';
import type { Message, Conversation, User } from './types';


const GabiTriggerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.15l-2.11 2.42a.875.875 0 01-1.245 0l-2.11-2.42a.39.39 0 00-.297-.15 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.74c0-1.946 1.37-3.68 3.348-3.97zM8.25 9.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
    </svg>
);


const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authView, setAuthView] = useState<'login' | 'register'>('login');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [switchingUser, setSwitchingUser] = useState<User | null>(null);
    const [switchError, setSwitchError] = useState<string>('');
    const [isGabiVisible, setIsGabiVisible] = useState(false);
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
    
    const { language } = useLanguage();
    const t = useTranslations();


    // Load users and check for logged-in user on initial load
    useEffect(() => {
        try {
            const usersObject = JSON.parse(localStorage.getItem('netoia-users') || '{}');
            const usersArray = Object.values(usersObject) as User[];
            setAllUsers(usersArray);

            const loggedInUserEmail = localStorage.getItem('netoia-current-user');
            if (loggedInUserEmail && usersObject[loggedInUserEmail]) {
                setCurrentUser(usersObject[loggedInUserEmail]);
            }
        } catch (error) {
            console.error("Failed to load users or session", error);
        }
    }, []);

    // Load conversations for the current user
    useEffect(() => {
        if (!currentUser) {
            setConversations([]);
            setActiveConversationId(null);
            return;
        }

        try {
            const userConvoKey = `netoia-conversations-${currentUser.email}`;
            const savedConversations = localStorage.getItem(userConvoKey);
            if (savedConversations) {
                const parsedConversations: Conversation[] = JSON.parse(savedConversations);
                if (parsedConversations.length > 0) {
                    setConversations(parsedConversations);
                    const userActiveIdKey = `netoia-active-id-${currentUser.email}`;
                    const lastActiveId = localStorage.getItem(userActiveIdKey);
                    setActiveConversationId(lastActiveId || parsedConversations[0].id);
                    return;
                }
            }
        } catch (error) {
            console.error("Failed to load conversations for user", error);
        }

        // If no saved data for this user, start a new conversation
        const newConversation: Conversation = {
            id: `convo-${Date.now()}`,
            title: t('newConversation'),
            messages: [],
        };
        setConversations([newConversation]);
        setActiveConversationId(newConversation.id);

    }, [currentUser, t]);

    // Save conversations to localStorage whenever they change
    useEffect(() => {
        if (!currentUser || conversations.length === 0) return;
        
        const userConvoKey = `netoia-conversations-${currentUser.email}`;
        const userActiveIdKey = `netoia-active-id-${currentUser.email}`;
        
        localStorage.setItem(userConvoKey, JSON.stringify(conversations));

        if (activeConversationId) {
            localStorage.setItem(userActiveIdKey, activeConversationId);
        } else {
            localStorage.removeItem(userActiveIdKey);
        }
    }, [conversations, activeConversationId, currentUser]);
    
    const handleLoginSuccess = (user: User) => {
        setCurrentUser(user);
        localStorage.setItem('netoia-current-user', user.email);
        
        const userExists = allUsers.some(u => u.email === user.email);
        if (!userExists) {
            setAllUsers(prev => [...prev, user]);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('netoia-current-user');
    };

    const handleNewConversation = useCallback(() => {
        const newConversation: Conversation = {
            id: `convo-${Date.now()}`,
            title: t('newConversation'),
            messages: [],
        };
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
    }, [t]);

    const handleSelectConversation = (id: string) => {
        setActiveConversationId(id);
    };
    
    const handleSwitchUser = (user: User) => {
        if (currentUser?.email !== user.email) {
            setSwitchError(''); // Clear previous errors on new attempt
            setSwitchingUser(user);
        }
    };

    const handleConfirmSwitch = (password: string) => {
        if (!switchingUser) return;
        
        // In a real app, you'd compare a hash. Here we compare plaintext.
        if (switchingUser.passwordHash === password) {
            handleLoginSuccess(switchingUser);
            setSwitchingUser(null);
            setSwitchError('');
        } else {
            setSwitchError(t('incorrectPasswordError'));
        }
    };

    const handleCancelSwitch = () => {
        setSwitchingUser(null);
        setSwitchError('');
    };


    const handleDeleteConversation = (idToDelete: string) => {
        const updatedConversations = conversations.filter(c => c.id !== idToDelete);

        if (updatedConversations.length === 0) {
            handleNewConversation();
            return;
        }
        
        setConversations(updatedConversations);

        if (activeConversationId === idToDelete) {
            setActiveConversationId(updatedConversations[0].id);
        }
    };
    
    const handleSubmitFeedback = (feedback: string) => {
        console.log("Feedback recebido:", feedback); // In a real app, this would send to a server
        // The modal now handles displaying a confirmation message and closing.
    };

    const handleClearAllConversations = () => {
        if (!currentUser) return;
    
        const userConvoKey = `netoia-conversations-${currentUser.email}`;
        localStorage.removeItem(userConvoKey);
        const userActiveIdKey = `netoia-active-id-${currentUser.email}`;
        localStorage.removeItem(userActiveIdKey);
    
        const newConversation: Conversation = {
            id: `convo-${Date.now()}`,
            title: t('newConversation'),
            messages: [],
        };
    
        setConversations([newConversation]);
        setActiveConversationId(newConversation.id);
    
        setIsSettingsModalVisible(false);
    };

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !activeConversationId) return;
    
        const userMessage: Message = { role: 'user', content: text };
        const loadingMessage: Message = { role: 'loading', content: '' };
        
        const activeConvo = conversations.find(c => c.id === activeConversationId);
        const isFirstMessage = activeConvo?.messages.length === 0;
    
        setConversations(prev =>
            prev.map(convo =>
                convo.id === activeConversationId
                    ? { ...convo, messages: [...convo.messages, userMessage, loadingMessage] }
                    : convo
            )
        );
    
        if (isFirstMessage) {
            setConversations(prev =>
                prev.map(convo =>
                    convo.id === activeConversationId ? { ...convo, title: t('generatingTitle') } : convo
                )
            );
    
            try {
                const newTitle = await generateTitleFromQuery(text, language);
                setConversations(prev =>
                    prev.map(convo =>
                        convo.id === activeConversationId ? { ...convo, title: newTitle } : convo
                    )
                );
            } catch (error) {
                console.error("Falha ao gerar título, usando fallback:", error);
                const fallbackTitle = text.substring(0, 35) + (text.length > 35 ? '...' : '');
                setConversations(prev =>
                    prev.map(convo =>
                        convo.id === activeConversationId ? { ...convo, title: fallbackTitle } : convo
                    )
                );
            }
        }
    
        try {
            const responseContent = await getInstructionsFromGemini(text, language);
            const assistantMessage: Message = { role: 'assistant', content: responseContent };
            setConversations(prev =>
                prev.map(convo =>
                    convo.id === activeConversationId
                        ? { ...convo, messages: [...convo.messages.slice(0, -1), assistantMessage] }
                        : convo
                )
            );
        } catch (error) {
            const errorMessageContent = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
            const errorMessage: Message = { role: 'error', content: errorMessageContent };
            setConversations(prev =>
                prev.map(convo =>
                    convo.id === activeConversationId
                        ? { ...convo, messages: [...convo.messages.slice(0, -1), errorMessage] }
                        : convo
                )
            );
        }
    };

    if (!currentUser) {
        return authView === 'login' ? (
            <LoginScreen onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setAuthView('register')} />
        ) : (
            <RegistrationScreen onRegisterSuccess={handleLoginSuccess} onSwitchToLogin={() => setAuthView('login')} />
        );
    }
    
    const activeConversation = conversations.find(c => c.id === activeConversationId);

    return (
        <div className="flex h-screen bg-gradient-to-br from-[#1e103d] to-[#1b1429] text-white font-sans">
            <Sidebar 
                user={currentUser}
                allUsers={allUsers}
                conversations={conversations}
                activeConversationId={activeConversationId}
                onNewConversation={handleNewConversation}
                onSelectConversation={handleSelectConversation}
                onDeleteConversation={handleDeleteConversation}
                onSwitchUser={handleSwitchUser}
                onLogout={handleLogout}
                onOpenSettings={() => setIsSettingsModalVisible(true)}
            />
            {activeConversation && (
                <ChatInterface
                    key={activeConversation.id}
                    messages={activeConversation.messages}
                    onSendMessage={handleSendMessage}
                    userName={currentUser.name}
                />
            )}

            <button
                onClick={() => setIsGabiVisible(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-pink-600 rounded-full shadow-lg flex items-center justify-center hover:bg-pink-700 transition-transform duration-200 active:scale-95 z-40"
                aria-label="Abrir assistente de feedback Gabi"
            >
                <GabiTriggerIcon />
            </button>
            
            {switchingUser && (
                <PasswordPromptModal 
                    user={switchingUser}
                    onConfirm={handleConfirmSwitch}
                    onCancel={handleCancelSwitch}
                    error={switchError}
                />
            )}

            {isGabiVisible && (
                <GabiAssistantModal 
                    onClose={() => setIsGabiVisible(false)}
                    onSubmit={handleSubmitFeedback}
                />
            )}

            {isSettingsModalVisible && (
                <SettingsModal 
                    onClose={() => setIsSettingsModalVisible(false)}
                    onClearHistory={handleClearAllConversations}
                />
            )}
        </div>
    );
};

export default App;