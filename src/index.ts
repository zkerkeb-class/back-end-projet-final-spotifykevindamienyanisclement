import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import createError from 'http-errors';
import path from 'path';
import dotenv from 'dotenv';
import swaggerUIPath from 'swagger-ui-express';
import swaggerjsonFilePath from '../docs/swagger.json';
import indexRouter from './routes/index';
import sessionMiddleware from './middlewares/session';
import fileCacheMiddleware from './middlewares/fileCache';
import cacheMiddleware from './middlewares/cache';
import logger from './config/logger';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import performanceMiddleware from './middlewares/performance';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// -------------- Configuring Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: process.env.RATE_LIMIT_MAX
        ? parseInt(process.env.RATE_LIMIT_MAX)
        : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Trop de requêtes, veuillez réessayer plus tard.',
    },
});

// Appliquer le rate limiting à toutes les requêtes
app.use(limiter);

// Rate limiting spécifique pour les routes d'authentification
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    limit: process.env.RATE_LIMIT_AUTH_MAX
        ? parseInt(process.env.RATE_LIMIT_AUTH_MAX)
        : 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message:
            'Trop de tentatives de connexion, veuillez réessayer dans une heure.',
    },
});

// Appliquer le rate limiting spécifique aux routes d'authentification
app.use('/auth', authLimiter);

// -------------- Configuring the Helmet
// Ajout de Helmet avant les autres middlewares pour une meilleure sécurité
app.use(helmet());

// Configuration spécifique pour permettre l'affichage correct de Swagger UI
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    }),
);

// ------------- Configuring the CORS
const corsList = process.env.CORS_ORIGIN?.split(',');

app.use(
    cors({
        origin: corsList,
        credentials: true,
    }),
);

// -------------- view engine setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessionMiddleware);

if (process.env.INSTALL_REDIS === 'true') {
    app.use(fileCacheMiddleware);
    app.use(cacheMiddleware);
}

// -------------- Logging Middleware
app.use(performanceMiddleware);

// get all files in the uploads folder
app.use('/uploads', express.static('uploads'));

// -------------- swagger documentation

app.use(
    '/api-docs',
    swaggerUIPath.serve,
    swaggerUIPath.setup(swaggerjsonFilePath),
);

// -------------- routes
app.use('/', indexRouter);

// -------------- catch 404 and forward to error handler

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response) {
    logger.error(
        {
            err: {
                message: err.message,
                stack: err.stack,
                status: err.status,
            },
            req: {
                method: req.method,
                url: req.url,
                ip: req.ip,
            },
        },
        'Une erreur est survenue',
    );

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

// -------------- start the server

app.listen(PORT, () => {
    logger.info(`Server is running on address: http://localhost:${PORT}`);
    logger.info(
        `API documentation is running on address: http://localhost:${PORT}/api-docs`,
    );
}).on('error', (error: any) => {
    logger.fatal(error, 'Server failed to start');
    process.exit(1);
});

module.exports = app;
export default app;
