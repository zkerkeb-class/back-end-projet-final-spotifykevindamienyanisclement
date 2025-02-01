import express from 'express';
import {
    createTrack,
    getTracks,
    getTrack,
    updateTrack,
    deleteTrack,
} from '../controllers/track.controller';

const router = express.Router({ mergeParams: true });

router.post(
    '/',
    /* #swagger.tags = ['Track']
       #swagger.description = 'Create a new track in album'
       #swagger.path = '/album/{albumId}/track'
       #swagger.parameters["body"] = {
            in: 'body',
            name: 'body',
            required: true,
            schema: { $ref: '#/definitions/trackCreate' }
       }
       #swagger.responses[201] = { schema: { $ref: '#/definitions/successResponse.201' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    createTrack,
);

router.get(
    '/',
    /* #swagger.tags = ['Track']
       #swagger.description = 'Get all tracks from an album'
       #swagger.path = '/album/{albumId}/track'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/trackRequest' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getTracks,
);

router.get(
    '/:trackId',
    /* #swagger.tags = ['Track']
       #swagger.description = 'Get a track by ID from an album'
       #swagger.path = '/album/{albumId}/track/{trackId}'
       #swagger.parameters['trackId'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/trackRequestFull' } }
       #swagger.responses[404] = { schema: { $ref: '#/definitions/errorResponse.404' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getTrack,
);

router.put(
    '/:trackId',
    /* #swagger.tags = ['Track']
       #swagger.description = 'Update a track by ID in an album'
       #swagger.path = '/album/{albumId}/track/{trackId}'
       #swagger.parameters['trackId'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.parameters["body"] = {
            in: 'body',
            name: 'body',
            required: true,
            schema: { $ref: '#/definitions/trackCreate' }
       }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/successResponse.200' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    updateTrack,
);

router.delete(
    '/:trackId',
    /* #swagger.tags = ['Track']
       #swagger.description = 'Delete a track by ID from an album'
       #swagger.path = '/album/{albumId}/track/{trackId}'
       #swagger.parameters['trackId'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[204] = { schema: { $ref: '#/definitions/successResponse.204' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    deleteTrack,
);

export default router;
