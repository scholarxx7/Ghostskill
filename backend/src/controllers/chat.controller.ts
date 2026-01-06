import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ChatRequest, ChatResponse, Message, PersonaResponse } from '../types';
import { getPersonasByIds } from '../models/persona.model';
import { generateMultiPersonaResponse } from '../utils/ai.service';import { chatLogger } from '../utils/chat-logger';
/**
 * Send a message and get responses from selected personas
 */
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { message, personaIds, conversationId }: ChatRequest = req.body;

        // Validation
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        if (!personaIds || !Array.isArray(personaIds) || personaIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'At least one persona must be selected'
            });
        }

        // Get persona data
        const personas = getPersonasByIds(personaIds);
        if (personas.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No valid personas found'
            });
        }

        // Create user message
        const userMessage: Message = {
            id: uuidv4(),
            type: 'user',
            content: message.trim(),
            timestamp: new Date()
        };

        // Generate AI responses
        const aiResponses = await generateMultiPersonaResponse(personas, message);

        // Format responses
        const personaResponses: PersonaResponse[] = personas.map((persona, index) => ({
            personaId: persona.id,
            personaName: persona.name,
            response: aiResponses[index].response,
            color: persona.color
        }));

        // Return response
        const response: ChatResponse = {
            success: true,
            data: {
                userMessage,
                aiResponses: personaResponses,
                conversationId: conversationId || uuidv4()
            }
        };

        // Log chat conversation (beta feature)
        if (chatLogger.isEnabled()) {
            await chatLogger.logChat(
                response.data.conversationId,
                userMessage,
                personaResponses,
                {
                    userAgent: req.headers['user-agent'],
                    ip: req.ip,
                    personaCount: personas.length
                }
            );
        }

        res.status(200).json(response);
    } catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process message'
        });
    }
};

/**
 * Get conversation history (placeholder for future implementation)
 */
export const getConversationHistory = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;

        // If logging is enabled, return from logs
        if (chatLogger.isEnabled()) {
            const session = await chatLogger.getSession(conversationId);
            
            if (session) {
                return res.status(200).json({
                    success: true,
                    data: {
                        conversationId,
                        messages: session.messages.flatMap(log => [
                            {
                                id: log.userMessage.messageId,
                                type: 'user',
                                content: log.userMessage.content,
                                timestamp: log.timestamp
                            },
                            ...log.aiResponses.map(ai => ({
                                id: uuidv4(),
                                type: 'ai',
                                content: ai.response,
                                personaId: ai.personaId,
                                personaName: ai.personaName,
                                timestamp: log.timestamp
                            }))
                        ]),
                        totalMessages: session.totalMessages
                    }
                });
            }
        }

        // This would fetch from database in production
        res.status(200).json({
            success: true,
            data: {
                conversationId,
                messages: [],
                message: 'Conversation history feature coming soon'
            }
        });
    } catch (error) {
        console.error('Error in getConversationHistory:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch conversation history'
        });
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

