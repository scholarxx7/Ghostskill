import * as dotenv from 'dotenv';

dotenv.config();

export const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
export const USE_OLLAMA = process.env.USE_OLLAMA !== 'false'; // Default to true
