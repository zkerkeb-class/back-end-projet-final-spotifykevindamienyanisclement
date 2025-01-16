import express from 'express';
import {
    createArtist,
    getArtists,
    getArtistById,
    updateArtist,
    deleteArtist,
} from '../controllers/artist.controller';

const router = express.Router();

router.post(
    '/',
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
    createArtist,
);

router.get(
    '/',
    /* #swagger.tags = ['Artist']
       #swagger.description = 'Get all artists'
       #swagger.path = '/artist'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/artistResponse' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getArtists,
);

router.get(
    '/:id',
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
    updateArtist,
);

router.delete(
    '/:id',
    /* #swagger.tags = ['Artist']
       #swagger.description = 'Delete an artist by ID'
       #swagger.path = '/artist/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[204] = { schema: { $ref: '#/definitions/successResponse.204' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    deleteArtist,
);

export default router;
