import Joi from 'joi';

export const trackSchema = {
    create: Joi.object({
        title: Joi.string().required().min(1).max(255),
        albumId: Joi.number().required().positive(),
        soundId: Joi.number().required().positive(),
    }),

    update: Joi.object({
        title: Joi.string().min(1).max(255).optional(),
        soundId: Joi.number().positive(),
    }),

    albumIdParam: Joi.object({
        albumId: Joi.number().required().positive(),
    }),

    trackIdParam: Joi.object({
        trackId: Joi.number().required().positive(),
    }),
};
