import express from 'express';
import {
    createJamSession,
    deleteJamSession,
    getAllActiveSessions,
    joinSession,
    leaveSession,
    updateCurrentTrack,
    getSession,
    updateTrackPosition,
    updateTrackPlayState,
} from '../controllers/jamSession.controller';
import { jamSessionSchema } from '../schemas/jamSession.schema';
import { validateRequest } from '../middlewares/validateRequest';
import authorize from '../middlewares/authorize';
import { Permissions } from '../config/roles';
import { auditLog } from '../middlewares/auditLog';

const router = express.Router();

router.post(
    '/',
    authorize([Permissions.CREATE_JAM_SESSION]),
    validateRequest(jamSessionSchema.create, 'body'),
    /* #swagger.tags = ['JamSession']
       #swagger.description = 'Create a new jam session'
    */
    auditLog('CREATE_JAM_SESSION'),
    createJamSession,
);

router.delete(
    '/:id',
    authorize([Permissions.DELETE_JAM_SESSION]),
    validateRequest(jamSessionSchema.idParam, 'params'),
    /* #swagger.tags = ['JamSession']
       #swagger.description = 'Delete a jam session'
    */
    auditLog('DELETE_JAM_SESSION'),
    deleteJamSession,
);

router.get(
    '/',
    authorize([Permissions.READ_JAM_SESSION]),
    getAllActiveSessions,
    /* #swagger.tags = ['JamSession']
       #swagger.description = 'Get all active jam sessions'
    */
);

router.post(
    '/:id/join',
    authorize([Permissions.JOIN_JAM_SESSION]),
    validateRequest(jamSessionSchema.idParam, 'params'),
    /* #swagger.tags = ['JamSession']
       #swagger.description = 'Join a jam session'
    */
    auditLog('JOIN_JAM_SESSION'),
    joinSession,
);

router.delete(
    '/:id/leave',
    authorize([Permissions.LEAVE_JAM_SESSION]),
    validateRequest(jamSessionSchema.idParam, 'params'),
    /* #swagger.tags = ['JamSession']
       #swagger.description = 'Leave a jam session'
    */
    auditLog('LEAVE_JAM_SESSION'),
    leaveSession,
);

router.put(
    '/:id/track',
    authorize([Permissions.UPDATE_JAM_SESSION]),
    validateRequest(jamSessionSchema.updateTrack, 'body'),
    validateRequest(jamSessionSchema.idParam, 'params'),
    /* #swagger.tags = ['JamSession']
       #swagger.description = 'Update current track in session'
    */
    auditLog('UPDATE_JAM_TRACK'),
    updateCurrentTrack,
);

router.get(
    '/:id',
    authorize([Permissions.READ_JAM_SESSION]),
    validateRequest(jamSessionSchema.idParam, 'params'),
    /* #swagger.tags = ['JamSession']
       #swagger.description = 'Get a specific jam session'
    */
    getSession,
);

router.put(
    '/:id/position',
    authorize([Permissions.UPDATE_JAM_SESSION]),
    validateRequest(jamSessionSchema.trackPosition, 'body'),
    /* #swagger.tags = ['JamSession']
       #swagger.description = 'Update track position in a jam session'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
       #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: { position: { type: 'number', example: 120.5 } }
       }
    */
    updateTrackPosition,
);

router.put(
    '/:id/playstate',
    authorize([Permissions.UPDATE_JAM_SESSION]),
    validateRequest(jamSessionSchema.playState, 'body'),
    /* #swagger.tags = ['JamSession']
       #swagger.description = 'Update track play state in a jam session'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
       #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: { isPlaying: { type: 'boolean', example: true } }
       }
    */
    updateTrackPlayState,
);

export default router;
