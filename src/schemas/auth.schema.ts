import Joi from 'joi';

export const authSchema = {
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),

    register: Joi.object({
        name: Joi.string().required().min(2).max(255),
        email: Joi.string().email().required(),
        password: Joi.string()
            .required()
            .min(8)
            .pattern(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            )
            .message(
                'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
            ),
    }),

    empty: Joi.object({}),
};
