import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
    IUserCreate,
    IUser,
    IUserFull,
    IUserUpdate,
} from 'src/types/interfaces/user.interface';
import logger from '../config/logger';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
    const userCreate: IUserCreate = req.body;

    try {
        const user: IUser = await prisma.user.create({
            data: userCreate,
        });
        res.status(201).json(user);
    } catch (error) {
        logger.error('error creating user' + error);
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    const { limit = 10, offset = 0 } = req.query;

    try {
        const users: IUser[] = await prisma.user.findMany({
            take: Number(limit),
            skip: Number(offset),
        });
        res.status(200).json(users);
    } catch (error) {
        logger.error('error fetching users' + error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) res.status(400).json({ message: 'User ID is required' });

    try {
        const user: IUserFull | null = await prisma.user.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                playlists: {
                    include: { image: true },
                },
            },
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        logger.error('error fetching user' + error);
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateUser: IUserUpdate = req.body;

    if (!id) res.status(400).json({ message: 'User ID is required' });

    try {
        const user: IUser = await prisma.user.update({
            where: { id: parseInt(id, 10) },
            data: updateUser,
        });
        res.status(200).json(user);
    } catch (error) {
        logger.error('error updating user' + error);
        res.status(500).json({ message: 'Error updating user', error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) res.status(400).json({ message: 'User ID is required' });

    try {
        await prisma.user.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(204).send();
    } catch (error) {
        logger.error('error deleting user' + error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    const userClaims = req.user;
    console.log('userClaims', userClaims);
    if (userClaims && userClaims.userId) {
        const user: IUserFull | null = await prisma.user.findUnique({
            where: { id: userClaims.userId },
            include: {
                playlists: {
                    include: { image: true },
                },
            },
        });
        res.status(200).json({ user, userClaims });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

export const markTrackAsRead = async (
    req: Request,
    res: Response,
): Promise<void> => {
    console.log('markTrackAsRead called');
    try {
        const userId = req.user.userId; // Assurez-vous que l'utilisateur est authentifié et que son ID est disponible
        const trackId = parseInt(req.params.trackId);

        // Vérifiez si le track existe
        const track = await prisma.track.findFirst({
            where: {
                id: trackId,
            },
        });

        if (!track) {
            res.status(404).json({ error: 'Track non trouvé' });
            return; // Assurez-vous de retourner après avoir envoyé la réponse
        }

        // Créez une entrée dans TrackRead
        await prisma.trackRead.create({
            data: {
                userId,
                trackId,
            },
        });

        res.status(201).json({ message: 'Track marqué comme lu' });
    } catch (error) {
        logger.error('Erreur lors du marquage du track comme lu' + error);
        res.status(500).json({
            error: 'Erreur lors du marquage du track comme lu',
        });
    }
};
