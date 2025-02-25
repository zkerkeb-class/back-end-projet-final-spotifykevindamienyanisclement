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
import { MockResponse, createMockRes } from './setup';
import {
    createTrack,
    getAllTracks,
    getTrack,
    updateTrack,
    deleteTrack,
} from '../src/controllers/track.controller';
import { MockPrismaFunction } from './setup';

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        track: {
            create: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        album: {
            findFirst: jest.fn(),
        },
        trackRead: {
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('Track Controller', () => {
    let req: Partial<Request>;
    let res: MockResponse;

    beforeEach(() => {
        req = {
            query: { limit: '10', offset: '0' },
        };
        res = createMockRes();
    });

    describe('createTrack', () => {
        it('should create a new track', async () => {
            const albumData = { id: 1, artistId: 1, groupId: null };
            req.body = { title: 'Test Track', albumId: 1 };

            (prisma.album.findFirst as jest.Mock).mockResolvedValue(albumData);
            (prisma.track.create as MockPrismaFunction).mockResolvedValue({
                id: 1,
                title: 'Test Track',
                albumId: 1,
                artistId: 1,
            });

            await createTrack(req as Request, res as Response);

            expect(prisma.track.create).toHaveBeenCalledWith({
                data: {
                    title: 'Test Track',
                    albumId: 1,
                    artistId: 1,
                    groupId: null,
                },
                include: {
                    sound: true,
                    album: true,
                    artist: true,
                },
            });
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('getAllTracks', () => {
        it('should get all tracks', async () => {
            const tracks = [
                { id: 1, title: 'Track 1' },
                { id: 2, title: 'Track 2' },
            ];
            (prisma.track.findMany as jest.Mock).mockResolvedValue(tracks);

            await getAllTracks(req as Request, res as Response);

            expect(prisma.track.findMany).toHaveBeenCalledWith({
                include: {
                    sound: true,
                    album: {
                        include: {
                            image: true,
                        },
                    },
                    artist: {
                        include: {
                            image: true,
                        },
                    },
                    group: {
                        include: {
                            image: true,
                        },
                    },
                },
                take: 10,
                skip: 0,
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(tracks);
        });
    });
});
