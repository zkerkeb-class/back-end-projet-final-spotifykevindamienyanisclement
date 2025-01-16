import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPlaylistMusic = async (req: Request, res: Response) => {
    const { title, userId } = req.body;

    try {
        const playlistMusic = await prisma.playlistMusic.create({
            data: {
                title,
                userId,
            },
        });
        res.status(201).json(playlistMusic);
    } catch (error) {
        res.status(500).json({
            message: 'Error creating playlist music',
            error,
        });
    }
};

export const getPlaylistMusics = async (req: Request, res: Response) => {
    try {
        const playlistMusics = await prisma.playlistMusic.findMany();
        res.status(200).json(playlistMusics);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching playlist musics',
            error,
        });
    }
};

export const getPlaylistMusicById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const playlistMusic = await prisma.playlistMusic.findUnique({
            where: { id: parseInt(id, 10) },
        });
        if (playlistMusic) {
            res.status(200).json(playlistMusic);
        } else {
            res.status(404).json({ message: 'Playlist music not found' });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching playlist music',
            error,
        });
    }
};

export const updatePlaylistMusic = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, userId } = req.body;

    try {
        const playlistMusic = await prisma.playlistMusic.update({
            where: { id: parseInt(id, 10) },
            data: { title, userId },
        });
        res.status(200).json(playlistMusic);
    } catch (error) {
        res.status(500).json({
            message: 'Error updating playlist music',
            error,
        });
    }
};

export const deletePlaylistMusic = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.playlistMusic.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting playlist music',
            error,
        });
    }
};
