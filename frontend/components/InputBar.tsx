import React, { useState, useEffect, useCallback } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useTranslations } from '../hooks/useTranslations';

interface InputBarProps {
  onSendMessage: (text: string) => void;
}

const MicrophoneIcon: React.FC<{ isListening: boolean }> = ({ isListening }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={`w-7 h-7 transition-colors text-white ${isListening ? 'animate-pulse' : ''}`}
    >
        <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
        <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.75 6.75 0 1 1-13.5 0v-1.5A.75.75 0 0 1 6 10.5Z" />
    </svg>
);

const SendIcon: React.FC = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="w-6 h-6"
    >
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);

const InputBar: React.FC<InputBarProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const t = useTranslations();

  const handleTranscript = useCallback((transcript: string) => {
    setInputValue(transcript);
    if (transcript.trim()) {
      onSendMessage(transcript);
      setInputValue('');
    }
  }, [onSendMessage]);

  const { isListening, startListening, isSpeechSupported, error } = useSpeech(handleTranscript);

  useEffect(() => {
      if (error) {
          alert(error);
      }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="relative flex-1">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('inputPlaceholder')}
                className="w-full pl-5 pr-14 py-4 text-base bg-violet-900/50 text-white placeholder-gray-400 border border-violet-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                aria-label={t('inputPlaceholder')}
            />
            <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-violet-300 hover:text-pink-400 transition-colors disabled:opacity-50"
                disabled={!inputValue.trim()}
                aria-label={t('sendButtonLabel')}
            >
                <SendIcon />
            </button>
        </div>
        {isSpeechSupported && (
            <button
                type="button"
                onClick={startListening}
                disabled={isListening}
                className="p-4 bg-pink-600 rounded-full transition-transform duration-200 hover:bg-pink-700 active:scale-95 disabled:opacity-50 disabled:bg-pink-800 flex-shrink-0"
                aria-label={isListening ? t('recordingVoiceButtonLabel') : t('recordVoiceButtonLabel')}
            >
                <MicrophoneIcon isListening={isListening} />
            </button>
        )}
      </form>
    </div>
  );
};

export default InputBar;