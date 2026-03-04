import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ChatRequest, ChatResponse, Message, PersonaResponse } from '../types';
import { getPersonasByIds } from '../models/persona.model';
import { generateMultiPersonaResponse } from '../utils/ai.service';
import { chatLogger } from '../utils/chat-logger';
import {
    createConversation,
    getConversationById,
    addMessage,
    getMessagesByConversation,
} from '../database';

/**
 * POST /api/chat/message
 * Send a message and get responses from selected personas
 */
export const sendMessage = async (req: Request, res: Response) => {
    try {
        console.log('Received chat request:', req.body);
        const { message, personaIds, conversationId, aiEngine, ollamaModel }: ChatRequest = req.body;

        // Validation
        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }
        if (!personaIds || !Array.isArray(personaIds) || personaIds.length === 0) {
            return res.status(400).json({ success: false, error: 'At least one persona must be selected' });
        }

        // Get persona data
        const personas = getPersonasByIds(personaIds);
        if (personas.length === 0) {
            return res.status(404).json({ success: false, error: 'No valid personas found' });
        }

        // ── Resolve or create a DB conversation ──────────────────────────────
        let conv = conversationId ? getConversationById(conversationId) : undefined;
        if (!conv) {
            conv = createConversation(aiEngine || 'ollama', ollamaModel);
        }
        const activeConversationId = conv.id;

        // ── Persist the user message ──────────────────────────────────────────
        const userDbMsg = addMessage(activeConversationId, 'user', message.trim());

        // Build the Message shape the rest of the code expects
        const userMessage: Message = {
            id: userDbMsg.id,
            type: 'user',
            content: userDbMsg.content,
            timestamp: new Date(userDbMsg.created_at),
        };

        // ── Generate AI responses ─────────────────────────────────────────────
        const aiResponses = await generateMultiPersonaResponse(personas, message, aiEngine, ollamaModel);

        // ── Format + persist each AI response ────────────────────────────────
        const personaResponses: PersonaResponse[] = personas.map((persona, index) => {
            const responseText = aiResponses[index].response;

            // Save to DB
            addMessage(
                activeConversationId,
                'ai',
                responseText,
                persona.id,
                persona.name
            );

            return {
                personaId: persona.id,
                personaName: persona.name,
                response: responseText,
                color: persona.color,
            };
        });

        // ── Build and return response ─────────────────────────────────────────
        const response: ChatResponse = {
            success: true,
            data: {
                userMessage,
                aiResponses: personaResponses,
                conversationId: activeConversationId,
            },
        };

        // Legacy file logger (keep if enabled)
        if (chatLogger.isEnabled()) {
            await chatLogger.logChat(
                activeConversationId,
                userMessage,
                personaResponses,
                { userAgent: req.headers['user-agent'], ip: req.ip, personaCount: personas.length }
            );
        }

        res.status(200).json(response);
    } catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to process message',
        });
    }
};

/**
 * GET /api/chat/conversation/:conversationId
 * Get full conversation history from SQLite
 */
export const getConversationHistory = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;

        const conv = getConversationById(conversationId);
        if (!conv) {
            return res.status(404).json({ success: false, error: 'Conversation not found' });
        }

        const rows = getMessagesByConversation(conversationId);
        const messages = rows.map(row => ({
            id: row.id,
            type: row.role,
            content: row.content,
            personaId: row.persona_id,
            personaName: row.persona_name,
            wisdomSource: row.wisdom_source,
            timestamp: row.created_at,
        }));

        res.status(200).json({
            success: true,
            data: {
                conversationId,
                aiEngine: conv.ai_engine,
                ollamaModel: conv.ollama_model,
                startedAt: conv.started_at,
                messages,
                totalMessages: messages.length,
            },
        });
    } catch (error) {
        console.error('Error in getConversationHistory:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch conversation history' });
    }
};






/**
 * Developer endpoint: Get all logged sessions
 */
export const getLoggedSessions = async (req: Request, res: Response) => {
    try {
        if (!chatLogger.isEnabled()) {
            return res.status(400).json({
                success: false,
                error: 'Chat logging is not enabled'
            });
        }

        const sessions = await chatLogger.getAllSessions();
        const stats = await chatLogger.getStats();

        res.status(200).json({
            success: true,
            data: {
                sessions: sessions.map(s => ({
                    sessionId: s.sessionId,
                    startTime: s.startTime,
                    lastActivity: s.lastActivity,
                    totalMessages: s.totalMessages
                })),
                stats
            }
        });
    } catch (error) {
        console.error('Error in getLoggedSessions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch logged sessions'
        });
    }
};

/**
 * Developer endpoint: Export session as markdown
 */
export const exportSession = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;

        if (!chatLogger.isEnabled()) {
            return res.status(400).json({
                success: false,
                error: 'Chat logging is not enabled'
            });
        }

        const markdown = await chatLogger.exportSessionAsMarkdown(conversationId);

        if (!markdown) {
            return res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }

        res.setHeader('Content-Type', 'text/markdown');
        res.setHeader('Content-Disposition', `attachment; filename="chat-${conversationId}.md"`);
        res.send(markdown);
    } catch (error) {
        console.error('Error in exportSession:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to export session'
        });
    }
};

/**
 * Developer endpoint: Get logging stats
 */
export const getLoggingStats = async (req: Request, res: Response) => {
    try {
        const stats = await chatLogger.getStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error in getLoggingStats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch logging stats'
        });
    }
};

/**
 * Developer endpoint: Toggle chat logging
 */
export const toggleChatLogging = async (req: Request, res: Response) => {
    try {
        const { enabled } = req.body;

        if (enabled) {
            chatLogger.enable();
            await chatLogger.init();
        } else {
            chatLogger.disable();
        }

        res.status(200).json({
            success: true,
            data: {
                enabled: chatLogger.isEnabled(),
                message: `Chat logging ${enabled ? 'enabled' : 'disabled'}`
            }
        });
    } catch (error) {
        console.error('Error in toggleChatLogging:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to toggle chat logging'
        });
    }
};

