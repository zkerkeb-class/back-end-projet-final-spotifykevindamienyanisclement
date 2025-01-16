import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
    createArtistGroup,
    getArtistGroups,
    getArtistGroupById,
    updateArtistGroup,
    deleteArtistGroup,
} from '../src/controllers/artistGroup.controller';

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        artistGroup: {
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

describe('ArtistGroup Controller', () => {
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

    describe('createArtistGroup', () => {
        it('should create a new artist group', async () => {
            req.body = { title: 'Test Artist Group' };
            (prisma.artistGroup.create as jest.Mock).mockResolvedValue({
                id: 1,
                title: 'Test Artist Group',
            });

            await createArtistGroup(req as Request, res as Response);

            expect(prisma.artistGroup.create).toHaveBeenCalledWith({
                data: { title: 'Test Artist Group' },
            });
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                id: 1,
                title: 'Test Artist Group',
            });
        });

        it('should handle errors during artist group creation', async () => {
            req.body = { title: 'Test Artist Group' };
            (prisma.artistGroup.create as jest.Mock).mockRejectedValue(
                new Error('Creation error'),
            );

            await createArtistGroup(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error creating artist group',
                error: new Error('Creation error'),
            });
        });
    });

    describe('getArtistGroups', () => {
        it('should get all artist groups', async () => {
            const artistGroups = [
                { id: 1, title: 'Artist Group 1' },
                { id: 2, title: 'Artist Group 2' },
            ];
            (prisma.artistGroup.findMany as jest.Mock).mockResolvedValue(
                artistGroups,
            );

            await getArtistGroups(req as Request, res as Response);

            expect(prisma.artistGroup.findMany).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(artistGroups);
        });

        it('should handle errors during fetching artist groups', async () => {
            (prisma.artistGroup.findMany as jest.Mock).mockRejectedValue(
                new Error('Fetching error'),
            );

            await getArtistGroups(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error fetching artist groups',
                error: new Error('Fetching error'),
            });
        });
    });

    describe('getArtistGroupById', () => {
        it('should get an artist group by ID', async () => {
            req.params = { id: '1' };
            const artistGroup = { id: 1, title: 'Artist Group 1' };
            (prisma.artistGroup.findUnique as jest.Mock).mockResolvedValue(
                artistGroup,
            );

            await getArtistGroupById(req as Request, res as Response);

            expect(prisma.artistGroup.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(artistGroup);
        });

        it('should return 404 if artist group not found', async () => {
            req.params = { id: '1' };
            (prisma.artistGroup.findUnique as jest.Mock).mockResolvedValue(
                null,
            );

            await getArtistGroupById(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Artist group not found',
            });
        });

        it('should handle errors during fetching artist group by ID', async () => {
            req.params = { id: '1' };
            (prisma.artistGroup.findUnique as jest.Mock).mockRejectedValue(
                new Error('Fetching error'),
            );

            await getArtistGroupById(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error fetching artist group',
                error: new Error('Fetching error'),
            });
        });
    });

    describe('updateArtistGroup', () => {
        it('should update an artist group by ID', async () => {
            req.params = { id: '1' };
            req.body = { title: 'Updated Artist Group' };
            const updatedArtistGroup = { id: 1, title: 'Updated Artist Group' };
            (prisma.artistGroup.update as jest.Mock).mockResolvedValue(
                updatedArtistGroup,
            );

            await updateArtistGroup(req as Request, res as Response);

            expect(prisma.artistGroup.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { title: 'Updated Artist Group' },
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(updatedArtistGroup);
        });

        it('should handle errors during updating artist group', async () => {
            req.params = { id: '1' };
            req.body = { title: 'Updated Artist Group' };
            (prisma.artistGroup.update as jest.Mock).mockRejectedValue(
                new Error('Updating error'),
            );

            await updateArtistGroup(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error updating artist group',
                error: new Error('Updating error'),
            });
        });
    });

    describe('deleteArtistGroup', () => {
        it('should delete an artist group by ID', async () => {
            req.params = { id: '1' };
            (prisma.artistGroup.delete as jest.Mock).mockResolvedValue({});

            await deleteArtistGroup(req as Request, res as Response);

            expect(prisma.artistGroup.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(statusMock).toHaveBeenCalledWith(204);
            expect(sendMock).toHaveBeenCalled();
        });

        it('should handle errors during deleting artist group', async () => {
            req.params = { id: '1' };
            (prisma.artistGroup.delete as jest.Mock).mockRejectedValue(
                new Error('Deleting error'),
            );

            await deleteArtistGroup(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error deleting artist group',
                error: new Error('Deleting error'),
            });
        });
    });
});
