import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import logger from '../config/logger';

export const validateRequest = (
    schema: Schema,
    property: 'body' | 'query' | 'params' = 'body',
) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { error, value } = schema.validate(req[property], {
                abortEarly: false,
                stripUnknown: true, // Cette option supprime les champs non définis dans le schéma
            });

            if (error) {
                const errors = error.details.map((detail) => ({
                    field: detail.path.join('.'),
                    message: detail.message,
                }));

                logger.warn(
                    {
                        validation: {
                            errors,
                            originalData: req[property],
                        },
                        request: {
                            method: req.method,
                            url: req.url,
                        },
                    },
                    'Validation failed',
                );

                res.status(400).json({
                    code: 400,
                    message: 'Validation failed',
                    errors,
                });
                return;
            }

            // Replace the request property with the validated and stripped value
            req[property] = value;

            next();
        } catch (err) {
            next(err);
        }
    };
};
