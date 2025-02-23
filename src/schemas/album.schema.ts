import Joi from 'joi';

export const albumSchema = {
    create: Joi.object({
        title: Joi.string().required().min(1).max(255),
        imageId: Joi.number().required().positive(),
        artistId: Joi.number().positive().allow(null),
        groupId: Joi.number().positive().allow(null),

        tracks: Joi.array()
            .items(
                Joi.object({
                    title: Joi.string().required().min(1).max(255),
                    soundId: Joi.number().required().positive(),
                }),
            )
            .allow(null),
    }),

    update: Joi.object({
        title: Joi.string().min(1).max(255).optional(),
        artistId: Joi.number().positive(),
        groupId: Joi.number().positive(),
        imageId: Joi.number().positive(),
    }),

    idParam: Joi.object({
        id: Joi.number().required().positive(),
    }),
};
