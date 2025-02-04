import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/logger';

// Déclaration pour étendre l'interface Request
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    console.log(req.header('Authorization'));
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        req.user = {
            role: 'ANONYMOUS',
        };
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export default verifyToken;
