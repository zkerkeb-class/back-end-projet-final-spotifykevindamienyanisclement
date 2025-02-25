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
    createArtist,
    getArtists,
    getArtistById,
    updateArtist,
    deleteArtist,
} from '../src/controllers/artist.controller';

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        artist: {
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

describe('Artist Controller', () => {
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

    describe('createArtist', () => {
        it('should create a new artist', async () => {
            req.body = { name: 'Test Artist' };
            (prisma.artist.create as jest.Mock).mockResolvedValue({
                id: 1,
                name: 'Test Artist',
            });

            await createArtist(req as Request, res as Response);

            expect(prisma.artist.create).toHaveBeenCalledWith({
                data: { name: 'Test Artist' },
                include: { image: true },
            });
            expect(statusMock).toHaveBeenCalledWith(201);
        });

        it('should handle errors during artist creation', async () => {
            req.body = { name: 'Test Artist' };
            (prisma.artist.create as jest.Mock).mockRejectedValue(
                new Error('Creation error'),
            );

            await createArtist(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error creating artist',
                error: new Error('Creation error'),
            });
        });
    });

    describe('getArtists', () => {
        it('should get all artists', async () => {
            const artists = [
                { id: 1, name: 'Artist 1' },
                { id: 2, name: 'Artist 2' },
            ];
            (prisma.artist.findMany as jest.Mock).mockResolvedValue(artists);

            await getArtists(req as Request, res as Response);

            expect(prisma.artist.findMany).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(artists);
        });

        it('should handle errors during fetching artists', async () => {
            (prisma.artist.findMany as jest.Mock).mockRejectedValue(
                new Error('Fetching error'),
            );

            await getArtists(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error fetching artists',
                error: new Error('Fetching error'),
            });
        });
    });

    describe('getArtistById', () => {
        it('should get an artist by ID', async () => {
            req.params = { id: '1' };
            const artist = { id: 1, name: 'Test Artist' };
            (prisma.artist.findUnique as jest.Mock).mockResolvedValue(artist);

            await getArtistById(req as Request, res as Response);

            expect(prisma.artist.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    image: true,
                    albums: {
                        include: {
                            image: true,
                        },
                    },
                    tracks: {
                        include: {
                            sound: true,
                        },
                    },
                    group: {
                        include: {
                            image: true,
                        },
                    },
                },
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(artist);
        });

        it('should return 404 if artist not found', async () => {
            req.params = { id: '1' };
            (prisma.artist.findUnique as jest.Mock).mockResolvedValue(null);

            await getArtistById(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Artist not found',
            });
        });

        it('should handle errors during fetching artist by ID', async () => {
            req.params = { id: '1' };
            (prisma.artist.findUnique as jest.Mock).mockRejectedValue(
                new Error('Fetching error'),
            );

            await getArtistById(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error fetching artist',
                error: new Error('Fetching error'),
            });
        });
    });

    describe('updateArtist', () => {
        it('should update an artist by ID', async () => {
            req.params = { id: '1' };
            req.body = { name: 'Updated Artist' };
            const updatedArtist = {
                id: 1,
                name: 'Updated Artist',
            };
            (prisma.artist.update as jest.Mock).mockResolvedValue(
                updatedArtist,
            );

            await updateArtist(req as Request, res as Response);

            expect(prisma.artist.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { name: 'Updated Artist' },
                include: { image: true },
            });
            expect(statusMock).toHaveBeenCalledWith(200);
        });

        it('should handle errors during updating artist', async () => {
            req.params = { id: '1' };
            req.body = { name: 'Updated Artist' };
            (prisma.artist.update as jest.Mock).mockRejectedValue(
                new Error('Updating error'),
            );

            await updateArtist(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error updating artist',
                error: new Error('Updating error'),
            });
        });
    });

    describe('deleteArtist', () => {
        it('should delete an artist by ID', async () => {
            req.params = { id: '1' };
            const mockDeleteResult = { id: 1, name: 'Deleted Artist' };
            (prisma.artist.findUnique as jest.Mock).mockResolvedValue(
                mockDeleteResult,
            );
            (prisma.artist.delete as jest.Mock).mockResolvedValue(
                mockDeleteResult,
            );

            await deleteArtist(req as Request, res as Response);

            expect(prisma.artist.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(statusMock).toHaveBeenCalledWith(204);
        });

        it('should handle errors during deleting artist', async () => {
            req.params = { id: '1' };
            (prisma.artist.delete as jest.Mock).mockRejectedValue(
                new Error('Deleting error'),
            );

            await deleteArtist(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error deleting artist',
                error: new Error('Deleting error'),
            });
        });
    });
});
