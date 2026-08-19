import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import LoginScreen from './components/LoginScreen';
import RegistrationScreen from './components/RegistrationScreen';
import PasswordPromptModal from './components/PasswordPromptModal';
import GabiAssistantModal from './components/GabiAssistantModal';
import SettingsModal from './components/SettingsModal';
import { getInstructionsFromGemini, generateTitleFromQuery } from './services/geminiService';
import {
    createNewConversation,
    deleteConversation,
    deleteUserConversations,
    fetchMessages,
    fetchUserConversations,
    fetchUsers,
    loginUser,
    saveMessageToDb,
    updateConversationTitle,
} from './services/api';
import { useLanguage } from './contexts/LanguageContext';
import { useTranslations } from './hooks/useTranslations';
import type { Message, Conversation, User } from './types';

const CURRENT_USER_KEY = 'netoia-current-user';


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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const { language } = useLanguage();
    const t = useTranslations();

    const loadMessagesForConversation = useCallback(async (conversationId: string) => {
        try {
            const messages = await fetchMessages(conversationId);
            setConversations(prev =>
                prev.map(convo =>
                    convo.id === conversationId ? { ...convo, messages } : convo
                )
            );
        } catch (error) {
            console.error('Falha ao carregar mensagens', error);
        }
    }, []);

    const loadConversationsForUser = useCallback(async (user: User) => {
        try {
            let userConversations = await fetchUserConversations(user.id);

            if (userConversations.length === 0) {
                const created = await createNewConversation(user.id, t('newConversation'));
                userConversations = [created];
            }

            setConversations(userConversations);
            const firstId = userConversations[0].id;
            setActiveConversationId(firstId);
            await loadMessagesForConversation(firstId);
        } catch (error) {
            console.error('Falha ao carregar conversas do usuário', error);
        }
    }, [loadMessagesForConversation, t]);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const users = await fetchUsers();
                setAllUsers(users);

                const savedUser = localStorage.getItem(CURRENT_USER_KEY);
                if (!savedUser) return;

                const parsedUser: User = JSON.parse(savedUser);
                const matchedUser = users.find(user => user.id === parsedUser.id || user.email === parsedUser.email);
                if (matchedUser) {
                    setCurrentUser(matchedUser);
                }
            } catch (error) {
                console.error('Falha ao restaurar sessão', error);
            }
        };

        restoreSession();
    }, []);

    useEffect(() => {
        if (!currentUser) {
            setConversations([]);
            setActiveConversationId(null);
            return;
        }

        loadConversationsForUser(currentUser);
    }, [currentUser, loadConversationsForUser]);
    
    const handleLoginSuccess = (user: User) => {
        setCurrentUser(user);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        setAllUsers(prev => {
            const exists = prev.some(item => item.id === user.id);
            return exists ? prev.map(item => item.id === user.id ? user : item) : [...prev, user];
        });
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem(CURRENT_USER_KEY);
    };

    const handleNewConversation = useCallback(async () => {
        if (!currentUser) return;

        try {
            const newConversation = await createNewConversation(currentUser.id, t('newConversation'));
            setConversations(prev => [newConversation, ...prev]);
            setActiveConversationId(newConversation.id);
        } catch (error) {
            console.error('Falha ao criar conversa', error);
        }
    }, [currentUser, t]);

    const handleSelectConversation = async (id: string) => {
        setActiveConversationId(id);
        await loadMessagesForConversation(id);
    };
    
    const handleSwitchUser = (user: User) => {
        if (currentUser?.email !== user.email) {
            setSwitchError('');
            setSwitchingUser(user);
        }
    };

    const handleConfirmSwitch = async (password: string) => {
        if (!switchingUser) return;

        try {
            const user = await loginUser(switchingUser.email, password);
            handleLoginSuccess(user);
            setSwitchingUser(null);
            setSwitchError('');
        } catch (error) {
            console.error('Falha ao trocar de usuário', error);
            setSwitchError(t('incorrectPasswordError'));
        }
    };

    const handleCancelSwitch = () => {
        setSwitchingUser(null);
        setSwitchError('');
    };


    const handleDeleteConversation = async (idToDelete: string) => {
        try {
            await deleteConversation(idToDelete);
            const remaining = conversations.filter(c => c.id !== idToDelete);

            if (remaining.length === 0) {
                await handleNewConversation();
                return;
            }

            setConversations(remaining);

            if (activeConversationId === idToDelete) {
                const nextId = remaining[0].id;
                setActiveConversationId(nextId);
                await loadMessagesForConversation(nextId);
            }
        } catch (error) {
            console.error('Falha ao excluir conversa', error);
        }
    };
    
    const handleClearAllConversations = async () => {
        if (!currentUser) return;

        try {
            await deleteUserConversations(currentUser.id);
            const newConversation = await createNewConversation(currentUser.id, t('newConversation'));
            setConversations([newConversation]);
            setActiveConversationId(newConversation.id);
            setIsSettingsModalVisible(false);
        } catch (error) {
            console.error('Falha ao limpar histórico', error);
        }
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

        try {
            await saveMessageToDb(activeConversationId, 'user', text);
        } catch (error) {
            console.error('Falha ao salvar mensagem do usuário', error);
        }
    
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
                await updateConversationTitle(activeConversationId, newTitle);
            } catch (error) {
                console.error("Falha ao gerar título, usando fallback:", error);
                const fallbackTitle = text.substring(0, 35) + (text.length > 35 ? '...' : '');
                setConversations(prev =>
                    prev.map(convo =>
                        convo.id === activeConversationId ? { ...convo, title: fallbackTitle } : convo
                    )
                );
                try {
                    await updateConversationTitle(activeConversationId, fallbackTitle);
                } catch (titleError) {
                    console.error('Falha ao persistir título da conversa', titleError);
                }
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
            await saveMessageToDb(activeConversationId, 'assistant', responseContent);
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
        <div className="flex flex-col md:flex-row h-screen overflow-hidden w-full bg-gradient-to-br from-[#1e103d] to-[#1b1429] text-white font-sans">
            <Sidebar 
                user={currentUser}
                allUsers={allUsers}
                conversations={conversations}
                activeConversationId={activeConversationId}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onNewConversation={handleNewConversation}
                onSelectConversation={handleSelectConversation}
                onDeleteConversation={handleDeleteConversation}
                onSwitchUser={handleSwitchUser}
                onLogout={handleLogout}
                onOpenSettings={() => {
                    setIsSettingsModalVisible(true);
                    setIsSidebarOpen(false);
                }}
            />
            {activeConversation && (
                <ChatInterface
                    key={activeConversation.id}
                    messages={activeConversation.messages}
                    onSendMessage={handleSendMessage}
                    userName={currentUser.name}
                    onOpenMenu={() => setIsSidebarOpen(true)}
                    onOpenFeedback={() => setIsGabiVisible(true)}
                />
            )} 
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
                    userId={currentUser.id}
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
