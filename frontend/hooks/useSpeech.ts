import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = false;
  recognition.interimResults = false;
}

// --- Text-to-Speech Singleton Store ---

interface SpeechState {
    status: 'idle' | 'speaking' | 'paused';
    currentText: string | null;
}

let voices: SpeechSynthesisVoice[] = [];
let speechState: SpeechState = { status: 'idle', currentText: null };
const listeners = new Set<() => void>();

const setState = (partialState: Partial<SpeechState>) => {
    speechState = { ...speechState, ...partialState };
    listeners.forEach(listener => listener());
};

const handleVoicesChanged = () => {
    voices = window.speechSynthesis.getVoices();
};

if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    handleVoicesChanged(); 
}

const speak = (text: string, lang: string) => {
    if (!window.speechSynthesis || !text) return;

    if (speechState.status === 'paused' && speechState.currentText === text) {
        window.speechSynthesis.resume();
        return;
    }

    window.speechSynthesis.cancel(); 

    const utterance = new SpeechSynthesisUtterance(text);
    
    const voiceOptions = voices.filter(voice => voice.lang === lang);
    const femaleVoice = voiceOptions.find(
        voice => (voice.name.includes('Feminino') || voice.name.includes('Female') || voice.name.includes('Maria') || voice.name.includes('Camila') || voice.name.includes('Luciana') || voice.name.includes('Isabella'))
    );

    utterance.voice = femaleVoice || voiceOptions[0] || null;
    utterance.lang = lang;
    utterance.rate = 0.9;
    
    utterance.onstart = () => setState({ status: 'speaking', currentText: text });
    utterance.onpause = () => setState({ status: 'paused' });
    utterance.onresume = () => setState({ status: 'speaking' });
    utterance.onend = () => setState({ status: 'idle', currentText: null });
    utterance.onerror = () => setState({ status: 'idle', currentText: null });

    window.speechSynthesis.speak(utterance);
};

const pause = () => {
    if (speechState.status === 'speaking') {
        window.speechSynthesis.pause();
    }
};

const resume = () => {
    if (speechState.status === 'paused') {
        window.speechSynthesis.resume();
    }
}

const cancel = () => {
    if (speechState.status !== 'idle') {
        window.speechSynthesis.cancel();
    }
};

// --- End of Store ---

export const useSpeech = (onTranscriptReceived: (transcript: string) => void) => {
    const { language } = useLanguage();
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState('');
    const [currentSpeechState, setCurrentSpeechState] = useState(speechState);

    useEffect(() => {
        const listener = () => setCurrentSpeechState(speechState);
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        }
    }, []);

    const startListening = useCallback(() => {
        if (!recognition) {
            setError('Reconhecimento de voz não é suportado neste navegador.');
            return;
        }
        if (isListening) return;
        
        recognition.lang = language;
        setIsListening(true);
        recognition.start();
    }, [isListening, language]);

    const stopListening = useCallback(() => {
        if (!recognition || !isListening) return;
        recognition.stop();
        setIsListening(false);
    }, [isListening]);
    
    useEffect(() => {
        if (!recognition) return;

        const handleResult = (event: any) => {
            const finalTranscript = event.results[0][0].transcript;
            onTranscriptReceived(finalTranscript);
            stopListening();
        };
        const handleError = (event: any) => {
            setError(`Erro no reconhecimento de voz: ${event.error}`);
            setIsListening(false);
        };
        const handleEnd = () => {
            setIsListening(false);
        };

        recognition.addEventListener('result', handleResult);
        recognition.addEventListener('error', handleError);
        recognition.addEventListener('end', handleEnd);

        return () => {
            recognition.removeEventListener('result', handleResult);
            recognition.removeEventListener('error', handleError);
            recognition.removeEventListener('end', handleEnd);
        };
    }, [stopListening, onTranscriptReceived]);

    const speakWithLang = useCallback((text: string) => {
        speak(text, language);
    }, [language]);

    return { 
        isListening, 
        error, 
        startListening, 
        isSpeechSupported: !!recognition,
        // TTS functions and state
        speak: speakWithLang,
        pause,
        resume,
        cancel,
        speechStatus: currentSpeechState.status,
        currentText: currentSpeechState.currentText,
    };
};
