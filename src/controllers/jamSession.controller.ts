import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import {
    IJamSessionCreate,
    IJamSession,
    IJamSessionFull,
} from '../types/interfaces/jamSession.interface';
import { WebSocketMessage } from '../types/interfaces/websocket.interface';
import logger from '../config/logger';

const prisma = new PrismaClient();

export const createJamSession = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { name } = req.body;
        const hostId = req.user.userId;

        const jamSessionData: IJamSessionCreate = {
            name,
            hostId,
        };

        const jamSession: IJamSessionFull = await prisma.jamSession.create({
            data: {
                ...jamSessionData,
                participants: {
                    create: {
                        userId: hostId,
                    },
                },
            },
            include: {
                host: true,
                currentTrack: {
                    include: {
                        sound: true,
                    },
                },
                participants: {
                    include: {
                        user: true,
                        session: true,
                    },
                },
            },
        });

        const message: WebSocketMessage = {
            type: 'SESSION_CREATED',
            sessionId: jamSession.id,
            data: {
                sessionId: jamSession.id,
            },
        };
        global.wsService.notifySessionUpdate(jamSession.id, message);
        res.status(201).json(jamSession);
    } catch (error) {
        logger.error('Erreur lors de la création de la session Jam:', error);
        res.status(500).json({
            error: 'Erreur lors de la création de la session Jam',
        });
    }
};

export const deleteJamSession = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const isAdmin = req.user.isAdmin;

        const session = await prisma.jamSession.findUnique({
            where: { id: parseInt(id) },
        });

        if (!session) {
            res.status(404).json({ error: 'Session non trouvée' });
            return;
        }

        if (session.hostId !== userId && !isAdmin) {
            res.status(403).json({ error: 'Non autorisé' });
            return;
        }

        await prisma.jamSession.delete({
            where: { id: parseInt(id) },
        });

        const message: WebSocketMessage = {
            type: 'SESSION_CLOSED',
            sessionId: parseInt(id),
            data: { sessionId: parseInt(id) },
        };
        global.wsService.notifySessionUpdate(parseInt(id), message);
        res.status(204).send();
    } catch (error) {
        logger.error('Erreur lors de la suppression de la session Jam:', error);
        res.status(500).json({
            error: 'Erreur lors de la suppression de la session Jam',
        });
    }
};

export const updateCurrentTrack = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const { trackId } = req.body;
        const userId = req.user.userId;

        const session = await prisma.jamSession.findUnique({
            where: { id: parseInt(id) },
            include: { participants: true },
        });

        if (!session) {
            res.status(404).json({ error: 'Session non trouvée' });
            return;
        }

        const isParticipant = session.participants.some(
            (p) => p.userId === userId,
        );
        if (!isParticipant) {
            res.status(403).json({ error: 'Non autorisé' });
            return;
        }

        const track = await prisma.track.findUnique({
            where: { id: trackId },
        });

        if (!track) {
            res.status(404).json({ error: 'Morceau non trouvé' });
            return;
        }

        const updatedSession = await prisma.jamSession.update({
            where: { id: parseInt(id) },
            data: { currentTrackId: trackId },
            include: {
                currentTrack: {
                    include: {
                        sound: true,
                    },
                },
            },
        });

        const message: WebSocketMessage = {
            type: 'TRACK_CHANGE',
            sessionId: parseInt(id),
            data: {
                trackId: updatedSession.currentTrackId ?? undefined,
                track: updatedSession.currentTrack,
            },
        };
        global.wsService.notifyTrackChange(parseInt(id), message);
        res.status(200).json(updatedSession);
    } catch (error) {
        logger.error('Erreur lors de la mise à jour du morceau:', error);
        res.status(500).json({
            error: 'Erreur lors de la mise à jour du morceau',
        });
    }
};

export const getSession = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;

        const session = await prisma.jamSession.findUnique({
            where: { id: parseInt(id) },
            include: {
                host: true,
                currentTrack: {
                    include: {
                        sound: true,
                    },
                },
                participants: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!session) {
            res.status(404).json({ error: 'Session non trouvée' });
            return;
        }

        res.status(200).json(session);
    } catch (error) {
        logger.error('Erreur lors de la récupération de la session:', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération de la session',
        });
    }
};

export const joinSession = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const existingParticipant = await prisma.jamParticipant.findUnique({
            where: {
                userId_sessionId: {
                    userId,
                    sessionId: parseInt(id),
                },
            },
        });

        if (existingParticipant) {
            res.status(400).json({ error: 'Déjà participant à cette session' });
            return;
        }

        const session = await prisma.jamParticipant.create({
            data: {
                userId,
                sessionId: parseInt(id),
            },
            include: {
                session: {
                    include: {
                        host: true,
                        currentTrack: {
                            include: {
                                sound: true,
                            },
                        },
                        participants: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        const message: WebSocketMessage = {
            type: 'PARTICIPANT_JOIN',
            sessionId: parseInt(id),
            data: {
                userId: userId,
                participant: session,
            },
        };
        global.wsService.notifySessionUpdate(parseInt(id), message);
        res.status(201).json(session);
    } catch (error) {
        logger.error('Erreur lors de la jointure de la session:', error);
        res.status(500).json({
            error: 'Erreur lors de la jointure de la session',
        });
    }
};

export const leaveSession = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        await prisma.jamParticipant.delete({
            where: {
                userId_sessionId: {
                    userId,
                    sessionId: parseInt(id),
                },
            },
        });

        const message: WebSocketMessage = {
            type: 'PARTICIPANT_LEAVE',
            sessionId: parseInt(id),
            data: { userId },
        };
        global.wsService.notifySessionUpdate(parseInt(id), message);
        res.status(204).send();
    } catch (error) {
        logger.error('Erreur lors du départ de la session:', error);
        res.status(500).json({ error: 'Erreur lors du départ de la session' });
    }
};

export const getAllActiveSessions = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const sessions = await prisma.jamSession.findMany({
            where: {
                isActive: true,
            },
            include: {
                host: true,
                currentTrack: {
                    include: {
                        sound: true,
                    },
                },
                participants: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        res.status(200).json(sessions);
    } catch (error) {
        logger.error('Erreur lors de la récupération des sessions:', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des sessions',
        });
    }
};

export const updateTrackPosition = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const { position } = req.body;
        const userId = req.user.userId;

        const session = await prisma.jamSession.findUnique({
            where: { id: parseInt(id) },
            include: { participants: true },
        });

        if (!session) {
            res.status(404).json({ error: 'Session non trouvée' });
            return;
        }

        const isParticipant = session.participants.some(
            (p) => p.userId === userId,
        );
        if (!isParticipant) {
            res.status(403).json({ error: 'Non autorisé' });
            return;
        }

        await prisma.jamSession.update({
            where: { id: parseInt(id) },
            data: { position },
        });

        const message: WebSocketMessage = {
            type: 'TRACK_POSITION',
            sessionId: parseInt(id),
            data: { position },
        };
        global.wsService.handleTrackPositionUpdate(parseInt(id), message);
        res.status(200).send();
    } catch (error) {
        logger.error('Erreur lors de la mise à jour de la position:', error);
        res.status(500).json({
            error: 'Erreur lors de la mise à jour de la position',
        });
    }
};

export const updateTrackPlayState = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const { isPlaying } = req.body;
        const userId = req.user.userId;

        const session = await prisma.jamSession.findUnique({
            where: { id: parseInt(id) },
            include: { participants: true },
        });

        if (!session) {
            res.status(404).json({ error: 'Session non trouvée' });
            return;
        }

        const isParticipant = session.participants.some(
            (p) => p.userId === userId,
        );
        if (!isParticipant) {
            res.status(403).json({ error: 'Non autorisé' });
            return;
        }

        await prisma.jamSession.update({
            where: { id: parseInt(id) },
            data: { isPlaying },
        });

        const message: WebSocketMessage = {
            type: 'TRACK_PLAY_STATE',
            sessionId: parseInt(id),
            data: { isPlaying },
        };
        global.wsService.handleTrackPlayPause(parseInt(id), message);
        res.status(200).send();
    } catch (error) {
        logger.error(
            'Erreur lors de la mise à jour du statut de lecture:',
            error,
        );
        res.status(500).json({
            error: 'Erreur lors de la mise à jour du statut de lecture',
        });
    }
};
