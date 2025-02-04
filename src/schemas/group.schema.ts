import Joi from 'joi';

export const groupSchema = {
    createGroup: Joi.object({
        name: Joi.string().required().min(1).max(255),
        description: Joi.string().optional(),
        imageId: Joi.number().optional(),
    }),

    updateGroup: Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        imageId: Joi.number().optional(),
    }),

    idParam: Joi.object({
        id: Joi.number().required().positive(),
    }),

    artistGroupParams: Joi.object({
        id: Joi.number().required(),
        artistId: Joi.number().required(),
    }),

    addArtist: Joi.object({
        artistId: Joi.number().required().positive(),
    }),
};
