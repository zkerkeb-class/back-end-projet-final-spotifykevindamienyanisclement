import express from 'express';
import {
    createAlbum,
    getAlbums,
    getAlbumById,
    updateAlbum,
    deleteAlbum,
} from '../controllers/album.controller';
import { albumSchema } from '../schemas/album.schema';
import { validateRequest } from '../middlewares/validateRequest';
import { auditLog } from '../middlewares/auditLog';
import authorize from '../middlewares/authorize';
import { Permissions } from '../config/roles';

const router = express.Router();

router.post(
    '/',
    authorize([Permissions.CREATE_ALBUM]),
    validateRequest(albumSchema.create, 'body'),
    /* #swagger.tags = ['Album']
       #swagger.description = 'Create a new music album'
       #swagger.path = '/album'
       #swagger.parameters["body"] = {
            in: 'body',
            name: 'body',
            required: true,
            schema: { $ref: '#/definitions/albumCreate' }
       }
       #swagger.responses[201] = { schema: { $ref: '#/definitions/successResponse.201' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    auditLog('CREATE_ALBUM'),
    createAlbum,
);

router.get(
    '/',
    authorize([Permissions.READ_ALBUM]),
    /* #swagger.tags = ['Album']
       #swagger.description = 'Get all music albums'
       #swagger.path = '/album'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/albumResponse' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getAlbums,
);

router.get(
    '/:id',
    authorize([Permissions.READ_ALBUM]),
    validateRequest(albumSchema.idParam, 'params'),
    /* #swagger.tags = ['Album']
       #swagger.description = 'Get a music album by ID'
       #swagger.path = '/album/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/albumResponse' } }
       #swagger.responses[404] = { schema: { $ref: '#/definitions/errorResponse.404' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getAlbumById,
);

router.put(
    '/:id',
    authorize([Permissions.UPDATE_ALBUM]),
    validateRequest(albumSchema.idParam, 'params'),
    validateRequest(albumSchema.update, 'body'),
    /* #swagger.tags = ['Album']
       #swagger.description = 'Update a music album by ID'
       #swagger.path = '/album/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.parameters["body"] = {
            in: 'body',
            name: 'body',
            required: true,
            schema: { $ref: '#/definitions/albumCreate' }
       }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/successResponse.200' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    auditLog('UPDATE_ALBUM'),
    updateAlbum,
);

router.delete(
    '/:id',
    authorize([Permissions.DELETE_ALBUM]),
    validateRequest(albumSchema.idParam, 'params'),
    /* #swagger.tags = ['Album']
       #swagger.description = 'Delete a music album by ID'
       #swagger.path = '/album/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[204] = { schema: { $ref: '#/definitions/successResponse.204' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    auditLog('DELETE_ALBUM'),
    deleteAlbum,
);

export default router;
