import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createMusicAlbum = async (req: Request, res: Response) => {
    const { title, artisteId, test } = req.body;

    try {
        const musicAlbum = await prisma.musicAlbum.create({
            data: {
                title,
                artisteId,
            },
        });
        res.status(201).json(musicAlbum);
    } catch (error) {
        res.status(500).json({ message: 'Error creating music album', error });
    }
};

export const getMusicAlbums = async (req: Request, res: Response) => {
    try {
        const musicAlbums = await prisma.musicAlbum.findMany();
        res.status(200).json(musicAlbums);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching music albums', error });
    }
};

export const getMusicAlbumById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const musicAlbum = await prisma.musicAlbum.findUnique({
            where: { id: parseInt(id, 10) },
        });
        if (musicAlbum) {
            res.status(200).json(musicAlbum);
        } else {
            res.status(404).json({ message: 'Music album not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching music album', error });
    }
};

export const updateMusicAlbum = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, artisteId } = req.body;

    try {
        const musicAlbum = await prisma.musicAlbum.update({
            where: { id: parseInt(id, 10) },
            data: { title, artisteId },
        });
        res.status(200).json(musicAlbum);
    } catch (error) {
        res.status(500).json({ message: 'Error updating music album', error });
    }
};

export const deleteMusicAlbum = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.musicAlbum.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting music album', error });
    }
};
