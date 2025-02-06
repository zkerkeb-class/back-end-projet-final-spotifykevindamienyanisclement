import session from 'express-session';
import connectRedis from 'connect-redis';
import redisClient from '../config/redisClient';
import logger from '../config/logger';

// Créer une classe RedisStore pour stocker les sessions dans Redis
const RedisStore = connectRedis(session);

// Définir les options de session
const sessionOptions: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 60 * 1000 }, // 1 heure
};

// Si redisClient est initialisé, utiliser RedisStore pour stocker les sessions
if (redisClient) {
    sessionOptions.store = new RedisStore({ client: redisClient });
}

// Créer le middleware de session avec les options configurées
const sessionMiddleware = session(sessionOptions);

// Exporter le middleware de session
export default sessionMiddleware;
