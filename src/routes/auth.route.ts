import express, { Request, Response } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = express.Router();

router.post(
    '/register',
    /* #swagger.tags = ['Auth']
       #swagger.description = 'Register a new user'
       #swagger.path = '/auth/register'
       #swagger.body = {
           required: true,
           content: {
               'application/json': {
                   schema: {
                       type: 'object',
                       properties: {
                           email: { type: 'string', example: 'user@example.com' },
                           password: { type: 'string', example: 'password123' },
                           name: { type: 'string', example: 'John Doe' }
                       }
                   }
               }
           }
       }
       #swagger.responses[201] = { schema: { $ref: '#/definitions/successResponse.201' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    (req: Request, res: Response) => {
        register(req, res);
    },
);

router.post(
    '/login',
    /* #swagger.tags = ['Auth']
       #swagger.description = 'Login a user'
       #swagger.path = '/auth/login'
       #swagger.body = {
           required: true,
           content: {
               'application/json': {
                   schema: {
                       type: 'object',
                       properties: {
                           email: { type: 'string', example: 'user@example.com' },
                           password: { type: 'string', example: 'password123' }
                       }
                   }
               }
           }
       }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/successResponse.200' } }
       #swagger.responses[401] = { schema: { $ref: '#/definitions/errorResponse.401' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    (req: Request, res: Response) => {
        login(req, res);
    },
);

router.get(
    '/',
    /* #swagger.tags = ['Auth']
       #swagger.description = 'Get auth resource'
       #swagger.path = '/auth'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/successResponse.200' } }
    */
    (req: Request, res: Response) => {
        res.send('respond with a resource');
    },
);

export default router;
