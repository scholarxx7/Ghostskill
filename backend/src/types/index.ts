export interface Persona {
    id: string;
    name: string;
    tagline: string;
    description: string;
    expertise: string[];
    color: string;
    quote: string;
    approach: string;
}

export interface Message {
    id: string;
    type: 'user' | 'ai';
    content: string;
    persona?: string;
    personaId?: string;
    timestamp: Date;
}

export interface ChatRequest {
    message: string;
    personaIds: string[];
    conversationId?: string;
    aiEngine?: 'gemini' | 'ollama' | 'nlp';
    ollamaModel?: string;
}

export interface PersonaResponse {
    personaId: string;
    personaName: string;
    response: string;
    color: string;
}

export interface ChatResponse {
    success: boolean;
    data: {
        userMessage: Message;
        aiResponses: PersonaResponse[];
        conversationId: string;
    };
}

export interface Reflection {
    id: string;
    userId?: string;
    mistake: string;
    newRule: string;
    nextAction: string;
    timestamp: string;
    personasUsed?: string[];
}

export interface ReflectionRequest {
    mistake: string;
    newRule: string;
    nextAction: string;
    personasUsed?: string[];
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
