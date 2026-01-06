import { Router } from 'express';
import { 
    sendMessage, 
    getConversationHistory,
    getLoggedSessions,
    exportSession,
    getLoggingStats,
    toggleChatLogging
} from '../controllers/chat.controller';

const router = Router();

/**
 * POST /api/chat/message
 * Send a message and get AI responses
 */
router.post('/message', sendMessage);

/**
 * GET /api/chat/conversation/:conversationId
 * Get conversation history
 */
router.get('/conversation/:conversationId', getConversationHistory);

/**
 * Developer endpoints for chat logging (beta feature)
 */

/**
 * GET /api/chat/dev/sessions
 * Get all logged chat sessions
 */
router.get('/dev/sessions', getLoggedSessions);

/**
 * GET /api/chat/dev/export/:conversationId
 * Export a session as markdown file
 */
router.get('/dev/export/:conversationId', exportSession);

/**
 * GET /api/chat/dev/stats
 * Get logging statistics
 */
router.get('/dev/stats', getLoggingStats);

/**
 * POST /api/chat/dev/toggle-logging
 * Enable or disable chat logging
 */
router.post('/dev/toggle-logging', toggleChatLogging);

export default router;

