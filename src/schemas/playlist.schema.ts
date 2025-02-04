import Joi from 'joi';

export const playlistSchema = {
    create: Joi.object({
        title: Joi.string().required().min(1).max(255),
        userId: Joi.number().required().positive(),
        imageId: Joi.number().required().positive(),
    }),

    update: Joi.object({
        title: Joi.string().min(1).max(255).optional(),
        imageId: Joi.number().positive(),
    }),

    addTrack: Joi.object({
        trackId: Joi.number().required().positive(),
    }),

    idParam: Joi.object({
        id: Joi.number().required().positive(),
    }),

    trackIdParam: Joi.object({
        id: Joi.number().required().positive(),
        trackId: Joi.number().required().positive(),
    }),
};
