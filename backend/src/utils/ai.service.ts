import { Persona } from '../types';
import { USE_OLLAMA } from './ollama/ollama.config';
import { generateOllamaResponse } from './ollama/ollama.engine';

// Configuration
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface WisdomData {
    source: string;
    text: string;
    reference?: string;
    category?: string;
    relevance?: string[];
}

/**
 * Fetch wisdom from Python API
 */
export const fetchWisdomFromAPI = async (
    personaId: string,
    limit: number = 3
): Promise<WisdomData[]> => {
    try {
        const response = await fetch(`${PYTHON_API_URL}/wisdom/${personaId}?limit=${limit}`);

        if (!response.ok) {
            throw new Error(`Python API returned ${response.status}`);
        }

        const data: any = await response.json();
        return data.wisdom || [];
    } catch (error) {
        console.error(`Error fetching wisdom for ${personaId}:`, error);
        return [];
    }
};

/**
 * Fetch random wisdom quote
 */
export const fetchRandomWisdom = async (personaId: string): Promise<WisdomData | null> => {
    try {
        const response = await fetch(`${PYTHON_API_URL}/wisdom/${personaId}/random`);

        if (!response.ok) {
            console.error(`Python API error for ${personaId}`);
            return null;
        }

        const data: any = await response.json();
        return data.wisdom || null;
    } catch (error) {
        console.error(`Error fetching random wisdom for ${personaId}:`, error);
        return null;
    }
};

/**
 * Generate AI response using Google Gemini API with wisdom context
 */
export const generateGeminiResponse = async (
    persona: Persona,
    userMessage: string,
    wisdom: WisdomData | null
): Promise<string> => {
    if (!GOOGLE_API_KEY) {
        console.log('Google API key not found, using wisdom-only response');
        return generateWisdomOnlyResponse(persona, wisdom);
    }

    try {
        const systemPrompt = `You are ${persona.name}, ${persona.description}. 
Your approach is ${persona.approach}. Your expertise includes: ${persona.expertise.join(', ')}.

${wisdom ? `You have this relevant wisdom from ${wisdom.source}: "${wisdom.text}"` : ''}

Respond to the user's question in character as ${persona.name}. ${wisdom ? 'Incorporate the wisdom quote naturally into your response.' : ''} 
Keep your response concise (2-3 sentences) but impactful. Be strategic and actionable.`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nUser's question: ${userMessage}\n\nYour response as ${persona.name}:`
                }]
            }],
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 200,
                topP: 0.95,
            }
        };

        const response = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Gemini API returned ${response.status}`);
        }

        const data: any = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text.trim();
        }

        throw new Error('Invalid response format from Gemini API');
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return generateWisdomOnlyResponse(persona, wisdom);
    }
};

/**
 * Generate response using only wisdom (fallback)
 */
function generateWisdomOnlyResponse(persona: Persona, wisdom: WisdomData | null): string {
    if (wisdom) {
        const responses = [
            `Consider this wisdom: "${wisdom.text}" (${wisdom.reference || wisdom.source}). ${getContextualAdvice(persona.approach)}`,
            `As written in ${wisdom.source}: "${wisdom.text}" Apply this principle to your situation.`,
            `"${wisdom.text}" - ${wisdom.reference || wisdom.source}. This ancient truth applies directly to your challenge.`,
            `From ${wisdom.source}: "${wisdom.text}" How does this perspective change your approach?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    return generateMockResponse(persona);
}

/**
 * Generate AI response enhanced with real wisdom
 */
export const generateEnhancedResponse = async (
    persona: Persona,
    userMessage: string,
    aiEngine?: 'gemini' | 'ollama' | 'nlp',
    ollamaModel?: string
): Promise<string> => {
    try {
        // Fetch relevant wisdom from Python API
        const wisdom = await fetchRandomWisdom(persona.id);

        if (aiEngine === 'nlp') {
            return generateWisdomOnlyResponse(persona, wisdom);
        } else if (aiEngine === 'ollama' || (aiEngine === undefined && USE_OLLAMA)) {
            try {
                return await generateOllamaResponse(persona, userMessage, wisdom, ollamaModel);
            } catch (err) {
                return generateWisdomOnlyResponse(persona, wisdom);
            }
        } else {
            // Generate response using Gemini API with wisdom context
            return await generateGeminiResponse(persona, userMessage, wisdom);
        }
    } catch (error) {
        console.error('Error generating enhanced response:', error);
        return generateMockResponse(persona);
    }
};

/**
 * Get contextual advice based on persona approach
 */
function getContextualAdvice(approach: string): string {
    const adviceMap: Record<string, string[]> = {
        'strategic, bold, disciplined, and decisive': [
            'Combine your strategic vision with resolute execution. Hesitation is the enemy.',
            'What information are you missing? Gather it, structure it, then strike with undeniable force.',
            'Think three moves ahead like a strategist, but remain emotionally unshakable like a stoic.',
            'Identify the decisive point and concentrate your efforts completely.'
        ]
    };

    const advice = adviceMap[approach] || ['Consider this carefully.'];
    return advice[Math.floor(Math.random() * advice.length)];
}

/**
 * Fallback mock responses
 */
function generateMockResponse(persona: Persona): string {
    const responses = [
        "In matters of strategy, patience is your greatest weapon, but courage fuels your execution.",
        "Fear is the only enemy. Release what you cannot control, and prepare for every outcome.",
        "Analyze the terrain, discipline your mind, and let your actions act as an overwhelming force."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Generate responses from multiple personas
 */
export const generateMultiPersonaResponse = async (
    personas: Persona[],
    userMessage: string,
    aiEngine?: 'gemini' | 'ollama' | 'nlp',
    ollamaModel?: string
): Promise<Array<{ personaId: string; response: string }>> => {
    const responses = await Promise.all(
        personas.map(async (persona) => ({
            personaId: persona.id,
            response: await generateEnhancedResponse(persona, userMessage, aiEngine, ollamaModel)
        }))
    );

    return responses;
};

export { generateMockResponse as generateAIResponse };
