import express from 'express';
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getCurrentUser,
    markTrackAsRead,
} from '../controllers/user.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { userSchema } from '../schemas/user.schema';
import authorize from '../middlewares/authorize';
import { Permissions } from '../config/roles';
import { auditLog } from '../middlewares/auditLog';

const router = express.Router();

router.post(
    '/',
    authorize([Permissions.CREATE_USER]),
    validateRequest(userSchema.create, 'body'),
    /* #swagger.tags = ['User']
       #swagger.description = 'Create a new user'
       #swagger.path = '/user'
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
    auditLog('CREATE_USER'),
    createUser,
);

router.get(
    '/',
    authorize([Permissions.READ_USER]),
    /* #swagger.tags = ['User']
       #swagger.description = 'Get all user'
       #swagger.path = '/user'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/userResponse' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getUsers,
);

router.get(
    '/me',
    authorize([Permissions.READ_CURRENT_USER]),
    /* #swagger.tags = ['User']
       #swagger.description = 'Get current user'
       #swagger.path = '/user/me'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/userResponse' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getCurrentUser,
);

router.get(
    '/:id',
    authorize([Permissions.READ_USER]),
    validateRequest(userSchema.idParam, 'params'),
    /* #swagger.tags = ['User']
       #swagger.description = 'Get a user by ID'
       #swagger.path = '/user/{id}'
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
    authorize([Permissions.UPDATE_USER]),
    validateRequest(userSchema.idParam, 'params'),
    validateRequest(userSchema.update, 'body'),
    /* #swagger.tags = ['User']
       #swagger.description = 'Update a user by ID'
       #swagger.path = '/user/{id}'
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
    auditLog('UPDATE_USER'),
    updateUser,
);

router.delete(
    '/:id',
    authorize([Permissions.DELETE_USER]),
    validateRequest(userSchema.idParam, 'params'),
    /* #swagger.tags = ['User']
       #swagger.description = 'Delete a user by ID'
       #swagger.path = '/user/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[204] = { schema: { $ref: '#/definitions/successResponse.204' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    auditLog('DELETE_USER'),
    deleteUser,
);

router.post(
    '/track/:trackId/read',
    authorize([Permissions.READ_TRACK]),
    /* #swagger.tags = ['Track']
       #swagger.description = 'Mark a track as read by a user'
       #swagger.path = '/user/track/{trackId}/read'
       #swagger.responses[201] = { schema: { message: 'Track marqué comme lu' } }
       #swagger.responses[404] = { schema: { error: 'Track non trouvé' } }
       #swagger.responses[500] = { schema: { error: 'Erreur lors du marquage du track comme lu' } }
    */
    markTrackAsRead,
);

export default router;
