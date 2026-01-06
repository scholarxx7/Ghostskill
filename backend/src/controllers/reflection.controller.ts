import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Reflection, ReflectionRequest, ApiResponse } from '../types';

// In-memory storage (replace with database in production)
const reflections: Reflection[] = [];

/**
 * Create a new reflection
 */
export const createReflection = async (req: Request, res: Response) => {
    try {
        const { mistake, newRule, nextAction, personasUsed }: ReflectionRequest = req.body;

        // Validation
        if (!mistake || !mistake.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Mistake is required'
            });
        }

        if (!newRule || !newRule.trim()) {
            return res.status(400).json({
                success: false,
                error: 'New rule is required'
            });
        }

        if (!nextAction || !nextAction.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Next action is required'
            });
        }

        // Create reflection
        const reflection: Reflection = {
            id: uuidv4(),
            mistake: mistake.trim(),
            newRule: newRule.trim(),
            nextAction: nextAction.trim(),
            personasUsed: personasUsed || [],
            timestamp: new Date().toISOString()
        };

        // Save to storage
        reflections.push(reflection);

        const response: ApiResponse<Reflection> = {
            success: true,
            data: reflection,
            message: 'Reflection saved successfully'
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Error in createReflection:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create reflection'
        });
    }
};

/**
 * Get all reflections
 */
export const getReflections = async (req: Request, res: Response) => {
    try {
        // Sort by timestamp descending (newest first)
        const sortedReflections = [...reflections].sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        const response: ApiResponse<Reflection[]> = {
            success: true,
            data: sortedReflections
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error in getReflections:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch reflections'
        });
    }
};

/**
 * Get a specific reflection by ID
 */
export const getReflection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const reflection = reflections.find(r => r.id === id);

        if (!reflection) {
            return res.status(404).json({
                success: false,
                error: 'Reflection not found'
            });
        }

        const response: ApiResponse<Reflection> = {
            success: true,
            data: reflection
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error in getReflection:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch reflection'
        });
    }
};

/**
 * Delete a reflection
 */
export const deleteReflection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const index = reflections.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Reflection not found'
            });
        }

        reflections.splice(index, 1);

        res.status(200).json({
            success: true,
            message: 'Reflection deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteReflection:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete reflection'
        });
    }
};
