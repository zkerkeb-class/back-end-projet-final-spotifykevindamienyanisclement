import express, { Request, Response } from 'express';
const router = express.Router();
import uploadController from '../controllers/upload.controller';
import { uploadImage } from '../CDN/image';
import { uploadAudio } from '../CDN/audio';

router.post(
    '/audio',
    // uploadImage,
    uploadAudio,
    /*
        #swagger.tags = ['Upload']
        #swagger.description = 'Endpoint to upload audio file'
		    #swagger.path = '/upload/audio'
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['audio'] = {
            in: 'formData',
            type: 'file',
            required: true,
            description: 'The audio file to upload'
        }
        #swagger.responses[200]= {
              schema: { $ref: '#/definitions/soundResponse' }
          }
        #swagger.responses[400] = {
          schema: { $ref: "#/definitions/errorResponse.400" }
        }
        #swagger.responses[401] = {
          schema: { $ref: "#/definitions/errorResponse.401" }
        }
	*/
    uploadController.uploadAudio,
);

router.post(
    '/image',
    uploadImage,
    /*
        #swagger.tags = ['Upload']
        #swagger.description = 'Endpoint to upload image'
        #swagger.path = '/upload/image'
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['image'] = {
            in: 'formData',
            type: 'file',
            required: true,
            description: 'The image file to upload'
        }
        #swagger.responses[200]= {
              schema: { $ref: '#/definitions/imageResponse' }
          }
        #swagger.responses[400] = {
          schema: { $ref: "#/definitions/errorResponse.400" }
        }
        #swagger.responses[401] = {
          schema: { $ref: "#/definitions/errorResponse.401" }
        }
  */
    uploadController.uploadImage,
);

export default router;
