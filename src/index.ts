import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const createError = require('http-errors');
const path = require('path');

const indexRouter = require('./routes/index');
const dotenv = require('dotenv');
const swaggerUIPath = require('swagger-ui-express');
const swaggerjsonFilePath = require('../docs/swagger.json');

const router = require('./routes/index.ts');

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const prisma = new PrismaClient();

app.use(router);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.listen(PORT, () => {
    console.log('Server running at PORT: ', PORT);
});

app.use('/', indexRouter);
app.use(
    '/api-docs',
    swaggerUIPath.serve,
    swaggerUIPath.setup(swaggerjsonFilePath),
);

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

export {};

module.exports = app;
