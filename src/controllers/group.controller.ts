import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
    IGroupCreate,
    IGroup,
    IGroupFull,
} from 'src/types/interfaces/group.interface';
import logger from '../config/logger';

const prisma = new PrismaClient();

export const createGroup = async (req: Request, res: Response) => {
    const groupCreate: IGroupCreate = req.body;

    try {
        const group: IGroup = await prisma.group.create({
            data: groupCreate,
            include: { image: true },
        });

        res.status(201).json(group);
    } catch (error) {
        logger.error('error creating artist group', error);
        res.status(500).json({ message: 'Error creating artist group', error });
    }
};

export const getGroups = async (req: Request, res: Response) => {
    try {
        const groups: IGroup[] = await prisma.group.findMany({
            include: { image: true },
        });
        res.status(200).json(groups);
    } catch (error) {
        logger.error('error fetching artist groups', error);
        res.status(500).json({
            message: 'Error fetching artist groups',
            error,
        });
    }
};

export const getGroupById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) res.status(400).json({ message: 'Artist group ID is required' });

    try {
        const group: IGroupFull | null = await prisma.group.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                image: true,
                artists: { include: { image: true } },
                albums: {
                    include: { image: true },
                },
            },
        });
        if (group) {
            res.status(200).json(group);
        } else {
            res.status(404).json({ message: 'Artist group not found' });
        }
    } catch (error) {
        logger.error('error fetching artist group', error);
        res.status(500).json({ message: 'Error fetching artist group', error });
    }
};

export const updateGroup = async (req: Request, res: Response) => {
    const { id } = req.params;
    const groupUpdate: IGroupCreate = req.body;

    if (!id) res.status(400).json({ message: 'Artist group ID is required' });

    try {
        const group: IGroup = await prisma.group.update({
            where: { id: parseInt(id, 10) },
            data: groupUpdate,
            include: { image: true },
        });
        res.status(200).json(group);
    } catch (error) {
        logger.error('error updating artist group', error);
        res.status(500).json({ message: 'Error updating artist group', error });
    }
};

export const deleteGroup = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) res.status(400).json({ message: 'Artist group ID is required' });

    try {
        await prisma.group.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(204).send();
    } catch (error) {
        logger.error('error deleting artist group', error);
        res.status(500).json({ message: 'Error deleting artist group', error });
    }
};

export const addArtistToGroup = async (req: Request, res: Response) => {
    try {
        const { id, artistId } = req.params;
        // Logique pour ajouter l'artiste au groupe
        res.status(200).json({
            success: true,
            message: 'Artist added to group successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add artist to group',
        });
    }
};

export const removeArtistFromGroup = async (req: Request, res: Response) => {
    try {
        const { id, artistId } = req.params;
        // Logique pour supprimer l'artiste du groupe
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to remove artist from group',
        });
    }
};
