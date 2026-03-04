import db from './db';

/**
 * Initialize all database tables
 */
export function initializeSchema(): void {
    db.exec(`
        -- ============================================================
        --  USERS
        -- ============================================================
        CREATE TABLE IF NOT EXISTS users (
            id          TEXT PRIMARY KEY,
            username    TEXT UNIQUE NOT NULL,
            created_at  TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
        );

        -- ============================================================
        --  CONVERSATIONS
        -- ============================================================
        CREATE TABLE IF NOT EXISTS conversations (
            id          TEXT PRIMARY KEY,
            user_id     TEXT,
            ai_engine   TEXT NOT NULL DEFAULT 'ollama',
            ollama_model TEXT,
            started_at  TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );

        -- ============================================================
        --  MESSAGES
        -- ============================================================
        CREATE TABLE IF NOT EXISTS messages (
            id              TEXT PRIMARY KEY,
            conversation_id TEXT NOT NULL,
            role            TEXT NOT NULL CHECK (role IN ('user', 'ai')),
            content         TEXT NOT NULL,
            persona_id      TEXT,
            persona_name    TEXT,
            wisdom_source   TEXT,
            created_at      TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
        );

        -- ============================================================
        --  REFLECTIONS
        -- ============================================================
        CREATE TABLE IF NOT EXISTS reflections (
            id              TEXT PRIMARY KEY,
            user_id         TEXT,
            mistake         TEXT NOT NULL,
            new_rule        TEXT NOT NULL,
            next_action     TEXT NOT NULL,
            personas_used   TEXT,            -- JSON array of persona IDs
            created_at      TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );

        -- ============================================================
        --  INDEXES
        -- ============================================================
        CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
        CREATE INDEX IF NOT EXISTS idx_conversations_user    ON conversations(user_id);
        CREATE INDEX IF NOT EXISTS idx_reflections_user      ON reflections(user_id);
    `);

    console.log('✅ SQLite schema initialized at database/ghostskill.db');
}
