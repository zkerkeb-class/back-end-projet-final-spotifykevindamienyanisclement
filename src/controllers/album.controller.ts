import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
    IAlbum,
    IAlbumCreate,
    IAlbumFull,
    IAlbumUpdate,
} from 'src/types/interfaces/album.interface';
import { ITrackCreate } from 'src/types/interfaces/track.interface';
import logger from '../config/logger';

const prisma = new PrismaClient();

export const createAlbum = async (req: Request, res: Response) => {
    const { title, imageId, artistId, groupId, tracks }: IAlbumCreate =
        req.body;

    try {
        const album: IAlbum = await prisma.album.create({
            data: { title, imageId, artistId, groupId },
            include: { image: true },
        });
        if (tracks) {
            const createdTracks = await prisma.track.createMany({
                data: tracks.map((track: ITrackCreate) => ({
                    ...track,
                    albumId: album.id,
                    artistId: artistId,
                    groupId: groupId,
                })),
            });
            res.status(201).json({ ...album, tracks: createdTracks });
        }

        res.status(201).json(album);
    } catch (error) {
        logger.error('error creating music album', error);
        res.status(500).json({ message: 'Error creating music album', error });
    }
};

export const getAlbums = async (req: Request, res: Response) => {
    try {
        const albums: IAlbum[] = await prisma.album.findMany({
            include: { image: true },
        });
        res.status(200).json(albums);
    } catch (error) {
        logger.error('error fetching music albums', error);
        res.status(500).json({ message: 'Error fetching music albums', error });
    }
};

export const getAlbumById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: 'Album ID is required' });
    }

    try {
        const album: IAlbumFull | null = await prisma.album.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                tracks: {
                    include: { sound: true },
                },
                artist: {
                    include: { image: true },
                },
                group: {
                    include: { image: true },
                },
                image: true,
            },
        });
        if (album) {
            res.status(200).json(album);
        } else {
            res.status(404).json({ message: 'Music album not found' });
        }
    } catch (error) {
        logger.error('error fetching music album', error);
        res.status(500).json({ message: 'Error fetching music album', error });
    }
};

export const updateAlbum = async (req: Request, res: Response) => {
    const { id } = req.params;
    const albumUpdate: IAlbumUpdate = req.body;
    if (!id) res.status(400).json({ message: 'Album ID is required' });

    try {
        const album: IAlbum = await prisma.album.update({
            where: { id: parseInt(id, 10) },
            data: albumUpdate,
            include: { image: true },
        });
        res.status(200).json(album);
    } catch (error) {
        logger.error('error updating music album', error);
        res.status(500).json({ message: 'Error updating music album', error });
    }
};

export const deleteAlbum = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: 'Album ID is required' });
    }

    try {
        await prisma.album.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(204).send();
    } catch (error) {
        logger.error('error deleting music album', error);
        res.status(500).json({ message: 'Error deleting music album', error });
    }
};
