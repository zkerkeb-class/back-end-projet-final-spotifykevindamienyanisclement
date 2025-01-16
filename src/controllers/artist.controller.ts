import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createArtist = async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        const artist = await prisma.artiste.create({
            data: {
                name,
            },
        });
        res.status(201).json(artist);
    } catch (error) {
        res.status(500).json({ message: 'Error creating artist', error });
    }
};

export const getArtists = async (req: Request, res: Response) => {
    try {
        const artists = await prisma.artiste.findMany();
        res.status(200).json(artists);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching artists', error });
    }
};

export const getArtistById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const artist = await prisma.artiste.findUnique({
            where: { id: parseInt(id, 10) },
        });
        if (artist) {
            res.status(200).json(artist);
        } else {
            res.status(404).json({ message: 'Artist not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching artist', error });
    }
};

export const updateArtist = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const artist = await prisma.artiste.update({
            where: { id: parseInt(id, 10) },
            data: { name },
        });
        res.status(200).json(artist);
    } catch (error) {
        res.status(500).json({ message: 'Error updating artist', error });
    }
};

export const deleteArtist = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.artiste.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting artist', error });
    }
};
