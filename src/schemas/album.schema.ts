import Joi from 'joi';

export const albumSchema = {
    create: Joi.object({
        title: Joi.string().required().min(1).max(255),
        artistId: Joi.number().positive(),
        groupId: Joi.number().positive(),
        imageId: Joi.number().required().positive(),

        tracks: Joi.array()
            .items(
                Joi.object({
                    title: Joi.string().required().min(1).max(255),
                    soundId: Joi.number().required().positive(),
                }),
            )
            .required()
            .min(1),
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
