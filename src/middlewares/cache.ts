import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redisClient';
import logger from '../config/logger';

const cacheMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    // Si redisClient n'est pas initialisé, passer au middleware suivant
    if (!redisClient) {
        return next();
    }

    // Générer une clé de cache à partir de l'URL de la requête
    const key = req.originalUrl;

    try {
        // Tenter de récupérer une réponse mise en cache pour cette clé
        const cachedResponse = await redisClient.get(key);
        if (cachedResponse) {
            // Si une réponse mise en cache est trouvée, la renvoyer au client
            res.json(JSON.parse(cachedResponse));
            return;
        }

        // Redéfinir res.json pour mettre en cache la réponse avant de l'envoyer
        (res as any).sendResponse = res.json.bind(res);
        res.json = (body) => {
            // Mettre en cache la réponse dans Redis
            redisClient!.set(key, JSON.stringify(body));
            return (res as any).sendResponse(body);
        };

        // Passer au middleware suivant
        next();
    } catch (error) {
        // En cas d'erreur, l'enregistrer et passer au middleware suivant
        logger.error('Cache middleware error:' + error);
        next();
    }
};

export default cacheMiddleware;
