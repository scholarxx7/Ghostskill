import { Router } from 'express';
import { getPersonas, getPersona } from '../controllers/persona.controller';

const router = Router();

/**
 * GET /api/personas
 * Get all available personas
 */
router.get('/', getPersonas);

/**
 * GET /api/personas/:id
 * Get a specific persona by ID
 */
router.get('/:id', getPersona);

export default router;
