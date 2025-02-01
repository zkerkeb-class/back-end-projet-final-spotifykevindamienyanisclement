import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
    createAlbum,
    getAlbums,
    getAlbumById,
    updateAlbum,
    deleteAlbum,
} from '../src/controllers/album.controller';

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        album: {
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

describe('Album Controller', () => {
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

    describe('createAlbum', () => {
        it('should create a new music album', async () => {
            req.body = { title: 'Test Album', artistId: 1 };
            (prisma.album.create as jest.Mock).mockResolvedValue({
                id: 1,
                title: 'Test Album',
                artistId: 1,
            });

            await createAlbum(req as Request, res as Response);

            expect(prisma.album.create).toHaveBeenCalledWith({
                data: { title: 'Test Album', artistId: 1 },
            });
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                id: 1,
                title: 'Test Album',
                artistId: 1,
            });
        });

        it('should handle errors during album creation', async () => {
            req.body = { title: 'Test Album', artistId: 1 };
            (prisma.album.create as jest.Mock).mockRejectedValue(
                new Error('Creation error'),
            );

            await createAlbum(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error creating music album',
                error: new Error('Creation error'),
            });
        });
    });

    describe('getAlbums', () => {
        it('should get all music albums', async () => {
            const albums = [
                { id: 1, title: 'Album 1', artistId: 1 },
                { id: 2, title: 'Album 2', artistId: 2 },
            ];
            (prisma.album.findMany as jest.Mock).mockResolvedValue(albums);

            await getAlbums(req as Request, res as Response);

            expect(prisma.album.findMany).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(albums);
        });

        it('should handle errors during fetching albums', async () => {
            (prisma.album.findMany as jest.Mock).mockRejectedValue(
                new Error('Fetching error'),
            );

            await getAlbums(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error fetching music albums',
                error: new Error('Fetching error'),
            });
        });
    });

    describe('getAlbumById', () => {
        it('should get a music album by ID', async () => {
            req.params = { id: '1' };
            const album = { id: 1, title: 'Album 1', artistId: 1 };
            (prisma.album.findUnique as jest.Mock).mockResolvedValue(album);

            await getAlbumById(req as Request, res as Response);

            expect(prisma.album.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(album);
        });

        it('should return 404 if album not found', async () => {
            req.params = { id: '1' };
            (prisma.album.findUnique as jest.Mock).mockResolvedValue(null);

            await getAlbumById(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Music album not found',
            });
        });

        it('should handle errors during fetching album by ID', async () => {
            req.params = { id: '1' };
            (prisma.album.findUnique as jest.Mock).mockRejectedValue(
                new Error('Fetching error'),
            );

            await getAlbumById(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error fetching music album',
                error: new Error('Fetching error'),
            });
        });
    });

    describe('updateAlbum', () => {
        it('should update a music album by ID', async () => {
            req.params = { id: '1' };
            req.body = { title: 'Updated Album', artistId: 1 };
            const updatedAlbum = {
                id: 1,
                title: 'Updated Album',
                artistId: 1,
            };
            (prisma.album.update as jest.Mock).mockResolvedValue(updatedAlbum);

            await updateAlbum(req as Request, res as Response);

            expect(prisma.album.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { title: 'Updated Album', artistId: 1 },
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(updatedAlbum);
        });

        it('should handle errors during updating album', async () => {
            req.params = { id: '1' };
            req.body = { title: 'Updated Album', artistId: 1 };
            (prisma.album.update as jest.Mock).mockRejectedValue(
                new Error('Updating error'),
            );

            await updateAlbum(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error updating music album',
                error: new Error('Updating error'),
            });
        });
    });

    describe('deleteAlbum', () => {
        it('should delete a music album by ID', async () => {
            req.params = { id: '1' };
            (prisma.album.delete as jest.Mock).mockResolvedValue({});

            await deleteAlbum(req as Request, res as Response);

            expect(prisma.album.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(statusMock).toHaveBeenCalledWith(204);
            expect(sendMock).toHaveBeenCalled();
        });

        it('should handle errors during deleting album', async () => {
            req.params = { id: '1' };
            (prisma.album.delete as jest.Mock).mockRejectedValue(
                new Error('Deleting error'),
            );

            await deleteAlbum(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error deleting music album',
                error: new Error('Deleting error'),
            });
        });
    });
});
