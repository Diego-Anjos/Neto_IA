import { GoogleGenAI, Type } from "@google/genai";
import { translations, type Language } from '../utils/translations';
import type { InstructionStep } from '../types';

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
 * A robust wrapper for making Gemini API calls that automatically retries with the next
 * available API key upon failure.
 * @param requestFn A function that takes an API key and performs the Gemini request.
 * @returns The result of the successful API request.
 * @throws An error if all API keys fail.
 */
const runRequestWithKeyRotation = async <T>(requestFn: (apiKey: string) => Promise<T>): Promise<T> => {
    // Re-check keys every time in case they were loaded late or are missing.
    if (apiKeys.length === 0) {
        apiKeys = getApiKeys();
        if (apiKeys.length === 0) {
            throw new Error("Nenhuma chave de API do Google foi configurada. Verifique suas variáveis de ambiente.");
        }
    }

    const totalKeys = apiKeys.length;
    let lastError: Error | null = null;

    // Loop through all keys, starting from the last known working one.
    for (let i = 0; i < totalKeys; i++) {
        const keyIndexToTry = (currentApiKeyIndex + i) % totalKeys;
        const apiKey = apiKeys[keyIndexToTry];

        try {
            const result = await requestFn(apiKey);
            // On success, update the index to this working key. The next request will start here.
            currentApiKeyIndex = keyIndexToTry;
            return result;
        } catch (error) {
            console.warn(`A chave de API no índice ${keyIndexToTry} falhou. Tentando a próxima.`);
            lastError = error instanceof Error ? error : new Error(String(error));
        }
    }

    // If the loop completes, it means all keys failed.
    console.error("Todas as chaves de API disponíveis falharam.", lastError);
    throw new Error("Desculpe, estamos com problemas para nos conectar ao nosso assistente de IA no momento. Por favor, tente novamente mais tarde.");
};

export const getInstructionsFromGemini = async (userQuery: string, language: Language): Promise<InstructionStep[] | string> => {
    const systemPrompt = translations[language].systemPrompt;

    return runRequestWithKeyRotation(async (apiKey) => {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);

        if (data && Array.isArray(data.steps)) {
            return data.steps as InstructionStep[];
        }
        
        if (data && typeof data.responseText === 'string') {
            return data.responseText;
        }

        console.error("Parsed data is not in expected format:", data);
        throw new Error("Resposta da IA em formato inválido.");
    });
};

export const generateTitleFromQuery = async (userQuery: string, language: Language): Promise<string> => {
    const titlePrompt = translations[language].titlePrompt;

    return runRequestWithKeyRotation(async (apiKey) => {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: userQuery,
            config: {
                systemInstruction: titlePrompt,
            },
        });

        const title = response.text.trim();
        if (title) {
            return title;
        }
        throw new Error("A IA retornou um título vazio.");
    });
};