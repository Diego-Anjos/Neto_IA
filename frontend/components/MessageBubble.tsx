import React, { useState } from 'react';
import type { Message, InstructionStep } from '../types';
import InstructionStepComponent from './InstructionStepComponent';
import { useSpeech } from '../hooks/useSpeech';
import { useTranslations } from '../hooks/useTranslations';

interface MessageBubbleProps {
  message: Message;
}

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center space-x-2">
        <div className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        <div className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
    </div>
);

const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06Z" />
        <path d="M16.416 7.274a.75.75 0 0 1 1.06 0c2.27 2.27 2.27 5.96 0 8.232a.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.11a.75.75 0 0 1 0-1.06Z" />
    </svg>
);

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M5.75 4.5a.75.75 0 0 0-.75.75v10.5a.75.75 0 0 0 1.5 0V5.25a.75.75 0 0 0-.75-.75Z" />
        <path d="M14.25 4.5a.75.75 0 0 0-.75.75v10.5a.75.75 0 0 0 1.5 0V5.25a.75.75 0 0 0-.75-.75Z" />
    </svg>
);


const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h5A1.5 1.5 0 0 1 15 3.5v10A1.5 1.5 0 0 1 13.5 15h-5A1.5 1.5 0 0 1 7 13.5v-10Z" />
        <path d="M5.5 4A1.5 1.5 0 0 0 4 5.5v10A1.5 1.5 0 0 0 5.5 17h5A1.5 1.5 0 0 0 12 15.5V15a.5.5 0 0 1-1 0v.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0-1H5.5Z" />
    </svg>
);

const CheckIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" />
    </svg>
);


const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { speak, pause, resume, speechStatus, currentText } = useSpeech(() => {});
  const [isCopied, setIsCopied] = useState(false);
  const t = useTranslations();

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isLoading = message.role === 'loading';
  const isError = message.role === 'error';

  const bubbleClasses = isUser
    ? 'bg-violet-700 text-white self-end'
    : 'bg-[#2a1a49] text-white self-start';
  
  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  
  const getTextContent = (content: string | InstructionStep[]): string => {
    if (typeof content === 'string') {
        return content;
    }
    if (Array.isArray(content)) {
        return content.map(step => `Passo ${step.step}: ${step.text}`).join('\n\n');
    }
    return '';
  };

  const textContent = getTextContent(message.content);
  const isThisSpeaking = currentText === textContent && (speechStatus === 'speaking' || speechStatus === 'paused');

  const handlePlayPause = () => {
    if (!textContent) return;

    if (!isThisSpeaking) {
        speak(textContent);
    } else if (speechStatus === 'speaking') {
        pause();
    } else if (speechStatus === 'paused') {
        resume();
    }
  };
  
  const handleCopy = () => {
    if(!textContent) return;

    navigator.clipboard.writeText(textContent).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error("Não foi possível copiar o texto: ", err);
    });
  };

  if (isLoading) {
    return (
        <div className={containerClasses}>
            <div className={`px-5 py-3 rounded-xl max-w-2xl text-lg ${bubbleClasses}`}>
                <LoadingIndicator />
            </div>
        </div>
    );
  }

  if (isError) {
    return (
        <div className={containerClasses}>
            <div className={`px-5 py-4 rounded-xl max-w-2xl text-lg bg-red-900/70 text-white self-start`}>
                <strong>{t('errorMessage')}</strong>
                <p>{message.content as string}</p>
            </div>
        </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={`px-5 py-4 rounded-xl max-w-2xl text-lg leading-relaxed ${bubbleClasses}`}>
        {isAssistant && Array.isArray(message.content) ? (
          <div className="space-y-4">
            {(message.content as InstructionStep[]).map((step) => (
              <InstructionStepComponent key={step.step} step={step} />
            ))}
          </div>
        ) : (
          <p>{message.content as string}</p>
        )}

        {isAssistant && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
            <button 
              onClick={handlePlayPause}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={isThisSpeaking && speechStatus === 'speaking' ? t('pauseReading') : t('readAloud')}
            >
              {isThisSpeaking && speechStatus === 'speaking' ? <PauseIcon /> : <SpeakerIcon />}
            </button>
            
            {!Array.isArray(message.content) && (
              <>
                <button 
                  onClick={handleCopy}
                  className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label={t('copyText')}
                >
                  {isCopied ? <CheckIcon /> : <CopyIcon />}
                </button>
                {isCopied && <span className="text-xs text-green-400 animate-[fadeIn_0.3s_ease-out]">{t('copied')}</span>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;