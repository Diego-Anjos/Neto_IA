import axios from 'axios';
import type { Conversation, InstructionStep, Message, User } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

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

export const loginUser = async (
  email: string,
  password: string,
  name?: string,
): Promise<User> => {
  const { data } = await api.post<User>('/users/auth', {
    email,
    password,
    name,
  });
  return data;
};

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>('/users');
  return data;
};

export const fetchUserConversations = async (
  userId: string,
): Promise<Conversation[]> => {
  const { data } = await api.get<DbConversation[]>(
    `/conversations/user/${userId}`,
  );
  return data.map(mapConversation);
};

export const createNewConversation = async (
  userId: string,
  title?: string,
): Promise<Conversation> => {
  const { data } = await api.post<DbConversation>('/conversations', {
    userId,
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

export const deleteUserConversations = async (userId: string): Promise<void> => {
  await api.delete(`/conversations/user/${userId}`);
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

export const sendFeedback = async (
  message: string,
  userId?: string,
): Promise<void> => {
  await api.post('/feedback', {
    message,
    userId,
  });
};

export default api;
