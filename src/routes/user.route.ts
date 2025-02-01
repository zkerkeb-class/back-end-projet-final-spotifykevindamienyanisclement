import express from 'express';
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} from '../controllers/user.controller';

const router = express.Router();

router.post(
    '/',
    /* #swagger.tags = ['User']
       #swagger.description = 'Create a new user'
       #swagger.path = '/users'
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
    createUser,
);

router.get(
    '/',
    /* #swagger.tags = ['User']
       #swagger.description = 'Get all users'
       #swagger.path = '/users'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/userResponse' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getUsers,
);

router.get(
    '/:id',
    /* #swagger.tags = ['User']
       #swagger.description = 'Get a user by ID'
       #swagger.path = '/users/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/userResponseFull' } }
        #swagger.responses[400] = { schema: { $ref: '#/definitions/errorResponse.400' } }
       #swagger.responses[404] = { schema: { $ref: '#/definitions/errorResponse.404' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getUserById,
);

router.put(
    '/:id',
    /* #swagger.tags = ['User']
       #swagger.description = 'Update a user by ID'
       #swagger.path = '/users/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
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
       #swagger.responses[200] = { schema: { $ref: '#/definitions/userResponse' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    updateUser,
);

router.delete(
    '/:id',
    /* #swagger.tags = ['User']
       #swagger.description = 'Delete a user by ID'
       #swagger.path = '/users/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[204] = { schema: { $ref: '#/definitions/successResponse.204' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    deleteUser,
);

export default router;
