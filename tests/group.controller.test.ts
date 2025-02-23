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
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
} from '../src/controllers/group.controller';

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        group: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('Group Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    let sendMock: jest.Mock;

    beforeEach(() => {
        req = {
            query: { limit: '10', offset: '0' },
        };
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

    describe('createGroup', () => {
        it('should create a new artist group', async () => {
            req.body = { title: 'Test Artist Group' };
            (prisma.group.create as jest.Mock).mockResolvedValue({
                id: 1,
                title: 'Test Artist Group',
            });

            await createGroup(req as Request, res as Response);

            expect(prisma.group.create).toHaveBeenCalledWith({
                data: { title: 'Test Artist Group' },
                include: { image: true },
            });
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                id: 1,
                title: 'Test Artist Group',
            });
        });

        it('should handle errors during artist group creation', async () => {
            req.body = { title: 'Test Artist Group' };
            (prisma.group.create as jest.Mock).mockRejectedValue(
                new Error('Creation error'),
            );

            await createGroup(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error creating artist group',
                error: new Error('Creation error'),
            });
        });
    });

    describe('getGroups', () => {
        it('should get all artist groups', async () => {
            req.query = { limit: '10', offset: '0' };
            const groups = [
                { id: 1, title: 'Group 1' },
                { id: 2, title: 'Group 2' },
            ];
            (prisma.group.findMany as jest.Mock).mockResolvedValue(groups);

            await getGroups(req as Request, res as Response);

            expect(prisma.group.findMany).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(groups);
        });

        it('should handle errors during fetching artist groups', async () => {
            (prisma.group.findMany as jest.Mock).mockRejectedValue(
                new Error('Fetching error'),
            );

            await getGroups(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error fetching artist groups',
                error: new Error('Fetching error'),
            });
        });
    });

    describe('getGroupById', () => {
        it('should get an artist group by ID', async () => {
            req.params = { id: '1' };
            const group = { id: 1, title: 'Artist Group 1' };
            (prisma.group.findUnique as jest.Mock).mockResolvedValue(group);

            await getGroupById(req as Request, res as Response);

            expect(prisma.group.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    image: true,
                    albums: {
                        include: {
                            image: true,
                        },
                    },
                    artists: {
                        include: {
                            image: true,
                        },
                    },
                },
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(group);
        });

        it('should return 404 if artist group not found', async () => {
            req.params = { id: '1' };
            (prisma.group.findUnique as jest.Mock).mockResolvedValue(null);

            await getGroupById(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Artist group not found',
            });
        });

        it('should handle errors during fetching artist group by ID', async () => {
            req.params = { id: '1' };
            (prisma.group.findUnique as jest.Mock).mockRejectedValue(
                new Error('Fetching error'),
            );

            await getGroupById(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error fetching artist group',
                error: new Error('Fetching error'),
            });
        });
    });

    describe('updateGroup', () => {
        it('should update an artist group by ID', async () => {
            req.params = { id: '1' };
            req.body = { title: 'Updated Artist Group' };
            const updatedGroup = {
                id: 1,
                title: 'Updated Artist Group',
            };
            (prisma.group.update as jest.Mock).mockResolvedValue(updatedGroup);

            await updateGroup(req as Request, res as Response);

            expect(prisma.group.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { title: 'Updated Artist Group' },
                include: {
                    image: true,
                },
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(updatedGroup);
        });

        it('should handle errors during updating artist group', async () => {
            req.params = { id: '1' };
            req.body = { title: 'Updated Artist Group' };
            (prisma.group.update as jest.Mock).mockRejectedValue(
                new Error('Updating error'),
            );

            await updateGroup(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error updating artist group',
                error: new Error('Updating error'),
            });
        });
    });

    describe('deleteGroup', () => {
        it('should delete an artist group by ID', async () => {
            req.params = { id: '1' };
            (prisma.group.delete as jest.Mock).mockResolvedValue({});

            await deleteGroup(req as Request, res as Response);

            expect(prisma.group.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(statusMock).toHaveBeenCalledWith(204);
            expect(sendMock).toHaveBeenCalled();
        });

        it('should handle errors during deleting artist group', async () => {
            req.params = { id: '1' };
            (prisma.group.delete as jest.Mock).mockRejectedValue(
                new Error('Deleting error'),
            );

            await deleteGroup(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error deleting artist group',
                error: new Error('Deleting error'),
            });
        });
    });
});
