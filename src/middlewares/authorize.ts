import { Request, Response, NextFunction } from 'express';
import { RolePermissions } from '../config/roles';
import logger from '../config/logger';

const authorize = (requiredPermissions: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req?.user?.role; // Assurez-vous que le rôle de l'utilisateur est stocké dans la requête
        const userPermissions = RolePermissions[userRole] || [];

        const hasPermission = requiredPermissions.every((permission) =>
            userPermissions.includes(permission),
        );

        if (!hasPermission) {
            logger.warn(
                {
                    user: req.user,
                    requiredPermissions,
                },
                'Permission denied',
            );
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        next();
    };
};

export default authorize;
