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
    createPlaylist,
    getPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
} from '../src/controllers/playlist.controller';

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        playlist: {
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

describe('Playlist Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    let sendMock: jest.Mock;

    beforeEach(() => {
        req = {
            query: { limit: '10', offset: '0' },
            user: { userId: 1 },
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

    describe('createPlaylist', () => {
        it('should create a new playlist music', async () => {
            req.body = { title: 'Test Playlist', userId: 1 };
            (prisma.playlist.create as jest.Mock).mockResolvedValue({
                id: 1,
                title: 'Test Playlist',
                userId: 1,
            });

            await createPlaylist(req as Request, res as Response);

            expect(prisma.playlist.create).toHaveBeenCalledWith({
                data: { title: 'Test Playlist', userId: 1 },
            });
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                id: 1,
                title: 'Test Playlist',
                userId: 1,
            });
        });

        it('should handle errors during playlist music creation', async () => {
            req.body = { title: 'Test Playlist', userId: 1 };
            (prisma.playlist.create as jest.Mock).mockRejectedValue(
                new Error('Creation error'),
            );

            await createPlaylist(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error creating playlist music',
                error: new Error('Creation error'),
            });
        });
    });

    describe('getPlaylists', () => {
        it('should get all playlist musics', async () => {
            req.query = { limit: '10', offset: '0' };
            const playlists = [
                { id: 1, title: 'Playlist 1', userId: 1 },
                { id: 2, title: 'Playlist 2', userId: 2 },
            ];
            (prisma.playlist.findMany as jest.Mock).mockResolvedValue(
                playlists,
            );

            await getPlaylists(req as Request, res as Response);

            expect(prisma.playlist.findMany).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(playlists);
        });

        it('should handle errors during fetching playlist musics', async () => {
            (prisma.playlist.findMany as jest.Mock).mockRejectedValue(
                new Error('Fetching error'),
            );

            await getPlaylists(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error fetching playlist musics',
                error: new Error('Fetching error'),
            });
        });
    });

    describe('getPlaylistById', () => {
        it('should get a playlist music by ID', async () => {
            req.params = { id: '1' };
            const playlist = { id: 1, title: 'Playlist 1', userId: 1 };
            (prisma.playlist.findUnique as jest.Mock).mockResolvedValue(
                playlist,
            );

            await getPlaylistById(req as Request, res as Response);

            expect(prisma.playlist.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    image: true,
                    tracks: {
                        include: {
                            sound: true,
                        },
                    },
                    user: true,
                },
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(playlist);
        });

        it('should return 404 if playlist music not found', async () => {
            req.params = { id: '1' };
            (prisma.playlist.findUnique as jest.Mock).mockResolvedValue(null);

            await getPlaylistById(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Playlist music not found',
            });
        });

        it('should handle errors during fetching playlist music by ID', async () => {
            req.params = { id: '1' };
            (prisma.playlist.findUnique as jest.Mock).mockRejectedValue(
                new Error('Fetching error'),
            );

            await getPlaylistById(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error fetching playlist music',
                error: new Error('Fetching error'),
            });
        });
    });

    describe('updatePlaylist', () => {
        it('should update a playlist music by ID', async () => {
            req.params = { id: '1' };
            req.body = { title: 'Updated Playlist', userId: 1 };
            const updatedPlaylist = {
                id: 1,
                title: 'Updated Playlist',
                userId: 1,
            };
            (prisma.playlist.update as jest.Mock).mockResolvedValue(
                updatedPlaylist,
            );

            await updatePlaylist(req as Request, res as Response);

            expect(prisma.playlist.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { title: 'Updated Playlist', userId: 1 },
                include: {
                    image: true,
                },
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(updatedPlaylist);
        });

        it('should handle errors during updating playlist music', async () => {
            req.params = { id: '1' };
            req.body = { title: 'Updated Playlist', userId: 1 };
            (prisma.playlist.update as jest.Mock).mockRejectedValue(
                new Error('Updating error'),
            );

            await updatePlaylist(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error updating playlist music',
                error: new Error('Updating error'),
            });
        });
    });

    describe('deletePlaylist', () => {
        it('should delete a playlist music by ID', async () => {
            req.params = { id: '1' };
            (prisma.playlist.delete as jest.Mock).mockResolvedValue({});

            await deletePlaylist(req as Request, res as Response);

            expect(prisma.playlist.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(statusMock).toHaveBeenCalledWith(204);
            expect(sendMock).toHaveBeenCalled();
        });

        it('should handle errors during deleting playlist music', async () => {
            req.params = { id: '1' };
            (prisma.playlist.delete as jest.Mock).mockRejectedValue(
                new Error('Deleting error'),
            );

            await deletePlaylist(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Error deleting playlist music',
                error: new Error('Deleting error'),
            });
        });
    });
});
