import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const getSpeechRecognitionCtor = () => {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

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
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setState({ status: 'idle', currentText: null });
    }
};

export const cancelSpeech = cancel;

export const useTextToSpeech = () => {
    const { language } = useLanguage();
    const [currentSpeechState, setCurrentSpeechState] = useState(speechState);

    useEffect(() => {
        const listener = () => setCurrentSpeechState(speechState);
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }, []);

    const speakWithLang = useCallback((text: string) => {
        speak(text, language);
    }, [language]);

    return {
        speak: speakWithLang,
        pause,
        resume,
        cancel,
        speechStatus: currentSpeechState.status,
        currentText: currentSpeechState.currentText,
    };
};

export const useSpeech = (onTranscriptReceived: (transcript: string) => void) => {
    const { language } = useLanguage();
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState('');
    const recognitionRef = useRef<any>(null);
    const onTranscriptRef = useRef(onTranscriptReceived);
    const languageRef = useRef(language);

    onTranscriptRef.current = onTranscriptReceived;
    languageRef.current = language;

    const ensureRecognition = useCallback(() => {
        if (recognitionRef.current) return recognitionRef.current;

        const SpeechRecognitionCtor = getSpeechRecognitionCtor();
        if (!SpeechRecognitionCtor) return null;

        const recognition = new SpeechRecognitionCtor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
            let transcript = '';
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            onTranscriptRef.current(transcript.trim());
        };

        recognition.onerror = (event: any) => {
            const code = event?.error;
            if (code === 'no-speech' || code === 'aborted') {
                setIsListening(false);
                return;
            }
            setError(translations[languageRef.current].microphonePermissionError);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        return recognition;
    }, []);

    useEffect(() => {
        return () => {
            const recognition = recognitionRef.current;
            if (!recognition) return;
            recognition.onresult = null;
            recognition.onerror = null;
            recognition.onend = null;
            try {
                recognition.stop();
            } catch {
                // Already stopped.
            }
            recognitionRef.current = null;
        };
    }, []);

    const stopListening = useCallback(() => {
        const recognition = recognitionRef.current;
        if (!recognition) {
            setIsListening(false);
            return;
        }
        try {
            recognition.stop();
        } catch {
            // Already stopped.
        }
        setIsListening(false);
    }, []);

    const startListening = useCallback(async () => {
        setError('');

        const SpeechRecognitionCtor = getSpeechRecognitionCtor();
        if (!SpeechRecognitionCtor) {
            setError(translations[languageRef.current].speechNotSupportedError);
            return;
        }

        try {
            if (navigator.mediaDevices?.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach((track) => track.stop());
            }
        } catch {
            setError(translations[languageRef.current].microphonePermissionError);
            return;
        }

        const recognition = ensureRecognition();
        if (!recognition) {
            setError(translations[languageRef.current].speechNotSupportedError);
            return;
        }

        recognition.lang = languageRef.current;
        try {
            setIsListening(true);
            recognition.start();
        } catch {
            try {
                recognition.stop();
                recognition.start();
                setIsListening(true);
            } catch {
                setIsListening(false);
                setError(translations[languageRef.current].microphonePermissionError);
            }
        }
    }, [ensureRecognition]);

    const clearError = useCallback(() => setError(''), []);

    return { 
        isListening, 
        error, 
        startListening,
        stopListening,
        clearError,
        isSpeechSupported: !!getSpeechRecognitionCtor(),
    };
};
