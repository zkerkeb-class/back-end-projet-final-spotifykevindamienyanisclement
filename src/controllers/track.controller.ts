import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ITrackCreate } from '../types/interfaces/track.interface';
import logger from '../config/logger';

const prisma = new PrismaClient();

export const createTrack = async (req: Request, res: Response) => {
    try {
        const albumId = parseInt(req.params.albumId);
        if (!albumId) {
            res.status(400).json({ error: 'Album ID is required' });
            return;
        }
        const data: ITrackCreate = req.body;

        const album = await prisma.album.findFirst({
            where: {
                id: albumId,
            },
        });

        const track = await prisma.track.create({
            data: {
                ...data,
                albumId,
                artistId: album?.artistId,
                groupId: album?.groupId,
            },
            include: {
                sound: true,
                album: true,
                artist: true,
            },
        });

        res.status(201).json(track);
    } catch (error) {
        logger.error('error happened in create track' + error);
        res.status(500).json({
            error: 'Erreur lors de la création du track',
        });
    }
};

export const getAllTracks = async (req: Request, res: Response) => {
    const { limit = 10, offset = 0 } = req.query;

    try {
        const tracks: any[] = await prisma.track.findMany({
            include: {
                sound: true,
                album: {
                    include: {
                        image: true,
                    },
                },
                artist: {
                    include: {
                        image: true,
                    },
                },
                group: {
                    include: {
                        image: true,
                    },
                },
            },
            take: Number(limit),
            skip: Number(offset),
        });

        res.status(200).json(tracks);
    } catch (error) {
        logger.error('error fetching all tracks' + error);
        res.status(500).json({ message: 'Error fetching all tracks', error });
    }
};

export const getTracks = async (req: Request, res: Response) => {
    const { limit = 10, offset = 0 } = req.query;

    try {
        const tracks: any[] = await prisma.track.findMany({
            include: { sound: true, album: true, artist: true },
            take: Number(limit),
            skip: Number(offset),
        });
        res.status(200).json(tracks);
    } catch (error) {
        logger.error('error fetching tracks' + error);
        res.status(500).json({ message: 'Error fetching tracks', error });
    }
};

export const getTrack = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.trackId);
        if (!id) {
            res.status(400).json({
                error: 'Track ID and Album ID are required',
            });
            return;
        }

        const track = await prisma.track.findFirst({
            where: {
                id,
            },
            include: {
                sound: true,
                album: true,
                artist: true,
                group: true,
            },
        });

        if (!track) {
            res.status(404).json({ error: 'Track non trouvé' });
            return;
        }

        res.json(track);
    } catch (error) {
        logger.error('error happened in find one track' + error);
        res.status(500).json({
            error: 'Erreur lors de la récupération du track',
        });
    }
};

export const updateTrack = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.trackId);
        const data: Partial<ITrackCreate> = req.body;

        const track = await prisma.track.update({
            where: {
                id,
            },
            data,
            include: {
                sound: true,
                album: true,
                artist: true,
                group: true,
            },
        });

        res.json(track);
    } catch (error) {
        logger.error('error happened in update track' + error);
        res.status(500).json({
            error: 'Erreur lors de la mise à jour du track',
        });
    }
};

export const deleteTrack = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.trackId);

        await prisma.track.delete({
            where: {
                id,
            },
        });

        res.status(204).send();
    } catch (error) {
        logger.error('error happened in delete track' + error);
        res.status(500).json({
            error: 'Erreur lors de la suppression du track',
        });
    }
};
