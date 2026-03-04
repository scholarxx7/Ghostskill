import { v4 as uuidv4 } from 'uuid';
import db from '../db';

export interface ConversationRow {
    id: string;
    user_id: string | null;
    ai_engine: string;
    ollama_model: string | null;
    started_at: string;
    updated_at: string;
}

export interface MessageRow {
    id: string;
    conversation_id: string;
    role: 'user' | 'ai';
    content: string;
    persona_id: string | null;
    persona_name: string | null;
    wisdom_source: string | null;
    created_at: string;
}

// ---- Conversation CRUD ----

export function createConversation(
    aiEngine: string,
    ollamaModel?: string,
    userId?: string
): ConversationRow {
    const id = uuidv4();
    db.prepare(`
        INSERT INTO conversations (id, user_id, ai_engine, ollama_model)
        VALUES (?, ?, ?, ?)
    `).run(id, userId ?? null, aiEngine, ollamaModel ?? null);

    return getConversationById(id)!;
}

export function getConversationById(id: string): ConversationRow | undefined {
    return db.prepare(
        `SELECT * FROM conversations WHERE id = ?`
    ).get(id) as ConversationRow | undefined;
}

export function touchConversation(id: string): void {
    db.prepare(
        `UPDATE conversations SET updated_at = datetime('now') WHERE id = ?`
    ).run(id);
}

export function getAllConversations(): ConversationRow[] {
    return db.prepare(
        `SELECT * FROM conversations ORDER BY updated_at DESC`
    ).all() as ConversationRow[];
}

export function deleteConversation(id: string): void {
    db.prepare(`DELETE FROM conversations WHERE id = ?`).run(id);
}

// ---- Message CRUD ----

export function addMessage(
    conversationId: string,
    role: 'user' | 'ai',
    content: string,
    personaId?: string,
    personaName?: string,
    wisdomSource?: string
): MessageRow {
    const id = uuidv4();
    db.prepare(`
        INSERT INTO messages (id, conversation_id, role, content, persona_id, persona_name, wisdom_source)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, conversationId, role, content, personaId ?? null, personaName ?? null, wisdomSource ?? null);

    touchConversation(conversationId);
    return getMessageById(id)!;
}

export function getMessageById(id: string): MessageRow | undefined {
    return db.prepare(
        `SELECT * FROM messages WHERE id = ?`
    ).get(id) as MessageRow | undefined;
}

export function getMessagesByConversation(conversationId: string): MessageRow[] {
    return db.prepare(
        `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC`
    ).all(conversationId) as MessageRow[];
}
