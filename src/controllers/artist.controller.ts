import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
    IArtist,
    IArtistCreate,
    IArtistFull,
} from 'src/types/interfaces/artist.interface';
import logger from '../config/logger';

const prisma = new PrismaClient();

export const createArtist = async (req: Request, res: Response) => {
    const artistCreate: IArtistCreate = req.body;

    try {
        const artist: IArtist = await prisma.artist.create({
            data: artistCreate,
            include: { image: true },
        });
        res.status(201).json(artist);
    } catch (error) {
        logger.error('error creating artist' + error);
        res.status(500).json({ message: 'Error creating artist', error });
    }
};

export const getArtists = async (req: Request, res: Response) => {
    const { limit = 10, offset = 0 } = req.query;

    try {
        const artists: IArtist[] = await prisma.artist.findMany({
            include: { image: true },
            take: Number(limit),
            skip: Number(offset),
        });
        res.status(200).json(artists);
    } catch (error) {
        logger.error('error fetching artists' + error);
        res.status(500).json({ message: 'Error fetching artists', error });
    }
};

export const getArtistById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) res.status(400).json({ message: 'Artist ID is required' });

    try {
        const artist: IArtistFull | null = await prisma.artist.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                image: true,
                group: {
                    include: { image: true },
                },
                albums: { include: { image: true } },
                tracks: { include: { sound: true } },
            },
        });
        if (artist) {
            res.status(200).json(artist);
        } else {
            res.status(404).json({ message: 'Artist not found' });
        }
    } catch (error) {
        logger.error('error fetching artist' + error);
        res.status(500).json({ message: 'Error fetching artist', error });
    }
};

export const updateArtist = async (req: Request, res: Response) => {
    const { id } = req.params;
    const artistUpdate: IArtistCreate = req.body;

    if (!id) res.status(400).json({ message: 'Artist ID is required' });

    try {
        const artist: IArtist = await prisma.artist.update({
            where: { id: parseInt(id, 10) },
            data: artistUpdate,
            include: { image: true },
        });
        res.status(200).json(artist);
    } catch (error) {
        logger.error('error updating artist' + error);
        res.status(500).json({ message: 'Error updating artist', error });
    }
};

export const deleteArtist = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ message: 'Artist ID is required' });
        return;
    }

    try {
        const artistExists = await prisma.artist.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!artistExists) {
            res.status(404).json({ message: 'Artist not found' });
            return;
        }

        await prisma.artist.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(204).send();
    } catch (error) {
        logger.error('error deleting artist' + error);
        res.status(500).json({ message: 'Error deleting artist', error });
    }
};
