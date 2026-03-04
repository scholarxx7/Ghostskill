import { Persona } from '../types';

export const personas: Record<string, Persona> = {
    friend: {
        id: 'friend',
        name: 'Friend',
        tagline: 'Strategy, Courage, Discipline & Execution',
        description: 'A companion combining the strategic mind of Chanakya, the courage of Bose, the discipline of Aurelius, and the execution of Napoleon.',
        expertise: ['Political Strategy', 'Revolutionary Thinking', 'Stoicism', 'Tactical Thinking'],
        color: 'from-blue-500 to-purple-600',
        quote: 'Give me blood, and I shall give you freedom to control your mind, plan your future, and execute your vision with strength.',
        approach: 'strategic, bold, disciplined, and decisive'
    }
};

export const getAllPersonas = (): Persona[] => {
    return Object.values(personas);
};

export const getPersonaById = (id: string): Persona | undefined => {
    return personas[id];
};

export const getPersonasByIds = (ids: string[]): Persona[] => {
    return ids
        .map(id => personas[id])
        .filter(persona => persona !== undefined);
};
