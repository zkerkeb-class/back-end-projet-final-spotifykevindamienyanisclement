import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../config/logger';

const prisma = new PrismaClient();

interface AuditLogData {
    userId: number;
    action: string;
    resource: string;
    resourceId?: number;
    details: string;
    ipAddress: string;
}

export const auditLog = (action: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const originalSend = res.json;
            res.json = function (body) {
                res.locals.responseBody = body;
                return originalSend.call(this, body);
            };
            // Attendre que la requête soit traitée
            await next();

            // Ne logger que si la requête est réussie
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const userId = (req as any).user?.userId;
                if (!userId) return;

                const auditData: AuditLogData = {
                    userId,
                    action,
                    resource: req.baseUrl.split('/')[1],
                    resourceId: parseInt(req.params.id),
                    details: JSON.stringify({
                        method: req.method,
                        path: req.path,
                        body: req.body,
                        response: res.locals.responseBody,
                    }),
                    ipAddress: req.ip || req.socket.remoteAddress || '',
                };

                await prisma.auditLog.create({
                    data: auditData,
                });

                logger.info(
                    {
                        audit: auditData,
                        user: userId,
                    },
                    `Audit: ${action}`,
                );
            }
        } catch (error) {
            logger.error(
                {
                    error,
                    action,
                    user: (req as any).user?.id,
                    path: req.path,
                },
                'Error logging audit',
            );
            next(error);
        }
    };
};
