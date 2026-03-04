import { Persona } from '../../types';
import { WisdomData } from '../ai.service';
import { OLLAMA_API_URL, OLLAMA_MODEL } from './ollama.config';

/**
 * Generate AI response using Ollama API with wisdom context
 */
export const generateOllamaResponse = async (
    persona: Persona,
    userMessage: string,
    wisdom: WisdomData | null,
    customModel?: string
): Promise<string> => {
    try {
        const systemPrompt = `You are ${persona.name}, ${persona.description}. 
Your approach is ${persona.approach}. Your expertise includes: ${persona.expertise.join(', ')}.

${wisdom ? `You have this relevant wisdom from ${wisdom.source}: "${wisdom.text}"` : ''}

Respond to the user's question in character as ${persona.name}. ${wisdom ? 'Incorporate the wisdom quote naturally into your response.' : ''} 
Keep your response concise (2-3 sentences) but impactful. Be strategic and actionable.`;

        const requestBody = {
            model: customModel || OLLAMA_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            stream: false,
            options: {
                temperature: 0.8,
            }
        };

        const response = await fetch(`${OLLAMA_API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Ollama API returned ${response.status}`);
        }

        const data: any = await response.json();

        if (data.message && data.message.content) {
            return data.message.content.trim();
        }

        throw new Error('Invalid response format from Ollama API');
    } catch (error) {
        console.error('Error calling Ollama API:', error);
        throw error;
    }
};
