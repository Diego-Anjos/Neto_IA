import React, { useState, useRef, useEffect } from 'react';
import type { Conversation, User } from '../types';
import { useTranslations } from '../hooks/useTranslations';

// Icons for the sidebar
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 opacity-70">
        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-12.706 0A4.403 4.403 0 0 0 1.508 6.385c.114-1.866 1.483-3.477 3.405-3.727ZM1.508 8.169c.092.052.186.1.28.147C4.18 9.213 6.64 10 9.25 10c2.61 0 5.07-.787 7.462-1.684a4.403 4.403 0 0 1 .28-.147c.231.64.364 1.32.364 2.031 0 2.226-1.808 4.034-4.035 4.034-2.226 0-4.034-1.808-4.034-4.034 0-.71.133-1.39.364-2.031Zm15.022 7.828c-2.075.27-4.19.408-6.337.408-2.147 0-4.262-.139-6.337-.408-1.922-.25-3.291-1.861-3.405-3.727a4.403 4.403 0 0 0 1.032.211 50.89 50.89 0 0 0 12.706 0 4.403 4.403 0 0 0 1.032-.211c-.114 1.866-1.483 3.477-3.405 3.727Z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.006a.75.75 0 0 1-.749.654H5.858a.75.75 0 0 1-.749-.654L4.104 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.9h1.368c1.603 0 2.816 1.336 2.816 2.9ZM5.25 6.094A49.053 49.053 0 0 0 12 5.25a49.053 49.053 0 0 0 6.75.844l-.828 10.756a.75.75 0 0 1-.749.654H6.828a.75.75 0 0 1-.749-.654L5.25 6.094Z" clipRule="evenodd" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 5.85c-.09.55-.525.954-1.095 1.034l-3.026.504a1.875 1.875 0 0 0-1.685 1.686l-.505 3.026c-.08.57.345 1.006.915 1.095l2.454.409c.57.095.955.526 1.035 1.095l.41 2.454c.08.57.525.915 1.095.915h3.85c.57 0 1.015-.345 1.095-.915l.41-2.454c.08-.57.465-1 .915-1.095l2.454-.409c.57-.08.995-.526.915-1.095l-.505-3.026a1.875 1.875 0 0 0-1.685-1.686l-3.026-.504c-.57-.095-1.005-.484-1.095-1.034l-.178-2.032a1.875 1.875 0 0 0-1.85-1.567h-3.85Zm-1.23 12.585c0 .03.002.06.006.09l.41 2.454a.375.375 0 0 0 .33.33l2.454.409a.375.375 0 0 0 .33-.006l.09-.006a2.25 2.25 0 1 0-3.95-2.954ZM12 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" clipRule="evenodd" />
    </svg>
);

const ChevronUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 0 1-1.06-.02L10 8.832 6.29 12.77a.75.75 0 1 1-1.08-1.04l4.25-4.5a.75.75 0 0 1 1.08 0l4.25 4.5a.75.75 0 0 1-.02 1.06z" clipRule="evenodd" />
    </svg>
);


interface SidebarProps {
    user: User;
    allUsers: User[];
    conversations: Conversation[];
    activeConversationId: string | null;
    onNewConversation: () => void;
    onSelectConversation: (id: string) => void;
    onDeleteConversation: (id: string) => void;
    onSwitchUser: (user: User) => void;
    onLogout: () => void;
    onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, allUsers, conversations, activeConversationId, onNewConversation, onSelectConversation, onDeleteConversation, onSwitchUser, onLogout, onOpenSettings }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const t = useTranslations();
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        e.preventDefault();
        if (window.confirm(t('deleteConversationConfirm'))) {
            onDeleteConversation(id);
        }
    };

    const handleSwitch = (userToSwitch: User) => {
        onSwitchUser(userToSwitch);
        setIsUserMenuOpen(false);
    };

    const handleLogoutAndClose = () => {
        onLogout();
        setIsUserMenuOpen(false);
    };

    return (
        <aside className="w-80 bg-[#1e103d] flex flex-col p-4 h-screen border-r border-white/10 flex-shrink-0">
            <div>
                <div className="mb-6 px-2">
                    <h1 className="text-3xl font-bold text-white">
                        Neto<span className="text-pink-400">IA</span>
                    </h1>
                    <p className="text-gray-400 text-sm">{t('netoIAAssistant')}</p>
                </div>

                <button
                    onClick={onNewConversation}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-6 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                >
                    <PlusIcon />
                    {t('newConversation')}
                </button>
            </div>
            
            <div className="flex-1 flex flex-col min-h-0">
                <h2 className="text-sm font-semibold text-gray-400 mb-2 px-2">{t('history')}</h2>
                <nav className="flex-1 overflow-y-auto space-y-1 pr-2 -mr-2">
                    {conversations.map(convo => (
                        <a
                            key={convo.id}
                            href="#"
                            onClick={(e) => { e.preventDefault(); onSelectConversation(convo.id); }}
                            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm truncate transition-colors w-full ${
                                activeConversationId === convo.id 
                                    ? 'bg-violet-600 text-white font-medium' 
                                    : 'text-gray-300 hover:bg-violet-800/50 hover:text-white'
                            }`}
                        >
                            {activeConversationId === convo.id && (
                                <span className="absolute left-0 top-2 bottom-2 w-1 bg-pink-400 rounded-r-full"></span>
                            )}
                            <ChatIcon />
                            <span className="flex-1 pr-8">{convo.title}</span>
                            <button
                                onClick={(e) => handleDelete(e, convo.id)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:bg-red-500/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                aria-label={`Excluir conversa ${convo.title}`}
                            >
                                <TrashIcon />
                            </button>
                        </a>
                    ))}
                </nav>
            </div>
            
            <div className="mt-auto pt-4 border-t border-white/10 relative" ref={menuRef}>
                 <div className={`absolute bottom-full mb-2 w-full bg-[#2a1a49] rounded-lg shadow-2xl border border-white/10 p-2 transition-all duration-200 ease-out ${isUserMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                        <div className="text-xs text-gray-400 px-2 py-1 font-semibold">{t('accounts')}</div>
                        {allUsers.map((u) => (
                            <button
                                key={u.email}
                                onClick={() => handleSwitch(u)}
                                disabled={u.email === user.email}
                                className="w-full flex items-center gap-3 text-left p-2 rounded-md hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${u.email === user.email ? 'bg-pink-600' : 'bg-violet-600'}`}>
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="text-sm font-medium text-white truncate">{u.name}</div>
                                    <div className="text-xs text-gray-400 truncate">{u.email}</div>
                                </div>
                                {u.email === user.email && (
                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-pink-400 flex-shrink-0">
                                         <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                                     </svg>
                                )}
                            </button>
                        ))}
                        <div className="border-t border-white/10 my-1"></div>
                        <button onClick={() => { onOpenSettings(); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 text-left p-2 rounded-md hover:bg-violet-600 transition-colors text-gray-300">
                            <SettingsIcon />
                            <span className="text-sm">{t('settings')}</span>
                        </button>
                        <button onClick={handleLogoutAndClose} className="w-full flex items-center gap-3 text-left p-2 rounded-md hover:bg-violet-600 transition-colors text-gray-300">
                            <LogoutIcon />
                            <span className="text-sm">{t('logout')}</span>
                        </button>
                    </div>
                <button
                    onClick={() => setIsUserMenuOpen(prev => !prev)} 
                    className="w-full flex items-center justify-between p-2 hover:bg-violet-800/50 rounded-md transition-colors"
                >
                     <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-white truncate">{user.name}</span>
                    </div>
                    <ChevronUpIcon />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;