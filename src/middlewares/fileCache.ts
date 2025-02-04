import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redisClient';
import fs from 'fs';
import path from 'path';
import logger from '../config/logger';

const fileCacheMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    // Si redisClient n'est pas initialisé, passer au middleware suivant
    if (!redisClient) {
        return next();
    }

    // Générer le chemin du fichier à partir du répertoire public et du chemin de la requête
    const filePath = path.join(__dirname, '..', 'public', req.path);

    try {
        // Vérifier si le fichier existe
        if (fs.existsSync(filePath)) {
            // Lire le contenu du fichier
            const fileContent = fs.readFileSync(filePath);
            // Générer une clé de cache à partir du chemin de la requête
            const key = `file:${req.path}`;

            // Tenter de récupérer un fichier mis en cache pour cette clé
            const cachedFile = await redisClient.getBuffer(key);
            if (cachedFile) {
                // Si un fichier mis en cache est trouvé, le renvoyer au client
                res.setHeader('Content-Type', 'application/octet-stream');
                res.send(cachedFile);
                return;
            }

            // Mettre en cache le contenu du fichier dans Redis
            await redisClient.set(key, fileContent, 'EX', 60 * 60 * 24); // Cache pour 1 jour
            // Renvoyer le contenu du fichier au client
            res.setHeader('Content-Type', 'application/octet-stream');
            res.send(fileContent);
            return;
        }

        // Si le fichier n'existe pas, passer au middleware suivant
        next();
    } catch (error) {
        // En cas d'erreur, l'enregistrer et passer au middleware suivant
        logger.error('File cache middleware error:', error);
        next();
    }
};

export default fileCacheMiddleware;
