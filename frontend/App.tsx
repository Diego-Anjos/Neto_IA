import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
    fetchCurrentUser,
    fetchMessages,
    fetchUserConversations,
    getAuthToken,
    loginUser,
    saveMessageToDb,
    setAuthToken,
    updateConversationTitle,
} from './services/api';
import { useLanguage } from './contexts/LanguageContext';
import { useTranslations } from './hooks/useTranslations';
import { cancelSpeech } from './hooks/useSpeech';
import type { Message, Conversation, User } from './types';

const CURRENT_USER_KEY = 'netoia-current-user';
const KNOWN_USERS_KEY = 'netoia-known-users';

const isListedAccount = (user: User) =>
    user.email.trim().toLowerCase() !== 'smoke-test@netoia.local';

const parseStoredUsers = (raw: string | null): User[] => {
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter((item): item is User =>
            Boolean(
                item &&
                typeof item.id === 'string' &&
                typeof item.name === 'string' &&
                typeof item.email === 'string' &&
                isListedAccount(item)
            )
        );
    } catch {
        return [];
    }
};

const mergeAccountLists = (...lists: User[][]) => {
    const byId = new Map<string, User>();

    for (const list of lists) {
        for (const user of list) {
            if (isListedAccount(user)) {
                byId.set(user.id, user);
            }
        }
    }

    return Array.from(byId.values());
};

const persistKnownUsers = (users: User[]) => {
    localStorage.setItem(KNOWN_USERS_KEY, JSON.stringify(users));
};

const replaceLastLoading = (messages: Message[], next: Message): Message[] => {
    let idx = -1;
    for (let i = messages.length - 1; i >= 0; i -= 1) {
        if (messages[i].role === 'loading') {
            idx = i;
            break;
        }
    }
    if (idx === -1) {
        return [...messages, next];
    }
    const copy = [...messages];
    copy[idx] = next;
    return copy;
};

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [sessionStatus, setSessionStatus] = useState<'booting' | 'ready'>('booting');
    const [authView, setAuthView] = useState<'login' | 'register'>('login');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [draftMessages, setDraftMessages] = useState<Message[]>([]);
    const [conversationsError, setConversationsError] = useState('');
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [switchingUser, setSwitchingUser] = useState<User | null>(null);
    const [switchError, setSwitchError] = useState<string>('');
    const [isGabiVisible, setIsGabiVisible] = useState(false);
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { language } = useLanguage();
    const t = useTranslations();
    const tRef = useRef(t);
    tRef.current = t;

    const conversationLoadId = useRef(0);
    const currentUserIdRef = useRef<string | null>(null);
    const currentUserEmailRef = useRef<string | null>(null);
    const conversationsRef = useRef<Conversation[]>([]);
    const isSendingRef = useRef(false);
    currentUserIdRef.current = currentUser?.id ?? null;
    currentUserEmailRef.current = currentUser?.email ?? null;
    conversationsRef.current = conversations;

    const clearConversationState = useCallback(() => {
        conversationLoadId.current += 1;
        isSendingRef.current = false;
        setConversations([]);
        setActiveConversationId(null);
        setDraftMessages([]);
        setConversationsError('');
        setIsGabiVisible(false);
        setIsSettingsModalVisible(false);
        setIsSidebarOpen(false);
        setSwitchingUser(null);
        setSwitchError('');
        cancelSpeech();
    }, []);

    const loadMessagesForConversation = useCallback(async (
        conversationId: string,
        loadId?: number,
        force = false,
    ) => {
        try {
            const target = conversationsRef.current.find((convo) => convo.id === conversationId);
            if (!force && target && target.messages.length > 0) {
                return;
            }

            const messages = await fetchMessages(conversationId);
            if (loadId !== undefined && loadId !== conversationLoadId.current) return;
            setConversations(prev =>
                prev.map(convo =>
                    convo.id === conversationId ? { ...convo, messages } : convo
                )
            );
        } catch (error) {
            console.error('Falha ao carregar mensagens', error);
        }
    }, []);

    // O histórico é apenas carregado para a barra lateral: nenhuma conversa é
    // aberta automaticamente, para que o login caia sempre na tela inicial.
    const loadConversationsForUser = useCallback(async () => {
        const loadId = ++conversationLoadId.current;
        setConversations([]);
        setActiveConversationId(null);
        setDraftMessages([]);
        setConversationsError('');

        try {
            const userConversations = await fetchUserConversations();
            if (loadId !== conversationLoadId.current) return;
            setConversations(userConversations);
        } catch (error) {
            console.error('Falha ao carregar conversas do usuário', error);
            if (loadId === conversationLoadId.current) {
                setConversationsError(tRef.current('historyLoadError'));
            }
        }
    }, []);

    useEffect(() => {
        const restoreSession = async () => {
            const knownOnDevice = parseStoredUsers(localStorage.getItem(KNOWN_USERS_KEY));
            setAllUsers(knownOnDevice);

            if (!getAuthToken()) {
                setCurrentUser(null);
                localStorage.removeItem(CURRENT_USER_KEY);
                setSessionStatus('ready');
                return;
            }

            try {
                const me = await fetchCurrentUser();
                if (!isListedAccount(me)) {
                    setAuthToken(null);
                    localStorage.removeItem(CURRENT_USER_KEY);
                    setSessionStatus('ready');
                    return;
                }

                setCurrentUser(me);
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(me));
                const accounts = mergeAccountLists(knownOnDevice, [me]);
                setAllUsers(accounts);
                persistKnownUsers(accounts);
            } catch (error) {
                console.error('Falha ao restaurar sessão', error);
                setAuthToken(null);
                setCurrentUser(null);
                localStorage.removeItem(CURRENT_USER_KEY);
            } finally {
                setSessionStatus('ready');
            }
        };

        restoreSession();
    }, []);

    useEffect(() => {
        if (!currentUser) {
            clearConversationState();
            return;
        }

        loadConversationsForUser();
    }, [currentUser?.id, clearConversationState, loadConversationsForUser]);

    const handleLoginSuccess = useCallback((user: User) => {
        clearConversationState();
        setCurrentUser(user);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        setAllUsers(prev => {
            const next = mergeAccountLists(prev, [user]);
            persistKnownUsers(next);
            return next;
        });
    }, [clearConversationState]);

    const handleLogout = useCallback(() => {
        setAuthToken(null);
        clearConversationState();
        setCurrentUser(null);
        localStorage.removeItem(CURRENT_USER_KEY);
    }, [clearConversationState]);

    useEffect(() => {
        const onUnauthorized = () => handleLogout();
        window.addEventListener('netoia-unauthorized', onUnauthorized);
        return () => window.removeEventListener('netoia-unauthorized', onUnauthorized);
    }, [handleLogout]);

    // A conversa só é criada no banco quando a primeira pergunta é enviada,
    // evitando conversas vazias a cada login ou clique em "Nova Conversa".
    const handleNewConversation = useCallback(() => {
        setActiveConversationId(null);
        setDraftMessages([]);
        cancelSpeech();
    }, []);

    const handleSelectConversation = useCallback(async (id: string) => {
        setActiveConversationId(id);
        setDraftMessages([]);
        cancelSpeech();
        await loadMessagesForConversation(id, conversationLoadId.current);
    }, [loadMessagesForConversation]);

    const handleSwitchUser = useCallback((user: User) => {
        if (currentUserEmailRef.current !== user.email) {
            setSwitchError('');
            setSwitchingUser(user);
        }
    }, []);

    const handleConfirmSwitch = useCallback(async (password: string) => {
        if (!switchingUser) return;

        try {
            const user = await loginUser(switchingUser.email, password);
            handleLoginSuccess(user);
            setSwitchingUser(null);
            setSwitchError('');
        } catch (error) {
            console.error('Falha ao trocar de usuário', error);
            setSwitchError(tRef.current('incorrectPasswordError'));
        }
    }, [switchingUser, handleLoginSuccess]);

    const handleCancelSwitch = useCallback(() => {
        setSwitchingUser(null);
        setSwitchError('');
    }, []);

    const handleDeleteConversation = useCallback(async (idToDelete: string) => {
        try {
            await deleteConversation(idToDelete);
            if (!currentUserIdRef.current) return;

            setConversations(conversationsRef.current.filter((c) => c.id !== idToDelete));

            if (activeConversationId === idToDelete) {
                setActiveConversationId(null);
                setDraftMessages([]);
                cancelSpeech();
            }
        } catch (error) {
            console.error('Falha ao excluir conversa', error);
        }
    }, [activeConversationId]);

    const handleClearAllConversations = useCallback(async () => {
        if (!currentUserIdRef.current) return;

        try {
            await deleteUserConversations();
            conversationLoadId.current += 1;
            setConversations([]);
            setActiveConversationId(null);
            setDraftMessages([]);
            setIsSettingsModalVisible(false);
            cancelSpeech();
        } catch (error) {
            console.error('Falha ao limpar histórico', error);
            throw error;
        }
    }, []);

    const handleSendMessage = useCallback(async (text: string) => {
        const userId = currentUserIdRef.current;
        if (!text.trim() || !userId || isSendingRef.current) return;

        isSendingRef.current = true;
        const userMessage: Message = { role: 'user', content: text };
        const loadingMessage: Message = { role: 'loading', content: '' };

        let conversationId = activeConversationId;
        let isFirstMessage = false;

        if (!conversationId) {
            setDraftMessages([userMessage, loadingMessage]);

            try {
                const created = await createNewConversation(tRef.current('newConversation'));
                if (currentUserIdRef.current !== userId) {
                    isSendingRef.current = false;
                    return;
                }
                conversationId = created.id;
                isFirstMessage = true;
                setConversations(prev => [
                    { ...created, messages: [userMessage, loadingMessage] },
                    ...prev,
                ]);
                setActiveConversationId(created.id);
                setDraftMessages([]);
            } catch (error) {
                console.error('Falha ao criar conversa', error);
                setDraftMessages([
                    userMessage,
                    { role: 'error', content: tRef.current('conversationCreateError') },
                ]);
                isSendingRef.current = false;
                return;
            }
        } else {
            const existing = conversationsRef.current.find(c => c.id === conversationId);
            isFirstMessage = (existing?.messages.length ?? 0) === 0;
            setConversations(prev =>
                prev.map(convo =>
                    convo.id === conversationId
                        ? { ...convo, messages: [...convo.messages, userMessage, loadingMessage] }
                        : convo
                )
            );
        }

        try {
            await saveMessageToDb(conversationId, 'user', text);
        } catch (error) {
            console.error('Falha ao salvar mensagem do usuário', error);
        }

        if (currentUserIdRef.current !== userId) {
            isSendingRef.current = false;
            return;
        }

        if (isFirstMessage) {
            setConversations(prev =>
                prev.map(convo =>
                    convo.id === conversationId ? { ...convo, title: tRef.current('generatingTitle') } : convo
                )
            );

            try {
                const newTitle = await generateTitleFromQuery(text, language);
                if (currentUserIdRef.current === userId) {
                    setConversations(prev =>
                        prev.map(convo =>
                            convo.id === conversationId ? { ...convo, title: newTitle } : convo
                        )
                    );
                    await updateConversationTitle(conversationId, newTitle);
                }
            } catch (error) {
                console.error("Falha ao gerar título, usando fallback:", error);
                const fallbackTitle = text.substring(0, 35) + (text.length > 35 ? '...' : '');
                if (currentUserIdRef.current === userId) {
                    setConversations(prev =>
                        prev.map(convo =>
                            convo.id === conversationId ? { ...convo, title: fallbackTitle } : convo
                        )
                    );
                    try {
                        await updateConversationTitle(conversationId, fallbackTitle);
                    } catch (titleError) {
                        console.error('Falha ao persistir título da conversa', titleError);
                    }
                }
            }
        }

        try {
            const responseContent = await getInstructionsFromGemini(text, language);
            const assistantMessage: Message = { role: 'assistant', content: responseContent };
            if (currentUserIdRef.current !== userId) return;
            setConversations(prev =>
                prev.map(convo =>
                    convo.id === conversationId
                        ? { ...convo, messages: replaceLastLoading(convo.messages, assistantMessage) }
                        : convo
                )
            );
            await saveMessageToDb(conversationId, 'assistant', responseContent);
        } catch (error) {
            const errorMessageContent = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
            const errorMessage: Message = { role: 'error', content: errorMessageContent };
            if (currentUserIdRef.current !== userId) return;
            setConversations(prev =>
                prev.map(convo =>
                    convo.id === conversationId
                        ? { ...convo, messages: replaceLastLoading(convo.messages, errorMessage) }
                        : convo
                )
            );
        } finally {
            isSendingRef.current = false;
        }
    }, [activeConversationId, language]);

    const handleOpenSidebar = useCallback(() => setIsSidebarOpen(true), []);
    const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);
    const handleOpenFeedback = useCallback(() => setIsGabiVisible(true), []);
    const handleCloseFeedback = useCallback(() => setIsGabiVisible(false), []);
    const handleCloseSettings = useCallback(() => setIsSettingsModalVisible(false), []);
    const handleOpenSettings = useCallback(() => {
        setIsSettingsModalVisible(true);
        setIsSidebarOpen(false);
    }, []);
    const handleSwitchToRegister = useCallback(() => setAuthView('register'), []);
    const handleSwitchToLogin = useCallback(() => setAuthView('login'), []);

    const activeConversation = useMemo(
        () => conversations.find(c => c.id === activeConversationId),
        [conversations, activeConversationId],
    );
    const visibleMessages = activeConversation ? activeConversation.messages : draftMessages;
    const isSending = visibleMessages.some((message) => message.role === 'loading');

    if (sessionStatus === 'booting') {
        return (
            <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-[#1e103d] to-[#1b1429] text-white">
                <p className="text-lg text-gray-300">Carregando...</p>
            </div>
        );
    }

    if (!currentUser) {
        return authView === 'login' ? (
            <LoginScreen onLoginSuccess={handleLoginSuccess} onSwitchToRegister={handleSwitchToRegister} />
        ) : (
            <RegistrationScreen onRegisterSuccess={handleLoginSuccess} onSwitchToLogin={handleSwitchToLogin} />
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden w-full bg-gradient-to-br from-[#1e103d] to-[#1b1429] text-white font-sans">
            <Sidebar 
                user={currentUser}
                allUsers={allUsers}
                conversations={conversations}
                activeConversationId={activeConversationId}
                isOpen={isSidebarOpen}
                onClose={handleCloseSidebar}
                onNewConversation={handleNewConversation}
                onSelectConversation={handleSelectConversation}
                onDeleteConversation={handleDeleteConversation}
                onSwitchUser={handleSwitchUser}
                onLogout={handleLogout}
                onOpenSettings={handleOpenSettings}
            />
            <ChatInterface
                conversationId={activeConversationId}
                messages={visibleMessages}
                onSendMessage={handleSendMessage}
                userName={currentUser.name}
                isSending={isSending}
                notice={conversationsError}
                onOpenMenu={handleOpenSidebar}
                onOpenFeedback={handleOpenFeedback}
            />
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
                    onClose={handleCloseFeedback}
                />
            )}

            {isSettingsModalVisible && (
                <SettingsModal 
                    onClose={handleCloseSettings}
                    onClearHistory={handleClearAllConversations}
                />
            )}
        </div>
    );
};

export default App;
