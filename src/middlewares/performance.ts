import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

interface PerformanceMetrics {
    requestCount: number;
    responseTimeTotal: number;
    statusCodes: { [key: string]: number };
    endpoints: { [key: string]: { count: number; totalTime: number } };
}

const metrics: PerformanceMetrics = {
    requestCount: 0,
    responseTimeTotal: 0,
    statusCodes: {},
    endpoints: {},
};

// Fonction pour calculer les moyennes
const calculateAverages = () => {
    const averages: { [key: string]: number } = {};

    Object.entries(metrics.endpoints).forEach(([endpoint, data]) => {
        averages[endpoint] = data.totalTime / data.count;
    });

    return averages;
};

// Middleware de monitoring
const performanceMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const start = process.hrtime();
    const startTime = Date.now();

    // Incrémenter le compteur de requêtes
    metrics.requestCount++;

    // Enregistrer les métriques à la fin de la requête
    res.on('finish', () => {
        const diff = process.hrtime(start);
        const time = diff[0] * 1e3 + diff[1] * 1e-6; // Convertir en millisecondes
        const duration = Date.now() - startTime;

        // Mettre à jour les métriques
        metrics.responseTimeTotal += time;
        metrics.statusCodes[res.statusCode] =
            (metrics.statusCodes[res.statusCode] || 0) + 1;

        const endpoint = `${req.method} ${req.route?.path || req.path}`;
        if (!metrics.endpoints[endpoint]) {
            metrics.endpoints[endpoint] = { count: 0, totalTime: 0 };
        }
        metrics.endpoints[endpoint].count++;
        metrics.endpoints[endpoint].totalTime += time;

        // Logger les informations de performance
        const memoryUsage = process.memoryUsage();
        logger.info(
            {
                performance: {
                    method: req.method,
                    url: req.url,
                    endpoint,
                    status: res.statusCode,
                    duration: `${duration}ms`,
                    responseTime: `${time.toFixed(2)}ms`,
                    averageResponseTime: `${(metrics.responseTimeTotal / metrics.requestCount).toFixed(2)}ms`,
                    totalRequests: metrics.requestCount,
                    statusCodeDistribution: metrics.statusCodes,
                    endpointAverages: calculateAverages(),
                    memory: {
                        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
                    },
                },
                request: {
                    ip: req.ip,
                    userAgent: req.get('user-agent'),
                },
            },
            `Performance metrics for ${req.method} ${req.url}`,
        );

        const RESPONSE_TIME_THRESHOLD = 1000; // 1 seconde

        if (time > RESPONSE_TIME_THRESHOLD) {
            logger.warn(
                {
                    performance: {
                        responseTime: time,
                        endpoint,
                        threshold: RESPONSE_TIME_THRESHOLD,
                    },
                },
                `Slow response detected on ${endpoint}`,
            );
        }
    });

    next();
};

export default performanceMiddleware;
