import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../config/logger';
const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!name) {
        const emailNamePart = email.split('@')[0];
        req.body.name = emailNamePart;
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(409).json({ message: 'Email is already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'USER',
            },
        });
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: '1h',
            },
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
        });
    } catch (error) {
        logger.error('Error registering user:' + error);
        res.status(500).json({
            message: 'Error registering user',
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        const user: any = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: '1h',
            },
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        logger.error('Error logging in:' + error);
        res.status(500).json({
            message: 'Error logging in',
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
