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
import logger from './logger';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

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
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

app.use('/', indexRouter);

// -------------- swagger documentation

app.use(
    '/api-docs',
    swaggerUIPath.serve,
    swaggerUIPath.setup(swaggerjsonFilePath),
);

// -------------- catch 404 and forward to error handler

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// -------------- start the server

app.listen(PORT, () => {
    console.log('Server is running on address: http://localhost:' + PORT);
    console.log(
        'API documentation is running on address: http://localhost:' +
            PORT +
            '/api-docs',
    );
}).on('error', (error: any) => {
    // gracefully handle error
    throw new Error(error.message);
});

module.exports = app;
export default app;
