import { Persona } from '../types';

// Configuration
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface WisdomData {
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
    userMessage: string
): Promise<string> => {
    try {
        // Fetch relevant wisdom from Python API
        const wisdom = await fetchRandomWisdom(persona.id);

        // Generate response using Gemini API with wisdom context
        return await generateGeminiResponse(persona, userMessage, wisdom);
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
        'strategic and calculated': [
            'Before acting, consider all possible outcomes.',
            'What information are you missing? Gather it before deciding.',
            'Think three moves ahead - what are the second-order effects?'
        ],
        'bold and revolutionary': [
            'What bold action have you been avoiding?',
            'Sometimes the path requires courage over caution.',
            'Lead by example - show don\'t tell.'
        ],
        'philosophical and disciplined': [
            'What aspects of this can you control? Focus there.',
            'How would your future self view this challenge?',
            'Discipline your response, not the circumstance.'
        ],
        'tactical and decisive': [
            'Identify the decisive point and concentrate your efforts.',
            'Speed matters - act with the information you have.',
            'What is your objective? Let that guide every decision.'
        ]
    };

    const advice = adviceMap[approach] || ['Consider this carefully.'];
    return advice[Math.floor(Math.random() * advice.length)];
}

/**
 * Fallback mock responses
 */
function generateMockResponse(persona: Persona): string {
    const mockResponses: Record<string, string[]> = {
        chanakya: [
            "Before making any decision, consider the long-term consequences. Study all angles carefully.",
            "The wise leader prepares for every outcome. What resources do you have?",
            "In matters of strategy, patience is your greatest weapon."
        ],
        bose: [
            "This situation demands courage and immediate action. Fear is the only enemy.",
            "Freedom requires sacrifice. What are you willing to give up?",
            "Lead from the front. Inspire through your actions."
        ],
        aurelius: [
            "What aspect of this can you control? Focus your energy there.",
            "Your perception shapes your reality. How do you choose to see this?",
            "Discipline your mind first. External circumstances matter less."
        ],
        napoleon: [
            "Analyze the terrain. Where are the weak points?",
            "Speed and decisiveness win battles. Act boldly.",
            "Find the decisive point and strike with overwhelming force."
        ]
    };

    const responses = mockResponses[persona.id] || ["I will consider your question carefully."];
    return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Generate responses from multiple personas
 */
export const generateMultiPersonaResponse = async (
    personas: Persona[],
    userMessage: string
): Promise<Array<{ personaId: string; response: string }>> => {
    const responses = await Promise.all(
        personas.map(async (persona) => ({
            personaId: persona.id,
            response: await generateEnhancedResponse(persona, userMessage)
        }))
    );

    return responses;
};

export { generateMockResponse as generateAIResponse };
