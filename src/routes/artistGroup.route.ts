import express from 'express';
import {
    createArtistGroup,
    getArtistGroups,
    getArtistGroupById,
    updateArtistGroup,
    deleteArtistGroup,
} from '../controllers/artistGroup.controller';

const router = express.Router();

router.post(
    '/',
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
    createArtistGroup,
);

router.get(
    '/',
    /* #swagger.tags = ['Group']
       #swagger.description = 'Get all artist groups'
       #swagger.path = '/group'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/groupResponse' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getArtistGroups,
);

router.get(
    '/:id',
    /* #swagger.tags = ['Group']
       #swagger.description = 'Get an artist group by ID'
       #swagger.path = '/group/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/groupResponseFull' } }
       #swagger.responses[404] = { schema: { $ref: '#/definitions/errorResponse.404' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getArtistGroupById,
);

router.put(
    '/:id',
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
    updateArtistGroup,
);

router.delete(
    '/:id',
    /* #swagger.tags = ['Group']
       #swagger.description = 'Delete an artist group by ID'
       #swagger.path = '/group/{id}'
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', example: 1 }
       #swagger.responses[204] = { schema: { $ref: '#/definitions/successResponse.204' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    deleteArtistGroup,
);

export default router;
