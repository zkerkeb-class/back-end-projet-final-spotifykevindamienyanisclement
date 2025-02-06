import Joi from 'joi';

export const userSchema = {
    create: Joi.object({
        name: Joi.string().required().min(2).max(255),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8),
        role: Joi.string().valid('admin', 'user').default('user'),
    }),

    update: Joi.object({
        name: Joi.string().min(2).max(255).optional(),
        email: Joi.string().email().optional(),
        role: Joi.string().valid('admin', 'user').optional(),
    }),

    idParam: Joi.object({
        id: Joi.number().required().positive(),
    }),
};
