import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
    IPlaylist,
    IPlaylistCreate,
    IPlaylistFull,
} from 'src/types/interfaces/playlist.interface';

const prisma = new PrismaClient();

export const createPlaylist = async (req: Request, res: Response) => {
    const playlistCreate: IPlaylistCreate = req.body;

    try {
        const playlist = await prisma.playlist.create({
            data: playlistCreate,
        });
        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({
            message: 'Error creating playlist music',
            error,
        });
    }
};

export const getPlaylists = async (req: Request, res: Response) => {
    try {
        const playlists: IPlaylist[] = await prisma.playlist.findMany({
            include: { image: true },
        });
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching playlist musics',
            error,
        });
    }
};

export const getPlaylistById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) res.status(400).json({ message: 'Playlist ID is required' });

    try {
        const playlist: IPlaylistFull | null = await prisma.playlist.findUnique(
            {
                where: { id: parseInt(id, 10) },
                include: {
                    image: true,
                    tracks: { include: { sound: true } },
                    user: true,
                },
            },
        );
        if (playlist) {
            res.status(200).json(playlist);
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

export const updatePlaylist = async (req: Request, res: Response) => {
    const { id } = req.params;
    const playlistUpdate: IPlaylistCreate = req.body;
    if (!id) res.status(400).json({ message: 'Playlist ID is required' });

    try {
        const playlist: IPlaylist = await prisma.playlist.update({
            where: { id: parseInt(id, 10) },
            data: playlistUpdate,
            include: { image: true },
        });
        res.status(200).json(playlist);
    } catch (error) {
        console.log('error updating playlist music', error);
        res.status(500).json({
            message: 'Error updating playlist music',
            error,
        });
    }
};

export const deletePlaylist = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) res.status(400).json({ message: 'Playlist ID is required' });

    try {
        await prisma.playlist.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(204).send();
    } catch (error) {
        console.log('error deleting playlist music', error);
        res.status(500).json({
            message: 'Error deleting playlist music',
            error,
        });
    }
};
