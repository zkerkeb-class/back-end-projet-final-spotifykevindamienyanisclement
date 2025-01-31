import express from 'express';
import {
    createMusicAlbum,
    getMusicAlbums,
    getMusicAlbumById,
    updateMusicAlbum,
    deleteMusicAlbum,
} from '../controllers/album.controller';

const router = express.Router();

router.post(
    '/',
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
    createMusicAlbum,
);

router.get(
    '/',
    /* #swagger.tags = ['Album']
       #swagger.description = 'Get all music albums'
       #swagger.path = '/album'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/albumResponse' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getMusicAlbums,
);

router.get(
    '/:id',
    /* #swagger.tags = ['Album']
       #swagger.description = 'Get a music album by ID'
       #swagger.path = '/album/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/albumResponse' } }
       #swagger.responses[404] = { schema: { $ref: '#/definitions/errorResponse.404' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getMusicAlbumById,
);

router.put(
    '/:id',
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
    updateMusicAlbum,
);

router.delete(
    '/:id',
    /* #swagger.tags = ['Album']
       #swagger.description = 'Delete a music album by ID'
       #swagger.path = '/album/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[204] = { schema: { $ref: '#/definitions/successResponse.204' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    deleteMusicAlbum,
);

export default router;
