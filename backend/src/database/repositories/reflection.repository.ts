import { v4 as uuidv4 } from 'uuid';
import db from '../db';

export interface ReflectionRow {
    id: string;
    user_id: string | null;
    mistake: string;
    new_rule: string;
    next_action: string;
    personas_used: string | null; // JSON string
    created_at: string;
}

export function createReflection(
    mistake: string,
    newRule: string,
    nextAction: string,
    personasUsed?: string[],
    userId?: string
): ReflectionRow {
    const id = uuidv4();
    db.prepare(`
        INSERT INTO reflections (id, user_id, mistake, new_rule, next_action, personas_used)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(
        id,
        userId ?? null,
        mistake,
        newRule,
        nextAction,
        personasUsed ? JSON.stringify(personasUsed) : null
    );
    return getReflectionById(id)!;
}

export function getReflectionById(id: string): ReflectionRow | undefined {
    return db.prepare(
        `SELECT * FROM reflections WHERE id = ?`
    ).get(id) as ReflectionRow | undefined;
}

export function getAllReflections(): ReflectionRow[] {
    return db.prepare(
        `SELECT * FROM reflections ORDER BY created_at DESC`
    ).all() as ReflectionRow[];
}

export function deleteReflection(id: string): void {
    db.prepare(`DELETE FROM reflections WHERE id = ?`).run(id);
}
