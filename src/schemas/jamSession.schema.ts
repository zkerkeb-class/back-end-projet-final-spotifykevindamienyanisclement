import Joi from 'joi';

export const jamSessionSchema = {
    create: Joi.object({
        name: Joi.string().required().min(3).max(50),
    }),

    updateTrack: Joi.object({
        trackId: Joi.number().required().positive(),
    }),

    idParam: Joi.object({
        id: Joi.number().required().positive(),
    }),

    trackPosition: Joi.object({
        position: Joi.number().required(),
    }),

    playState: Joi.object({
        isPlaying: Joi.boolean().required(),
    }),
};
