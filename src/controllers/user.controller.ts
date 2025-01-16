import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password,
                name,
            },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id, 10) },
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, password, name } = req.body;

    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id, 10) },
            data: { email, password, name },
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.user.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
