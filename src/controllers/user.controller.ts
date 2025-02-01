import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
    IUserCreate,
    IUser,
    IUserFull,
    IUserUpdate,
} from 'src/types/interfaces/user.interface';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
    const userCreate: IUserCreate = req.body;

    try {
        const user: IUser = await prisma.user.create({
            data: userCreate,
        });
        res.status(201).json(user);
    } catch (error) {
        console.log('error creating user', error);
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.log('error fetching users', error);
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
        console.log('error fetching user', error);
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
        console.log('error updating user', error);
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
        console.log('error deleting user', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
