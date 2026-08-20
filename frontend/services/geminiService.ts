import { GoogleGenAI, Type } from "@google/genai";
import { translations, type Language } from '../utils/translations';
import type { InstructionStep } from '../types';

/**
 * Active 3.x models, tried in this order. Older 2.x IDs return 404.
 */
const GEMINI_MODELS = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
] as const;

type GeminiModel = (typeof GEMINI_MODELS)[number];

const FALLBACK_DELAY_MS = 1500;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to safely get and parse API keys from environment variables.
const getApiKeys = (): string[] => {
    const apiKeysString = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKeysString) {
        console.error("A variável de ambiente VITE_GEMINI_API_KEY não está definida ou está vazia.");
        return [];
    }
    // Split by comma, trim whitespace from each key, and filter out any empty strings.
    return apiKeysString.split(',').map(key => key.trim()).filter(key => key);
};

// Initialize keys and the index to track the last used key.
let apiKeys = getApiKeys();
let currentApiKeyIndex = 0;

const isQuotaOrOverloadError = (error: unknown): boolean => {
    const status = typeof error === 'object' && error !== null
        ? (error as { status?: unknown; code?: unknown }).status
            ?? (error as { code?: unknown }).code
        : undefined;
    const message = error instanceof Error
        ? error.message
        : String(error ?? '');

    return (
        status === 429
        || status === 503
        || status === 'RESOURCE_EXHAUSTED'
        || status === 'UNAVAILABLE'
        || /429|too many requests|resource_exhausted|quota|rate.?limit|overloaded|unavailable|503/i.test(message)
    );
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        steps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    step: { type: Type.NUMBER, description: 'The step number' },
                    text: { type: Type.STRING, description: 'The instruction text for the step' },
                    image_description: { type: Type.STRING, description: 'A brief description of an image for the step' }
                },
                required: ['step', 'text', 'image_description']
            }
        },
        responseText: {
            type: Type.STRING,
            description: "A conversational text response if the user is not asking for instructions."
        }
    }
};

/**
 * Tries each model in GEMINI_MODELS, rotating API keys inside each attempt.
 * Quota (429) and overload errors are logged and the next key/model is tried.
 */
const runRequestWithFallback = async <T>(
    requestFn: (apiKey: string, model: GeminiModel) => Promise<T>,
    language: Language,
): Promise<T> => {
    if (apiKeys.length === 0) {
        apiKeys = getApiKeys();
        if (apiKeys.length === 0) {
            throw new Error("Nenhuma chave de API do Google foi configurada. Verifique suas variáveis de ambiente.");
        }
    }

    const totalKeys = apiKeys.length;
    let lastError: Error | null = null;
    let hitQuotaOrOverload = false;

    for (let modelIndex = 0; modelIndex < GEMINI_MODELS.length; modelIndex++) {
        const model = GEMINI_MODELS[modelIndex];
        let modelHitQuotaOrOverload = false;

        for (let i = 0; i < totalKeys; i++) {
            const keyIndexToTry = (currentApiKeyIndex + i) % totalKeys;
            const apiKey = apiKeys[keyIndexToTry];

            try {
                const result = await requestFn(apiKey, model);
                currentApiKeyIndex = keyIndexToTry;
                return result;
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));

                if (isQuotaOrOverloadError(error)) {
                    hitQuotaOrOverload = true;
                    modelHitQuotaOrOverload = true;
                    console.warn(
                        `Cota ou sobrecarga no modelo ${model} (chave ${keyIndexToTry}). Tentando a próxima opção.`,
                    );
                } else {
                    console.warn(`A chave de API no índice ${keyIndexToTry} falhou no modelo ${model}. Tentando a próxima.`);
                }
            }
        }

        const isLastModel = modelIndex === GEMINI_MODELS.length - 1;
        if (!isLastModel) {
            console.warn(`O modelo ${model} não respondeu. Tentando o próximo da lista.`);
            if (modelHitQuotaOrOverload) {
                await wait(FALLBACK_DELAY_MS);
            }
        }
    }

    console.error("Todos os modelos e chaves de API disponíveis falharam.", lastError);

    if (hitQuotaOrOverload) {
        throw new Error(translations[language].geminiBusyError);
    }

    throw new Error("Desculpe, estamos com problemas para nos conectar ao nosso assistente de IA no momento. Por favor, tente novamente mais tarde.");
};

export const getInstructionsFromGemini = async (userQuery: string, language: Language): Promise<InstructionStep[] | string> => {
    // Applied on every user message (including the first message of a new conversation).
    const systemPrompt = translations[language].systemPrompt;

    return runRequestWithFallback(async (apiKey, model) => {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model,
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text?.trim();
        if (!jsonText) {
            throw new Error("Resposta da IA vazia.");
        }
        const data = JSON.parse(jsonText);

        if (data && Array.isArray(data.steps)) {
            return data.steps as InstructionStep[];
        }

        if (data && typeof data.responseText === 'string') {
            return data.responseText;
        }

        console.error("Parsed data is not in expected format:", data);
        throw new Error("Resposta da IA em formato inválido.");
    }, language);
};

export const generateTitleFromQuery = async (userQuery: string, language: Language): Promise<string> => {
    const titlePrompt = translations[language].titlePrompt;

    return runRequestWithFallback(async (apiKey, model) => {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model,
            contents: userQuery,
            config: {
                systemInstruction: titlePrompt,
            },
        });

        const title = response.text?.trim();
        if (title) {
            return title;
        }
        throw new Error("A IA retornou um título vazio.");
    }, language);
};