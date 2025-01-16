import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createArtistGroup = async (req: Request, res: Response) => {
    const { title } = req.body;

    try {
        const artistGroup = await prisma.artistGroup.create({
            data: {
                title,
            },
        });
        res.status(201).json(artistGroup);
    } catch (error) {
        res.status(500).json({ message: 'Error creating artist group', error });
    }
};

export const getArtistGroups = async (req: Request, res: Response) => {
    try {
        const artistGroups = await prisma.artistGroup.findMany();
        res.status(200).json(artistGroups);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching artist groups',
            error,
        });
    }
};

export const getArtistGroupById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const artistGroup = await prisma.artistGroup.findUnique({
            where: { id: parseInt(id, 10) },
        });
        if (artistGroup) {
            res.status(200).json(artistGroup);
        } else {
            res.status(404).json({ message: 'Artist group not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching artist group', error });
    }
};

export const updateArtistGroup = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title } = req.body;

    try {
        const artistGroup = await prisma.artistGroup.update({
            where: { id: parseInt(id, 10) },
            data: { title },
        });
        res.status(200).json(artistGroup);
    } catch (error) {
        res.status(500).json({ message: 'Error updating artist group', error });
    }
};

export const deleteArtistGroup = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.artistGroup.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting artist group', error });
    }
};
