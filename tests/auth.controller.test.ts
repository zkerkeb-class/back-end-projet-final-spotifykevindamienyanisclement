import {
    describe,
    expect,
    jest,
    it,
    beforeEach,
    afterEach,
} from '@jest/globals';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { register, login } from '../src/controllers/auth.controller';

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: {
            create: jest.fn(),
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const prisma = new PrismaClient();

describe('Authentication Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        req = {};
        jsonMock = jest.fn();
        statusMock = jest.fn(() => ({ json: jsonMock }));
        res = {
            status: statusMock,
            json: jsonMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                password: 'hashedPassword',
                role: 'USER',
            };

            req.body = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };

            bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
            (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
            jwt.sign = jest.fn().mockReturnValue('token123');

            await register(req as Request, res as Response);

            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    email: 'test@example.com',
                    password: 'hashedPassword',
                    name: 'Test User',
                    role: 'USER',
                },
            });
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'User registered successfully',
                token: 'token123',
                user: {
                    id: 1,
                    email: 'test@example.com',
                    name: 'Test User',
                },
            });
        });

        it('should handle errors during registration', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password',
                name: 'Test User',
            };
            (bcrypt.hash as jest.Mock).mockRejectedValue(
                new Error('Hashing error'),
            );

            await register(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error registering user',
                error: 'Hashing error',
            });
        });

        it('should handle missing name in registration', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123',
            };

            const expectedUser = {
                id: 1,
                email: 'test@example.com',
                name: undefined,
                password: 'hashedPassword',
                role: 'USER',
            };

            bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
            (prisma.user.create as jest.Mock).mockResolvedValue(expectedUser);

            await register(req as Request, res as Response);

            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    email: 'test@example.com',
                    password: 'hashedPassword',
                    name: undefined,
                    role: 'USER',
                },
            });
            expect(statusMock).toHaveBeenCalledWith(201);
        });
    });

    describe('login', () => {
        it('should login a user with valid credentials', async () => {
            req.body = { email: 'test@example.com', password: 'password' };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: 1,
                email: 'test@example.com',
                password: 'hashedPassword',
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('token');

            await login(req as Request, res as Response);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
            });
            expect(bcrypt.compare).toHaveBeenCalledWith(
                'password',
                'hashedPassword',
            );
            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    userId: 1,
                    email: 'test@example.com',
                    role: undefined,
                    name: undefined,
                },
                process.env.JWT_SECRET!,
                { expiresIn: '1h' },
            );
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Login successful',
                token: 'token',
            });
        });

        it('should not login a user with invalid credentials', async () => {
            req.body = { email: 'test@example.com', password: 'wrongpassword' };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: 1,
                email: 'test@example.com',
                password: 'hashedPassword',
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await login(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Invalid email or password',
            });
        });

        it('should handle errors during login', async () => {
            req.body = { email: 'test@example.com', password: 'password123' };
            (prisma.user.findUnique as jest.Mock).mockRejectedValue(
                new Error('Database error'),
            );

            await login(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error logging in',
                error: 'Database error',
            });
        });
    });
});
