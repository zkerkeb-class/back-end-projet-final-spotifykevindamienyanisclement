import express from 'express';
import {
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    addArtistToGroup,
    removeArtistFromGroup,
} from '../controllers/group.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { groupSchema } from '../schemas/group.schema';
import authorize from '../middlewares/authorize';
import { Permissions } from '../config/roles';
import { auditLog } from '../middlewares/auditLog';

const router = express.Router();

router.post(
    '/',
    authorize([Permissions.CREATE_GROUP]),
    validateRequest(groupSchema.createGroup, 'body'),
    /* #swagger.tags = ['Group']
       #swagger.description = 'Create a new artist group'
       #swagger.path = '/group'
       #swagger.parameters["body"] = {
            in: 'body',
            name: 'body',
            required: true,
            schema: { $ref: '#/definitions/groupCreate' }
       }
       #swagger.responses[201] = { schema: { $ref: '#/definitions/successResponse.201' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    auditLog('CREATE_GROUP'),
    createGroup,
);

router.get(
    '/',
    authorize([Permissions.READ_GROUP]),
    /* #swagger.tags = ['Group']
       #swagger.description = 'Get all artist groups'
       #swagger.path = '/group'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/groupResponse' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getGroups,
);

router.get(
    '/:id',
    authorize([Permissions.READ_GROUP]),
    validateRequest(groupSchema.idParam, 'params'),
    /* #swagger.tags = ['Group']
       #swagger.description = 'Get an artist group by ID'
       #swagger.path = '/group/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/groupResponseFull' } }
       #swagger.responses[404] = { schema: { $ref: '#/definitions/errorResponse.404' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getGroupById,
);

router.put(
    '/:id',
    authorize([Permissions.UPDATE_GROUP]),
    validateRequest(groupSchema.idParam, 'params'),
    validateRequest(groupSchema.updateGroup, 'body'),
    /* #swagger.tags = ['Group']
       #swagger.description = 'Update an artist group by ID'
       #swagger.path = '/group/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.parameters["body"] = {
            in: 'body',
            name: 'body',
            required: true,
            schema: { $ref: '#/definitions/groupCreate' }
       }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/successResponse.200' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    auditLog('UPDATE_GROUP'),
    updateGroup,
);

router.delete(
    '/:id',
    authorize([Permissions.DELETE_GROUP]),
    validateRequest(groupSchema.idParam, 'params'),
    /* #swagger.tags = ['Group']
       #swagger.description = 'Delete an artist group by ID'
       #swagger.path = '/group/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[204] = { schema: { $ref: '#/definitions/successResponse.204' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    auditLog('DELETE_GROUP'),

    deleteGroup,
);

router.post(
    '/:id/artists/:artistId',
    authorize([Permissions.UPDATE_GROUP]),
    validateRequest(groupSchema.artistGroupParams, 'params'),
    /* #swagger.tags = ['Group']
       #swagger.description = 'Add an artist to a group'
       #swagger.path = '/group/{id}/artists/{artistId}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.parameters['artistId'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/successResponse.200' } }
       #swagger.responses[404] = { schema: { $ref: '#/definitions/errorResponse.404' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    auditLog('UPDATE_GROUP'),
    addArtistToGroup,
);

router.delete(
    '/:id/artists/:artistId',
    authorize([Permissions.UPDATE_GROUP]),
    validateRequest(groupSchema.artistGroupParams, 'params'),
    /* #swagger.tags = ['Group']
       #swagger.description = 'Remove an artist from a group'
       #swagger.path = '/group/{id}/artists/{artistId}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.parameters['artistId'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[204] = { schema: { $ref: '#/definitions/successResponse.204' } }
       #swagger.responses[404] = { schema: { $ref: '#/definitions/errorResponse.404' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    auditLog('UPDATE_GROUP'),
    removeArtistFromGroup,
);

export default router;
