export interface InstructionStep {
  step: number;
  text: string;
  image_description: string;
}

export type MessageRole = 'user' | 'assistant' | 'loading' | 'error';

export interface Message {
  id?: string;
  role: MessageRole;
  content: string | InstructionStep[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  language?: string;
}
