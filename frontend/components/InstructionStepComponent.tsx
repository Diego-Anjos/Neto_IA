import React, { useState } from 'react';
import type { InstructionStep } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { useTranslations } from '../hooks/useTranslations';

interface InstructionStepProps {
  step: InstructionStep;
}

const SpeakerIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
        <path d="M16.416 7.274a.75.75 0 0 1 1.06 0c2.27 2.27 2.27 5.96 0 8.232a.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.11a.75.75 0 0 1 0-1.06Z" />
    </svg>
);

const PauseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);

const ImageIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm1.5-1.5a.75.75 0 0 1-.75-.75V9a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-.75-.75H4.5Z" />
    </svg>
);

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
);

const CopyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h5A1.5 1.5 0 0 1 15 3.5v10A1.5 1.5 0 0 1 13.5 15h-5A1.5 1.5 0 0 1 7 13.5v-10Z" />
        <path d="M5.5 4A1.5 1.5 0 0 0 4 5.5v10A1.5 1.5 0 0 0 5.5 17h5A1.5 1.5 0 0 0 12 15.5V15a.5.5 0 0 1-1 0v.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0-1H5.5Z" />
    </svg>
);

const CheckIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" />
    </svg>
);


const InstructionStepComponent: React.FC<InstructionStepProps> = ({ step }) => {
  const { speak, pause, resume, speechStatus, currentText } = useSpeech(() => {});
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const t = useTranslations();

  const isThisSpeaking = currentText === step.text && (speechStatus === 'speaking' || speechStatus === 'paused');

  const handlePlayPause = () => {
    if (!isThisSpeaking) {
        speak(step.text);
    } else if (speechStatus === 'speaking') {
        pause();
    } else if (speechStatus === 'paused') {
        resume();
    }
  };
  
  const handleCopy = () => {
    if(!step.text) return;

    navigator.clipboard.writeText(step.text).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error("Não foi possível copiar o texto: ", err);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 p-4 border-b border-white/10 last:border-b-0 last:pb-0">
        <div className="flex items-center justify-center bg-white/10 text-white font-bold rounded-full w-10 h-10 text-xl flex-shrink-0">
            {step.step}
        </div>
        <div className="flex-1">
            <p className="mb-3 text-white/90">{step.text}</p>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsImageVisible(!isImageVisible)}
                    className="flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300 font-medium transition-colors p-2 rounded-md bg-white/5 hover:bg-white/10"
                    aria-label={isImageVisible ? t('hideExampleImage') : t('showExampleImage')}
                >
                    <ImageIcon />
                    <span>{isImageVisible ? t('hideExampleImage') : t('showExampleImage')}</span>
                </button>
                 <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300 font-medium transition-colors p-2 rounded-md bg-white/5 hover:bg-white/10"
                    aria-label={t('copyInstructionText')}
                >
                    {isCopied ? <CheckIcon /> : <CopyIcon />}
                    <span className={`transition-colors ${isCopied ? 'text-green-400' : ''}`}>{isCopied ? t('copied') : t('copy')}</span>
                </button>
            </div>

            {isImageVisible && (
                <div className="mt-4 rounded-lg overflow-hidden border border-white/10 relative group/image">
                    <img 
                      src={`https://picsum.photos/seed/${encodeURIComponent(step.image_description)}/512/256`} 
                      alt={step.image_description}
                      className="w-full h-auto object-cover block animate-[fadeIn_0.3s_ease-out]"
                    />
                    <button 
                        onClick={() => setIsImageVisible(false)}
                        className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-opacity opacity-0 group-hover/image:opacity-100"
                        aria-label={t('closeImage')}
                    >
                        <CloseIcon />
                    </button>
                </div>
            )}
        </div>
        <button 
            onClick={handlePlayPause}
            className="p-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors self-center sm:self-start"
            aria-label={isThisSpeaking && speechStatus === 'speaking' ? t('pauseInstruction', { step: step.step }) : t('listenToInstruction', { step: step.step })}
        >
            {isThisSpeaking && speechStatus === 'speaking' ? <PauseIcon /> : <SpeakerIcon />}
        </button>
    </div>
  );
};

export default InstructionStepComponent;