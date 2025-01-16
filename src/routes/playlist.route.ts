import express from 'express';
import {
    createPlaylistMusic,
    getPlaylistMusics,
    getPlaylistMusicById,
    updatePlaylistMusic,
    deletePlaylistMusic,
} from '../controllers/playlist.controller';

const router = express.Router();

router.post(
    '/',
    /* #swagger.tags = ['PlaylistMusic']
       #swagger.description = 'Create a new playlist music'
       #swagger.path = '/playlist'
       #swagger.parameters["body"] = {
            in: 'body',
            name: 'body',
            required: true,
            schema: { $ref: '#/definitions/playlistCreate' }
       }
       #swagger.responses[201] = { schema: { $ref: '#/definitions/successResponse.201' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    createPlaylistMusic,
);

router.get(
    '/',
    /* #swagger.tags = ['PlaylistMusic']
       #swagger.description = 'Get all playlist musics'
       #swagger.path = '/playlist'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/playlistRequest' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getPlaylistMusics,
);

router.get(
    '/:id',
    /* #swagger.tags = ['PlaylistMusic']
       #swagger.description = 'Get a playlist music by ID'
       #swagger.path = '/playlist/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/playlistRequestFull' } }
       #swagger.responses[404] = { schema: { $ref: '#/definitions/errorResponse.404' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getPlaylistMusicById,
);

router.put(
    '/:id',
    /* #swagger.tags = ['PlaylistMusic']
       #swagger.description = 'Update a playlist music by ID'
       #swagger.path = '/playlist/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
        #swagger.parameters["body"] = {
            in: 'body',
            name: 'body',
            required: true,
            schema: { $ref: '#/definitions/playlistCreate' }
       }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/successResponse.200' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    updatePlaylistMusic,
);

router.delete(
    '/:id',
    /* #swagger.tags = ['PlaylistMusic']
       #swagger.description = 'Delete a playlist music by ID'
       #swagger.path = '/playlist/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[204] = { schema: { $ref: '#/definitions/successResponse.204' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    deletePlaylistMusic,
);

export default router;
