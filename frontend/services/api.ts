import axios from 'axios';
import type { Conversation, InstructionStep, Message, User } from '../types';

const AUTH_TOKEN_KEY = 'netoia-auth-token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = String(error?.config?.url ?? '');
    const isAuthAttempt = url.includes('/users/auth');

    if (status === 401 && !isAuthAttempt) {
      setAuthToken(null);
      window.dispatchEvent(new Event('netoia-unauthorized'));
    }

    return Promise.reject(error);
  },
);

type AuthResponse = User & { token: string };

type DbConversation = {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
};

type DbMessage = {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  createdAt: string;
};

const mapConversation = (conversation: DbConversation): Conversation => ({
  id: conversation.id,
  title: conversation.title || 'Nova Conversa',
  messages: [],
});

const parseMessageContent = (content: string): string | InstructionStep[] => {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed as InstructionStep[];
    }
    if (typeof parsed === 'string') {
      return parsed;
    }
  } catch {
    // Conteúdo simples em texto.
  }
  return content;
};

const mapMessage = (message: DbMessage): Message => ({
  id: message.id,
  role: message.role as Message['role'],
  content: parseMessageContent(message.content),
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const loginUser = async (
  email: string,
  password: string,
  name?: string,
): Promise<User> => {
  const { data } = await api.post<AuthResponse>('/users/auth', {
    email,
    password,
    name,
  });
  const { token, ...user } = data;
  setAuthToken(token);
  return user;
};

export const fetchCurrentUser = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const fetchUserConversations = async (): Promise<Conversation[]> => {
  const { data } = await api.get<DbConversation[]>('/conversations');
  return data.map(mapConversation);
};

export const createNewConversation = async (
  title?: string,
): Promise<Conversation> => {
  const { data } = await api.post<DbConversation>('/conversations', {
    title,
  });
  return mapConversation(data);
};

export const updateConversationTitle = async (
  conversationId: string,
  title: string,
): Promise<Conversation> => {
  const { data } = await api.patch<DbConversation>(
    `/conversations/${conversationId}`,
    { title },
  );
  return mapConversation(data);
};

export const deleteConversation = async (conversationId: string): Promise<void> => {
  await api.delete(`/conversations/${conversationId}`);
};

export const deleteUserConversations = async (): Promise<void> => {
  await api.delete('/conversations');
};

export const fetchMessages = async (
  conversationId: string,
): Promise<Message[]> => {
  const { data } = await api.get<DbMessage[]>(
    `/messages/conversation/${conversationId}`,
  );
  return data.map(mapMessage);
};

export const saveMessageToDb = async (
  conversationId: string,
  role: 'user' | 'assistant',
  content: string | InstructionStep[],
): Promise<Message> => {
  const { data } = await api.post<DbMessage>('/messages', {
    conversationId,
    role,
    content,
  });
  return mapMessage(data);
};

export const sendFeedback = async (message: string): Promise<void> => {
  await api.post('/feedback', { message });
};

export default api;
