import Joi from 'joi';

export const artistSchema = {
    create: Joi.object({
        name: Joi.string().required().min(1).max(255),
        imageId: Joi.number().required().positive(),
    }),

    update: Joi.object({
        name: Joi.string().min(1).max(255).optional(),
        imageId: Joi.number().positive(),
    }),

    idParam: Joi.object({
        id: Joi.number().required().positive(),
    }),
};
