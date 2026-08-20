import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useTranslations } from '../hooks/useTranslations';
import ConfirmModal from './ConfirmModal';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  onOpenFeedback: () => void;
  disabled?: boolean;
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

const FeedbackIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.15l-2.11 2.42a.875.875 0 01-1.245 0l-2.11-2.42a.39.39 0 00-.297-.15 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.74c0-1.946 1.37-3.68 3.348-3.97zM8.25 9.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
    </svg>
);

const roundButtonClassName =
    'w-14 h-14 min-w-14 min-h-14 rounded-full transition-transform duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center flex-shrink-0';

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, onOpenFeedback, disabled = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const textBeforeListeningRef = useRef('');
  const t = useTranslations();

  const handleTranscript = useCallback((transcript: string) => {
    const prefix = textBeforeListeningRef.current;
    setInputValue(prefix ? `${prefix}${transcript}` : transcript);
  }, []);

  const {
    isListening,
    startListening,
    stopListening,
    clearError,
    error,
  } = useSpeech(handleTranscript);

  useEffect(() => {
      if (error) {
          setIsErrorModalOpen(true);
      }
  }, [error]);

  useEffect(() => {
      if (disabled && isListening) {
          stopListening();
      }
  }, [disabled, isListening, stopListening]);

  const handleCloseErrorModal = () => {
      setIsErrorModalOpen(false);
      clearError();
  };

  const handleToggleListening = async () => {
    if (isListening) {
      stopListening();
      return;
    }
    textBeforeListeningRef.current = inputValue.trim() ? `${inputValue.trim()} ` : '';
    await startListening();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || !inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-w-0">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[12rem]">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('inputPlaceholder')}
                disabled={disabled}
                className={`w-full pl-4 sm:pl-5 pr-14 py-3 sm:py-4 text-base bg-violet-900/50 text-white placeholder-gray-400 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    isListening ? 'border-red-400 ring-2 ring-red-400/40' : 'border-violet-700'
                }`}
                aria-label={t('inputPlaceholder')}
            />
            <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-violet-300 hover:text-pink-400 transition-colors disabled:opacity-50"
                disabled={disabled || !inputValue.trim()}
                aria-label={t('sendButtonLabel')}
            >
                <SendIcon />
            </button>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
            <button
                type="button"
                onClick={handleToggleListening}
                disabled={disabled}
                className={`${roundButtonClassName} ${
                    isListening
                        ? 'bg-red-600 hover:bg-red-700 animate-pulse ring-4 ring-red-400/50'
                        : 'bg-pink-600 hover:bg-pink-700'
                }`}
                aria-label={isListening ? t('recordingVoiceButtonLabel') : t('recordVoiceButtonLabel')}
                aria-pressed={isListening}
            >
                <MicrophoneIcon isListening={isListening} />
            </button>
            <button
                type="button"
                onClick={onOpenFeedback}
                className={`${roundButtonClassName} bg-pink-600 hover:bg-pink-700`}
                aria-label={t('openFeedback')}
            >
                <FeedbackIcon />
            </button>
        </div>
      </form>
      {isListening && (
        <p className="mt-2 text-sm text-red-300" aria-live="polite">
          {t('listeningHint')}
        </p>
      )}
      <ConfirmModal
        isOpen={isErrorModalOpen && Boolean(error)}
        title={t('attentionTitle')}
        message={error}
        confirmText={t('understoodButton')}
        onConfirm={handleCloseErrorModal}
        onCancel={handleCloseErrorModal}
        showCancel={false}
      />
    </div>
  );
};

export default InputBar;
