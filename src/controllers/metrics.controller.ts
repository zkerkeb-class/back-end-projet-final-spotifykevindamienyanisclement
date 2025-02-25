import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Contrôleur pour les données métier
export const getBusinessData = async (req: Request, res: Response) => {
    try {
        // Récupérer le nombre de jours à partir des paramètres de requête, par défaut 30
        const days = parseInt(req.query.days as string) || 30;

        // Récupérer le nombre de streams par jour pour les `days` derniers jours
        const streams = await prisma.trackRead.groupBy({
            by: ['createdAt'],
            _count: {
                id: true,
            },
            where: {
                createdAt: {
                    gte: new Date(
                        new Date().setDate(new Date().getDate() - days),
                    ),
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        // Formater les données pour renvoyer un tableau avec le nombre de streams par jour
        const formattedStreams = streams.reduce((acc: any, stream) => {
            const date = stream.createdAt.toISOString().split('T')[0];
            const existingEntry: any = acc.find(
                (entry: any) => entry?.date === date,
            );
            if (existingEntry) {
                existingEntry.count += stream._count.id;
            } else {
                acc.push({ date, count: stream._count.id });
            }
            return acc;
        }, []);

        // Récupérer le nombre d'utilisateurs actifs par jour pour les `days` derniers jours
        const activeUsers = await prisma.trackRead.groupBy({
            by: ['createdAt', 'userId'],
            where: {
                createdAt: {
                    gte: new Date(
                        new Date().setDate(new Date().getDate() - days),
                    ),
                },
            },
        });

        // Formater les données pour renvoyer un tableau avec le nombre d'utilisateurs actifs par jour
        const formattedActiveUsers = activeUsers.reduce((acc: any, user) => {
            const date = user.createdAt.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = new Set();
            }
            acc[date].add(user.userId);
            return acc;
        }, {});

        const activeUsersCount = Object.entries(formattedActiveUsers).map(
            ([date, users]) => ({
                date,
                count: (users as Set<number>).size,
            }),
        );

        const businessData = {
            streams: formattedStreams,
            activeUsers: activeUsersCount,
        };

        res.json(businessData);
    } catch (error) {
        res.status(500).json({
            error: 'Erreur lors de la récupération des données métier',
        });
    }
};

// Contrôleur pour les données de performance du système
export const getSystemPerformanceData = async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30;
    const sinceDate = new Date(new Date().setDate(new Date().getDate() - days));

    try {
        const performanceMetrics = await prisma.performanceMetric.findMany({
            where: {
                createdAt: {
                    gte: sinceDate,
                },
            },
        });

        res.json(performanceMetrics);
    } catch (error) {
        res.status(500).json({
            error: 'Erreur lors de la récupération des données de performance du système',
        });
    }
};

// Contrôleur pour la moyenne de performance par endpoint
export const getAveragePerformanceByEndpoint = async (
    req: Request,
    res: Response,
) => {
    try {
        const averagePerformance = await prisma.performanceMetric.groupBy({
            by: ['endpoint'],
            _avg: {
                duration: true,
                responseTime: true,
                heapUsed: true,
                heapTotal: true,
                rss: true,
                cpu: true,
                bandwidth: true,
            },
            _count: {
                endpoint: true,
            },
        });

        res.json(averagePerformance);
    } catch (error) {
        res.status(500).json({
            error: 'Erreur lors de la récupération de la moyenne de performance par endpoint',
        });
    }
};
