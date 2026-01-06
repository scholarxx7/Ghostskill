import { Message, PersonaResponse } from '../types';
import fs from 'fs/promises';
import path from 'path';

interface ChatLog {
    conversationId: string;
    timestamp: Date;
    userMessage: {
        content: string;
        messageId: string;
    };
    aiResponses: Array<{
        personaId: string;
        personaName: string;
        response: string;
        color: string;
    }>;
    metadata?: {
        sessionInfo?: string;
        userAgent?: string;
        ip?: string;
    };
}

interface ChatSession {
    sessionId: string;
    startTime: Date;
    lastActivity: Date;
    messages: ChatLog[];
    totalMessages: number;
}

class ChatLogger {
    private logsDir: string;
    private sessionsDir: string;
    private enabled: boolean;

    constructor() {
        this.logsDir = path.join(process.cwd(), 'chat-logs');
        this.sessionsDir = path.join(this.logsDir, 'sessions');
        this.enabled = process.env.ENABLE_CHAT_LOGGING === 'true';
    }

    /**
     * Initialize logging directories
     */
    async init(): Promise<void> {
        if (!this.enabled) {
            console.log('📝 Chat logging is disabled');
            return;
        }

        try {
            await fs.mkdir(this.logsDir, { recursive: true });
            await fs.mkdir(this.sessionsDir, { recursive: true });
            console.log('✅ Chat logging initialized at:', this.logsDir);
        } catch (error) {
            console.error('❌ Failed to initialize chat logging:', error);
            this.enabled = false;
        }
    }

    /**
     * Check if logging is enabled
     */
    isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * Enable logging
     */
    enable(): void {
        this.enabled = true;
    }

    /**
     * Disable logging
     */
    disable(): void {
        this.enabled = false;
    }

    /**
     * Log a chat interaction
     */
    async logChat(
        conversationId: string,
        userMessage: Message,
        aiResponses: PersonaResponse[],
        metadata?: any
    ): Promise<void> {
        if (!this.enabled) return;

        try {
            const chatLog: ChatLog = {
                conversationId,
                timestamp: new Date(),
                userMessage: {
                    content: userMessage.content,
                    messageId: userMessage.id
                },
                aiResponses: aiResponses.map(r => ({
                    personaId: r.personaId,
                    personaName: r.personaName,
                    response: r.response,
                    color: r.color
                })),
                metadata
            };

            // Save to daily log file
            await this.saveToDailyLog(chatLog);

            // Save to session file
            await this.saveToSession(conversationId, chatLog);

            console.log(`💬 Chat logged: ${conversationId.substring(0, 8)}...`);
        } catch (error) {
            console.error('❌ Failed to log chat:', error);
        }
    }

    /**
     * Save to daily log file
     */
    private async saveToDailyLog(chatLog: ChatLog): Promise<void> {
        const today = new Date().toISOString().split('T')[0];
        const filename = `chats-${today}.jsonl`;
        const filepath = path.join(this.logsDir, filename);

        const logLine = JSON.stringify(chatLog) + '\n';
        await fs.appendFile(filepath, logLine);
    }

    /**
     * Save to session file
     */
    private async saveToSession(conversationId: string, chatLog: ChatLog): Promise<void> {
        const filename = `${conversationId}.json`;
        const filepath = path.join(this.sessionsDir, filename);

        let session: ChatSession;

        try {
            // Try to load existing session
            const data = await fs.readFile(filepath, 'utf-8');
            session = JSON.parse(data);
            session.messages.push(chatLog);
            session.lastActivity = new Date();
            session.totalMessages++;
        } catch {
            // Create new session
            session = {
                sessionId: conversationId,
                startTime: new Date(),
                lastActivity: new Date(),
                messages: [chatLog],
                totalMessages: 1
            };
        }

        await fs.writeFile(filepath, JSON.stringify(session, null, 2));
    }

    /**
     * Get session data
     */
    async getSession(conversationId: string): Promise<ChatSession | null> {
        if (!this.enabled) return null;

        try {
            const filename = `${conversationId}.json`;
            const filepath = path.join(this.sessionsDir, filename);
            const data = await fs.readFile(filepath, 'utf-8');
            return JSON.parse(data);
        } catch {
            return null;
        }
    }

    /**
     * Get all sessions
     */
    async getAllSessions(): Promise<ChatSession[]> {
        if (!this.enabled) return [];

        try {
            const files = await fs.readdir(this.sessionsDir);
            const sessions: ChatSession[] = [];

            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filepath = path.join(this.sessionsDir, file);
                    const data = await fs.readFile(filepath, 'utf-8');
                    sessions.push(JSON.parse(data));
                }
            }

            // Sort by last activity (most recent first)
            return sessions.sort((a, b) => 
                new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
            );
        } catch (error) {
            console.error('Failed to get sessions:', error);
            return [];
        }
    }

    /**
     * Get daily logs
     */
    async getDailyLogs(date: string): Promise<ChatLog[]> {
        if (!this.enabled) return [];

        try {
            const filename = `chats-${date}.jsonl`;
            const filepath = path.join(this.logsDir, filename);
            const data = await fs.readFile(filepath, 'utf-8');
            
            return data
                .trim()
                .split('\n')
                .map(line => JSON.parse(line));
        } catch {
            return [];
        }
    }

    /**
     * Get logging stats
     */
    async getStats(): Promise<any> {
        if (!this.enabled) {
            return {
                enabled: false,
                totalSessions: 0,
                totalMessages: 0
            };
        }

        try {
            const sessions = await this.getAllSessions();
            const totalMessages = sessions.reduce((sum, s) => sum + s.totalMessages, 0);

            return {
                enabled: true,
                totalSessions: sessions.length,
                totalMessages,
                logsDirectory: this.logsDir
            };
        } catch {
            return {
                enabled: true,
                totalSessions: 0,
                totalMessages: 0,
                logsDirectory: this.logsDir
            };
        }
    }

    /**
     * Export session as markdown for easy reading
     */
    async exportSessionAsMarkdown(conversationId: string): Promise<string | null> {
        const session = await this.getSession(conversationId);
        if (!session) return null;

        let markdown = `# Chat Session: ${conversationId}\n\n`;
        markdown += `**Started:** ${new Date(session.startTime).toLocaleString()}\n`;
        markdown += `**Last Activity:** ${new Date(session.lastActivity).toLocaleString()}\n`;
        markdown += `**Total Messages:** ${session.totalMessages}\n\n`;
        markdown += `---\n\n`;

        session.messages.forEach((msg, index) => {
            markdown += `## Message ${index + 1}\n`;
            markdown += `**Time:** ${new Date(msg.timestamp).toLocaleString()}\n\n`;
            markdown += `### 👤 User\n`;
            markdown += `${msg.userMessage.content}\n\n`;
            markdown += `### 🤖 AI Responses\n\n`;

            msg.aiResponses.forEach(response => {
                markdown += `#### ${response.personaName}\n`;
                markdown += `${response.response}\n\n`;
            });

            markdown += `---\n\n`;
        });

        return markdown;
    }
}

// Singleton instance
export const chatLogger = new ChatLogger();
