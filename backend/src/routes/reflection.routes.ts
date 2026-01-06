import { Router } from 'express';
import {
    createReflection,
    getReflections,
    getReflection,
    deleteReflection
} from '../controllers/reflection.controller';

const router = Router();

/**
 * POST /api/reflections
 * Create a new reflection
 */
router.post('/', createReflection);

/**
 * GET /api/reflections
 * Get all reflections
 */
router.get('/', getReflections);

/**
 * GET /api/reflections/:id
 * Get a specific reflection by ID
 */
router.get('/:id', getReflection);

/**
 * DELETE /api/reflections/:id
 * Delete a reflection
 */
router.delete('/:id', deleteReflection);

export default router;
