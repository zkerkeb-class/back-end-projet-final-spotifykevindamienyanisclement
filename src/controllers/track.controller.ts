import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ITrackCreate } from '../types/interfaces/track.interface';

const prisma = new PrismaClient();

export const createTrack = async (req: Request, res: Response) => {
    try {
        const albumId = parseInt(req.params.albumId);
        console.log(req.query);
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
            },
            include: {
                sound: true,
                album: true,
                artist: true,
            },
        });

        res.status(201).json(track);
    } catch (error) {
        console.error('error happened in create track', error);
        res.status(500).json({
            error: 'Erreur lors de la création du track',
        });
    }
};

export const getTracks = async (req: Request, res: Response) => {
    try {
        const albumId = parseInt(req.params.albumId);
        const tracks = await prisma.track.findMany({
            where: {
                albumId,
            },
            include: {
                sound: true,
                // album: true,
                // artist: true,
            },
        });

        res.json(tracks);
    } catch (error) {
        console.error('error happened in find all tracks', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des tracks',
        });
    }
};

export const getTrack = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.trackId);
        const albumId = parseInt(req.params.albumId);
        if (!id || !albumId) {
            res.status(400).json({
                error: 'Track ID and Album ID are required',
            });
            return;
        }

        const track = await prisma.track.findFirst({
            where: {
                id,
                albumId,
            },
            include: {
                sound: true,
                album: true,
                artist: true,
            },
        });

        if (!track) {
            res.status(404).json({ error: 'Track non trouvé' });
            return;
        }

        res.json(track);
    } catch (error) {
        console.error('error happened in find one track', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération du track',
        });
    }
};

export const updateTrack = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.trackId);
        const albumId = parseInt(req.params.albumId);
        const data: Partial<ITrackCreate> = req.body;

        const track = await prisma.track.update({
            where: {
                id,
                albumId,
            },
            data,
            include: {
                sound: true,
                album: true,
                artist: true,
            },
        });

        res.json(track);
    } catch (error) {
        console.error('error happened in update track', error);
        res.status(500).json({
            error: 'Erreur lors de la mise à jour du track',
        });
    }
};

export const deleteTrack = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.trackId);
        const albumId = parseInt(req.params.albumId);

        await prisma.track.delete({
            where: {
                id,
                albumId,
            },
        });

        res.status(204).send();
    } catch (error) {
        console.error('error happened in delete track', error);
        res.status(500).json({
            error: 'Erreur lors de la suppression du track',
        });
    }
};
