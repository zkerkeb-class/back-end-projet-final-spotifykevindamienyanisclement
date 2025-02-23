import { Router } from 'express';
import {
    getBusinessData,
    getSystemPerformanceData,
    getAveragePerformanceByEndpoint,
} from '../controllers/metrics.controller';

const router = Router();

// Endpoint pour les données métier
router.get(
    '/business-data',
    /* #swagger.tags = ['Metrics']
       #swagger.description = 'Obtenir les données métier'
	   #swagger.parameters['days'] = {
		   in: 'query',
		   required: false,
		   type: 'integer',
		   description: 'Nombre de jours à retourner',
		   example: 30
	   }
       #swagger.responses[200] = { schema: { $ref: '#/definitions/getBuisnessData' } }
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getBusinessData,
);

// Endpoint pour les données de performance du système
router.get(
    '/system-performance',
    /* #swagger.tags = ['Metrics']
		#swagger.parameters['days'] = {
		   in: 'query',
		   required: false,
		   type: 'integer',
		   description: 'Nombre de jours à retourner',
		   example: 30
	   }
       #swagger.description = 'Obtenir les données de performance du système'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/getSystemPerformance' }}
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getSystemPerformanceData,
);

router.get(
    '/endpoint-performance',
    /* #swagger.tags = ['Metrics']
       #swagger.description = 'Obtenir les données de performance du système'
       #swagger.responses[200] = { schema: { $ref: '#/definitions/getSystemPerformance' }}
       #swagger.responses[500] = { schema: { $ref: '#/definitions/errorResponse.500' } }
    */
    getAveragePerformanceByEndpoint,
);

export default router;
