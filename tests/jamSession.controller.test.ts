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
    createJamSession,
    getAllActiveSessions,
    joinSession,
    leaveSession,
    updateCurrentTrack,
    updateTrackPosition,
    updateTrackPlayState,
    deleteJamSession,
} from '../src/controllers/jamSession.controller';
import { MockResponse, createMockRes } from './setup';
import {
    IJamSession,
    IJamSessionCreate,
    IJamSessionFull,
    IJamParticipant,
    IJamParticipantCreate,
} from '../src/types/interfaces/jamSession.interface';

// Définition du type MockPrismaClient
type MockPrismaClient = {
    jamSession: {
        create: jest.Mock<Promise<IJamSessionFull>, [any]>;
        findMany: jest.Mock<Promise<IJamSession[]>, [any]>;
        findUnique: jest.Mock<Promise<IJamSession | null>, [any]>;
        update: jest.Mock<Promise<IJamSessionFull>, [any]>;
        delete: jest.Mock<Promise<IJamSession>, [any]>;
    };
    jamParticipant: {
        create: jest.Mock<Promise<IJamParticipant>, [any]>;
        delete: jest.Mock<Promise<IJamParticipant>, [any]>;
    };
};

// Mock de PrismaClient
const mockPrismaClient = {
    jamSession: {
        create: jest.fn<Promise<IJamSessionFull>, [any]>(),
        findMany: jest.fn<Promise<IJamSession[]>, [any]>(),
        findUnique: jest.fn<Promise<IJamSession | null>, [any]>(),
        update: jest.fn<Promise<IJamSessionFull>, [any]>(),
        delete: jest.fn<Promise<IJamSession>, [any]>(),
    },
    jamParticipant: {
        create: jest.fn<Promise<IJamParticipant>, [any]>(),
        delete: jest.fn<Promise<IJamParticipant>, [any]>(),
    },
};

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn(() => mockPrismaClient),
}));

const prisma = new PrismaClient() as unknown as MockPrismaClient;

describe('JamSession Controller', () => {
    let req: Partial<Request>;
    let res: MockResponse;

    beforeEach(() => {
        req = {
            user: { userId: 1 },
        };
        res = createMockRes();

        jest.clearAllMocks();
        global.wsService = {
            notifySessionUpdate: jest.fn(),
            notifyTrackChange: jest.fn(),
        } as any;
    });

    describe('createJamSession', () => {
        it('should create a new jam session', async () => {
            req.body = { name: 'Test Session' };
            const session = {
                id: 1,
                name: 'Test Session',
                hostId: 1,
            };
            (prisma.jamSession.create as jest.Mock).mockResolvedValue(session);

            await createJamSession(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(session);
        });

        it('should handle errors during jam session creation', async () => {
            req.body = { name: 'Test Session' };
            (prisma.jamSession.create as jest.Mock).mockRejectedValue(
                new Error('Creation error'),
            );

            await createJamSession(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de la création de la session Jam',
            });
        });
    });

    describe('joinSession', () => {
        beforeEach(() => {
            global.wsService = {
                notifySessionUpdate: jest.fn(),
                notifyTrackChange: jest.fn(),
                wss: null,
                clients: new Map(),
                initialize: jest.fn(),
                handleMessage: jest.fn(),
                broadcastToSession: jest.fn(),
            } as any;
        });

        it('should join an existing session', async () => {
            req.params = { id: '1' };
            req.user = { userId: 1 };
            const participant = {
                id: 1,
                userId: 1,
                sessionId: 1,
                session: {
                    id: 1,
                    name: 'Test Session',
                    host: { id: 1, name: 'Host' },
                    currentTrack: null,
                    participants: [],
                    isActive: true,
                },
            };
            (prisma.jamParticipant.create as jest.Mock).mockResolvedValue(
                participant,
            );

            await joinSession(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(participant);
        });

        it('should handle errors during session join', async () => {
            req.params = { id: '1' };
            req.user = { userId: 1 };
            (prisma.jamParticipant.create as jest.Mock).mockRejectedValue(
                new Error('Join error'),
            );

            await joinSession(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de la jointure de la session',
            });
        });

        it('should notify session update after joining', async () => {
            req.params = { id: '1' };
            req.user = { userId: 1 };
            const participant = {
                id: 1,
                userId: 1,
                sessionId: 1,
                session: {
                    id: 1,
                    name: 'Test Session',
                    host: { id: 1, name: 'Host' },
                    currentTrack: null,
                    participants: [],
                    isActive: true,
                },
            };
            (prisma.jamParticipant.create as jest.Mock).mockResolvedValue(
                participant,
            );

            await joinSession(req as Request, res as Response);

            expect(global.wsService.notifySessionUpdate).toHaveBeenCalledWith(
                1,
                participant,
            );
        });
    });

    describe('getAllActiveSessions', () => {
        it('should get all active sessions', async () => {
            const mockSessions = [
                {
                    id: 1,
                    name: 'Session 1',
                    isActive: true,
                    host: { id: 1, name: 'Host 1' },
                    currentTrack: null,
                    participants: [],
                },
            ];

            (prisma.jamSession.findMany as jest.Mock).mockResolvedValue(
                mockSessions,
            );

            await getAllActiveSessions(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockSessions);
        });

        it('should handle errors when fetching sessions', async () => {
            (prisma.jamSession.findMany as jest.Mock).mockRejectedValue(
                new Error('Fetch error'),
            );

            await getAllActiveSessions(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updateCurrentTrack', () => {
        beforeEach(() => {
            global.wsService = {
                notifyTrackChange: jest.fn(),
                notifySessionUpdate: jest.fn(),
            } as any;
        });

        it('should update session track when user is host', async () => {
            req.params = { id: '1' };
            req.body = { trackId: 2 };
            req.user = { userId: 1 };

            const mockSession = {
                id: 1,
                hostId: 1,
                currentTrack: null,
            };

            const updatedSession = {
                ...mockSession,
                currentTrack: {
                    id: 2,
                    title: 'Test Track',
                    sound: { url: 'test.mp3' },
                },
            };

            (prisma.jamSession.findUnique as jest.Mock).mockResolvedValue(
                mockSession,
            );
            (prisma.jamSession.update as jest.Mock).mockResolvedValue(
                updatedSession,
            );

            await updateCurrentTrack(req as Request, res as Response);

            expect(prisma.jamSession.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { currentTrackId: 2 },
                include: {
                    currentTrack: {
                        include: { sound: true },
                    },
                },
            });
            expect(global.wsService.notifyTrackChange).toHaveBeenCalledWith(
                1,
                updatedSession.currentTrack,
            );
            expect(res.json).toHaveBeenCalledWith(updatedSession);
        });

        it('should return 403 when non-host tries to update track', async () => {
            req.params = { id: '1' };
            req.body = { trackId: 2 };
            req.user = { userId: 2 };

            const mockSession = {
                id: 1,
                hostId: 1,
                name: 'Test Session',
            };

            (prisma.jamSession.findUnique as jest.Mock).mockResolvedValue(
                mockSession,
            );

            await updateCurrentTrack(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Non autorisé' });
        });
    });

    describe('leaveSession', () => {
        beforeEach(() => {
            global.wsService = {
                notifySessionUpdate: jest.fn(),
            } as any;
        });

        it('should allow participant to leave session', async () => {
            req.params = { id: '1' };
            req.user = { userId: 1 };

            await leaveSession(req as Request, res as Response);

            expect(prisma.jamParticipant.delete).toHaveBeenCalledWith({
                where: {
                    userId_sessionId: {
                        userId: 1,
                        sessionId: 1,
                    },
                },
            });
            expect(global.wsService.notifySessionUpdate).toHaveBeenCalledWith(
                1,
                {
                    userId: 1,
                    type: 'LEAVE',
                },
            );
            expect(res.status).toHaveBeenCalledWith(204);
        });

        it('should handle errors during session leave', async () => {
            req.params = { id: '1' };
            req.user = { userId: 1 };

            (prisma.jamParticipant.delete as jest.Mock).mockRejectedValue(
                new Error('Leave error'),
            );

            await leaveSession(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors du départ de la session',
            });
        });
    });

    describe('updateTrackPosition', () => {
        beforeEach(() => {
            global.wsService = {
                handleTrackPositionUpdate: jest.fn(),
            } as any;
        });

        it('should update track position', async () => {
            req.params = { id: '1' };
            req.body = { position: 120.5 };
            req.user = { userId: 1 };

            const mockSession = {
                id: 1,
                hostId: 1,
                name: 'Test Session',
            };

            (prisma.jamSession.findUnique as jest.Mock).mockResolvedValue(
                mockSession,
            );

            await updateTrackPosition(req as Request, res as Response);

            expect(
                global.wsService.handleTrackPositionUpdate,
            ).toHaveBeenCalledWith(1, 120.5);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(prisma.jamSession.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { position: 120.5 },
            });
        });

        it('should handle errors during position update', async () => {
            req.params = { id: '1' };
            req.body = { position: 120.5 };

            (prisma.jamSession.findUnique as jest.Mock).mockRejectedValue(
                new Error('Update error'),
            );

            await updateTrackPosition(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de la mise à jour de la position',
            });
        });
    });

    describe('updateTrackPlayState', () => {
        beforeEach(() => {
            global.wsService = {
                handleTrackPlayPause: jest.fn(),
            } as any;
        });

        it('should update play state', async () => {
            req.params = { id: '1' };
            req.body = { isPlaying: true };
            req.user = { userId: 1 };

            const mockSession = {
                id: 1,
                hostId: 1,
                name: 'Test Session',
            };

            (prisma.jamSession.findUnique as jest.Mock).mockResolvedValue(
                mockSession,
            );

            await updateTrackPlayState(req as Request, res as Response);

            expect(global.wsService.handleTrackPlayPause).toHaveBeenCalledWith(
                1,
                true,
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(prisma.jamSession.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { isPlaying: true },
            });
        });

        it('should handle errors during play state update', async () => {
            req.params = { id: '1' };
            req.body = { isPlaying: true };

            (prisma.jamSession.findUnique as jest.Mock).mockRejectedValue(
                new Error('Update error'),
            );

            await updateTrackPlayState(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de la mise à jour du statut de lecture',
            });
        });
    });

    describe('deleteJamSession', () => {
        beforeEach(() => {
            global.wsService = {
                notifySessionUpdate: jest.fn(),
            } as any;
        });

        it('should delete session when user is host', async () => {
            req.params = { id: '1' };
            req.user = { userId: 1 };

            const mockSession = {
                id: 1,
                hostId: 1,
                name: 'Test Session',
            };

            (prisma.jamSession.findUnique as jest.Mock).mockResolvedValue(
                mockSession,
            );

            await deleteJamSession(req as Request, res as Response);

            expect(prisma.jamSession.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(global.wsService.notifySessionUpdate).toHaveBeenCalledWith(
                1,
                { type: 'SESSION_CLOSED' },
            );
            expect(res.status).toHaveBeenCalledWith(204);
        });

        it('should return 403 when non-host tries to delete session', async () => {
            req.params = { id: '1' };
            req.user = { userId: 2, isAdmin: false };

            const mockSession = {
                id: 1,
                hostId: 1,
                name: 'Test Session',
            };

            (prisma.jamSession.findUnique as jest.Mock).mockResolvedValue(
                mockSession,
            );

            await deleteJamSession(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Non autorisé' });
        });
    });
});
