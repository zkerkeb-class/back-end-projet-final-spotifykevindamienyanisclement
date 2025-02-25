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
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    markTrackAsRead,
} from '../src/controllers/user.controller';

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        track: {
            findFirst: jest.fn(),
        },
        trackRead: {
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('User Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    let sendMock: jest.Mock;

    beforeEach(() => {
        req = {};
        jsonMock = jest.fn();
        sendMock = jest.fn();
        statusMock = jest.fn(() => ({ json: jsonMock, send: sendMock }));
        res = {
            status: statusMock,
            json: jsonMock,
            send: sendMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password',
                name: 'Test User',
            };
            (prisma.user.create as jest.Mock).mockResolvedValue({
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
            });

            await createUser(req as Request, res as Response);

            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    email: 'test@example.com',
                    password: 'password',
                    name: 'Test User',
                },
            });
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
            });
        });

        it('should handle errors during user creation', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password',
                name: 'Test User',
            };
            (prisma.user.create as jest.Mock).mockRejectedValue(
                new Error('Creation error'),
            );

            await createUser(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error creating user',
                error: new Error('Creation error'),
            });
        });
    });

    describe('getUsers', () => {
        it('should get all users', async () => {
            req.query = { limit: '10', offset: '0' };
            const users = [
                { id: 1, email: 'user1@test.com', name: 'User 1' },
                { id: 2, email: 'user2@test.com', name: 'User 2' },
            ];
            (prisma.user.findMany as jest.Mock).mockResolvedValue(users);

            await getUsers(req as Request, res as Response);

            expect(prisma.user.findMany).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(users);
        });

        it('should handle errors during fetching users', async () => {
            req.query = { limit: '10', offset: '0' };
            (prisma.user.findMany as jest.Mock).mockRejectedValue(
                new Error('Fetching error'),
            );

            await getUsers(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error fetching users',
                error: new Error('Fetching error'),
            });
        });
    });

    describe('getUserById', () => {
        it('should get a user by ID', async () => {
            req.params = { id: '1' };
            const user = {
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
            };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

            await getUserById(req as Request, res as Response);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    playlists: {
                        include: {
                            image: true,
                        },
                    },
                },
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(user);
        });

        it('should return 404 if user not found', async () => {
            req.params = { id: '1' };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await getUserById(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'User not found',
            });
        });

        it('should handle errors during fetching user by ID', async () => {
            req.params = { id: '1' };
            (prisma.user.findUnique as jest.Mock).mockRejectedValue(
                new Error('Fetching error'),
            );

            await getUserById(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error fetching user',
                error: new Error('Fetching error'),
            });
        });
    });

    describe('updateUser', () => {
        it('should update a user by ID', async () => {
            req.params = { id: '1' };
            req.body = {
                email: 'updated@example.com',
                password: 'updatedpassword',
                name: 'Updated User',
            };
            const updatedUser = {
                id: 1,
                email: 'updated@example.com',
                name: 'Updated User',
            };
            (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

            await updateUser(req as Request, res as Response);

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    email: 'updated@example.com',
                    password: 'updatedpassword',
                    name: 'Updated User',
                },
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(updatedUser);
        });

        it('should handle errors during updating user', async () => {
            req.params = { id: '1' };
            req.body = {
                email: 'updated@example.com',
                password: 'updatedpassword',
                name: 'Updated User',
            };
            (prisma.user.update as jest.Mock).mockRejectedValue(
                new Error('Updating error'),
            );

            await updateUser(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error updating user',
                error: new Error('Updating error'),
            });
        });
    });

    describe('deleteUser', () => {
        it('should delete a user by ID', async () => {
            req.params = { id: '1' };
            (prisma.user.delete as jest.Mock).mockResolvedValue({});

            await deleteUser(req as Request, res as Response);

            expect(prisma.user.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(statusMock).toHaveBeenCalledWith(204);
            expect(sendMock).toHaveBeenCalled();
        });

        it('should handle errors during deleting user', async () => {
            req.params = { id: '1' };
            (prisma.user.delete as jest.Mock).mockRejectedValue(
                new Error('Deleting error'),
            );

            await deleteUser(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error deleting user',
                error: new Error('Deleting error'),
            });
        });
    });

    describe('markTrackAsRead', () => {
        it('should mark a track as read', async () => {
            req.user = { userId: 1 };
            req.params = { trackId: '1' };

            const mockTrack = {
                id: 1,
                title: 'Test Track',
            };

            (prisma.track.findFirst as jest.Mock).mockResolvedValue(mockTrack);
            (prisma.trackRead.create as jest.Mock).mockResolvedValue({
                userId: 1,
                trackId: 1,
            });

            await markTrackAsRead(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Track marqué comme lu',
            });
        });
    });
});
