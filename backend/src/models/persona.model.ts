import { Persona } from '../types';

export const personas: Record<string, Persona> = {
    chanakya: {
        id: 'chanakya',
        name: 'Chanakya',
        tagline: 'Strategy & Statecraft',
        description: 'Ancient Indian philosopher and strategist. Master of political strategy and governance.',
        expertise: ['Political Strategy', 'Diplomacy', 'Long-term Planning', 'Resource Management'],
        color: 'from-amber-500 to-orange-600',
        quote: 'Before you start a war, you must understand whose side the gods are on.',
        approach: 'strategic and calculated'
    },
    bose: {
        id: 'bose',
        name: 'Subhas Chandra Bose',
        tagline: 'Courage & Revolution',
        description: 'Indian revolutionary and freedom fighter. Learn courage under pressure.',
        expertise: ['Leadership', 'Revolutionary Thinking', 'Courage', 'Movement Building'],
        color: 'from-emerald-500 to-teal-600',
        quote: 'Give me blood, and I shall give you freedom!',
        approach: 'bold and revolutionary'
    },
    aurelius: {
        id: 'aurelius',
        name: 'Marcus Aurelius',
        tagline: 'Discipline & Inner Strength',
        description: 'Roman emperor and Stoic philosopher. Learn to control what matters: your mind.',
        expertise: ['Stoicism', 'Self-Discipline', 'Emotional Control', 'Philosophy'],
        color: 'from-blue-500 to-indigo-600',
        quote: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
        approach: 'philosophical and disciplined'
    },
    napoleon: {
        id: 'napoleon',
        name: 'Napoleon Bonaparte',
        tagline: 'Execution & War Strategy',
        description: 'French military genius and emperor. Learn decisive action and battlefield tactics.',
        expertise: ['Military Strategy', 'Decisive Action', 'Resource Allocation', 'Tactical Thinking'],
        color: 'from-purple-500 to-violet-600',
        quote: 'The battlefield is a scene of constant chaos. The winner will be the one who controls that chaos.',
        approach: 'tactical and decisive'
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
