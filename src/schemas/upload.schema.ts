import Joi from 'joi';

export const uploadSchema = {
    uploadAudio: Joi.object({
        audio: Joi.object().required(), // Validation pour le fichier audio
    }),

    uploadImage: Joi.object({
        image: Joi.object().required(), // Validation pour le fichier image
    }),
};
