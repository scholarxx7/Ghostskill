import { Request, Response } from 'express';
import { getAllPersonas, getPersonaById } from '../models/persona.model';
import { ApiResponse, Persona } from '../types';

/**
 * Get all available personas
 */
export const getPersonas = async (req: Request, res: Response) => {
    try {
        const personas = getAllPersonas();

        const response: ApiResponse<Persona[]> = {
            success: true,
            data: personas
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error in getPersonas:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch personas'
        });
    }
};

/**
 * Get a specific persona by ID
 */
export const getPersona = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const persona = getPersonaById(id);

        if (!persona) {
            return res.status(404).json({
                success: false,
                error: 'Persona not found'
            });
        }

        const response: ApiResponse<Persona> = {
            success: true,
            data: persona
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error in getPersona:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch persona'
        });
    }
};
