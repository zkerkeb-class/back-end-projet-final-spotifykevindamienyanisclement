import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', function (req: Request, res: Response) {
    /* 
    #swagger.tags = ['Auth']
    #swagger.description = 'Endpoint to test auth route'
    #swagger.responses[200]= {
          schema: { $ref: '#/definitions/successResponse.200' }
      }  
    #swagger.responses[400] = {
      schema: { $ref: "#/definitions/errorResponse.400" }
    }
    #swagger.responses[401] = {
      schema: { $ref: "#/definitions/errorResponse.401" }
    }
  */

    res.send('respond with a resource');
});

module.exports = router;
