import express from 'express';
import {
    createArtist,
    getArtists,
    getArtistById,
    updateArtist,
    deleteArtist,
} from '../controllers/artist.controller';
import { artistSchema } from '../schemas/artist.schema';
import { validateRequest } from '../middlewares/validateRequest';
import authorize from '../middlewares/authorize';
import { Permissions } from '../config/roles';
import { auditLog } from '../middlewares/auditLog';

const router = express.Router();

router.post(
    '/',
    authorize([Permissions.CREATE_ARTIST]),
    validateRequest(artistSchema.create, 'body'),
    /* #swagger.tags = ['Artist']
       #swagger.description = 'Create a new artist'
       #swagger.path = '/artist'
       #swagger.parameters["body"] = {
            in: 'body',
            name: 'body',
            required: true,
            schema: { $ref: '#/definitions/artistCreate' }
       }
       #swagger.responses[201] = { schema: { $ref: '#/definitions/successResponse.201' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    auditLog('CREATE_ARTIST'),

    createArtist,
);

router.get(
    '/',
    authorize([Permissions.READ_ARTIST]),
    /* #swagger.tags = ['Artist']
       #swagger.description = 'Get all artists with pagination'
       #swagger.path = '/artist'
       #swagger.parameters['limit'] = {
           in: 'query',
           required: false,
           type: 'integer',
           description: 'Number of artists to return',
           example: 10
       }
       #swagger.parameters['offset'] = {
           in: 'query',
           required: false,
           type: 'integer',
           description: 'Number of artists to skip',
           example: 0
       }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/artistResponse' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getArtists,
);

router.get(
    '/:id',
    authorize([Permissions.READ_ARTIST]),
    validateRequest(artistSchema.idParam, 'params'),
    /* #swagger.tags = ['Artist']
       #swagger.description = 'Get an artist by ID'
       #swagger.path = '/artist/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/artistResponseFull' } }
       #swagger.responses[404] = { schema: { $ref: '#/definitions/errorResponse.404' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getArtistById,
);

router.put(
    '/:id',
    authorize([Permissions.UPDATE_ARTIST]),
    validateRequest(artistSchema.idParam, 'params'),
    validateRequest(artistSchema.update, 'body'),
    /* #swagger.tags = ['Artist']
       #swagger.description = 'Update an artist by ID'
       #swagger.path = '/artist/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.parameters["body"] = {
            in: 'body',
            name: 'body',
            required: true,
            schema: { $ref: '#/definitions/artistCreate' }
       }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/successResponse.200' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    auditLog('UPDATE_ARTIST'),
    updateArtist,
);

router.delete(
    '/:id',
    authorize([Permissions.DELETE_ARTIST]),
    validateRequest(artistSchema.idParam, 'params'),
    /* #swagger.tags = ['Artist']
       #swagger.description = 'Delete an artist by ID'
       #swagger.path = '/artist/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[204] = { schema: { $ref: '#/definitions/successResponse.204' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    auditLog('DELETE_ARTIST'),
    deleteArtist,
);

export default router;
