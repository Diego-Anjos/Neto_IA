export interface InstructionStep {
  step: number;
  text: string;
  image_description: string;
}

export type MessageRole = 'user' | 'assistant' | 'loading' | 'error';

export interface Message {
  role: MessageRole;
  content: string | InstructionStep[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

export interface User {
  name: string;
  email: string;
  passwordHash: string;
}