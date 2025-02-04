import express from 'express';
import {
    createTrack,
    getTracks,
    getAllTracks,
    getTrack,
    updateTrack,
    deleteTrack,
} from '../controllers/track.controller';
import { trackSchema } from '../schemas/track.schema';
import { validateRequest } from '../middlewares/validateRequest';
import authorize from '../middlewares/authorize';
import { Permissions } from '../config/roles';
import { auditLog } from '../middlewares/auditLog';

const router = express.Router({ mergeParams: true });

router.post(
    '/',
    authorize([Permissions.CREATE_TRACK]),
    validateRequest(trackSchema.albumIdParam, 'params'),
    validateRequest(trackSchema.create, 'body'),
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
    auditLog('CREATE_TRACK'),
    createTrack,
);

router.get(
    '/',
    authorize([Permissions.READ_TRACK]),
    validateRequest(trackSchema.albumIdParam, 'params'),
    /* #swagger.tags = ['Track']
       #swagger.description = 'Get all tracks from an album'
       #swagger.path = '/album/{albumId}/track'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/trackRequest' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getTracks,
);

router.get(
    '/all',
    /* #swagger.tags = ['Track']
       #swagger.description = 'Get all tracks'
       #swagger.path = '/album/{albumId}/track/all'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/trackRequest' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getAllTracks,
);

router.get(
    '/:trackId',
    authorize([Permissions.READ_TRACK]),
    validateRequest(trackSchema.trackIdParam, 'params'),
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
    authorize([Permissions.UPDATE_TRACK]),
    validateRequest(trackSchema.trackIdParam, 'params'),
    validateRequest(trackSchema.update, 'body'),
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
    auditLog('UPDATE_TRACK'),
    updateTrack,
);

router.delete(
    '/:trackId',
    authorize([Permissions.DELETE_TRACK]),
    validateRequest(trackSchema.trackIdParam, 'params'),
    /* #swagger.tags = ['Track']
       #swagger.description = 'Delete a track by ID from an album'
       #swagger.path = '/album/{albumId}/track/{trackId}'
       #swagger.parameters['trackId'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[204] = { schema: { $ref: '#/definitions/successResponse.204' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    auditLog('DELETE_TRACK'),
    deleteTrack,
);

const getAllTracksRouter = express.Router();

getAllTracksRouter.get(
    '/',
    /* #swagger.tags = ['Track']
       #swagger.description = 'Get all tracks'
       #swagger.path = '/tracks'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/trackRequest' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getAllTracks,
);

export { getAllTracksRouter as default, router };
