import express from 'express';
import {
    createPlaylist,
    getPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    getLastListenedTracks,
    getMostListenedTracks,
} from '../controllers/playlist.controller';
import { playlistSchema } from '../schemas/playlist.schema';
import { validateRequest } from '../middlewares/validateRequest';
import authorize from '../middlewares/authorize';
import { Permissions } from '../config/roles';

const router = express.Router();

router.post(
    '/',
    authorize([Permissions.CREATE_PLAYLIST]),
    validateRequest(playlistSchema.create, 'body'),
    /* #swagger.tags = ['Playlist']
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
    createPlaylist,
);

router.get(
    '/',
    authorize([Permissions.READ_PLAYLIST]),
    getPlaylists,
    /* #swagger.tags = ['Playlist']
       #swagger.description = 'Get all playlist musics'
       #swagger.path = '/playlist'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/playlistRequest' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
);

router.get(
    '/last-listened',
    authorize([Permissions.READ_TRACK]),
    /* #swagger.tags = ['Playlist']
       #swagger.description = 'Get the last 20 listened tracks'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/trackRequest' } }
       #swagger.responses[500] = { schema: { error: 'Erreur lors de la récupération des derniers titres écoutés' } }
    */
    getLastListenedTracks,
);

router.get(
    '/most-listened',
    authorize([Permissions.READ_TRACK]),
    /* #swagger.tags = ['Playlist']
       #swagger.description = 'Get the top 20 most listened tracks'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/trackRequest' } }
       #swagger.responses[500] = { schema: { error: 'Erreur lors de la récupération des titres les plus écoutés' } }
    */
    getMostListenedTracks,
);

router.get(
    '/:id',
    authorize([Permissions.READ_PLAYLIST]),
    validateRequest(playlistSchema.idParam, 'params'),
    /* #swagger.tags = ['Playlist']
       #swagger.description = 'Get a playlist music by ID'
       #swagger.path = '/playlist/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/playlistRequestFull' } }
       #swagger.responses[404] = { schema: { $ref: '#/definitions/errorResponse.404' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getPlaylistById,
);

router.put(
    '/:id',
    authorize([Permissions.UPDATE_PLAYLIST]),
    validateRequest(playlistSchema.idParam, 'params'),
    validateRequest(playlistSchema.update, 'body'),
    /* #swagger.tags = ['Playlist']
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
    updatePlaylist,
);

router.delete(
    '/:id',
    authorize([Permissions.DELETE_PLAYLIST]),
    validateRequest(playlistSchema.idParam, 'params'),
    /* #swagger.tags = ['Playlist']
       #swagger.description = 'Delete a playlist music by ID'
       #swagger.path = '/playlist/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[204] = { schema: { $ref: '#/definitions/successResponse.204' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    deletePlaylist,
);

router.post(
    '/:id/tracks',
    authorize([Permissions.UPDATE_PLAYLIST]),
    validateRequest(playlistSchema.idParam, 'params'),
    validateRequest(playlistSchema.addTrack, 'body'),
    addTrackToPlaylist,
);

router.delete(
    '/:id/tracks/:trackId',
    authorize([Permissions.UPDATE_PLAYLIST]),
    validateRequest(playlistSchema.trackIdParam, 'params'),
    deletePlaylist,
);

export default router;
