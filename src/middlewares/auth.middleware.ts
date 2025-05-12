import { role } from './../consts/role';
import {NextFunction, Request, Response} from 'express';
import { string } from 'zod';
import UnauthorizedException from '../errors/unauthorized_exception';
import { verifyToken } from '../helpers/jwt';
import ForbiddenException from '../errors/forbidden.exception';

declare global {
    namespace Express {
        interface Request {
        user?: {
            id: string;
            role: string;
        };
        }
    }
}

const authMiddleware = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
       const token = req.headers['authorization']?.split(' ')[1];

       if (!token) {
            throw new UnauthorizedException('Token not provided');
       }

        const decoded = verifyToken(token);

        if (!decoded) {
            throw new UnauthorizedException('Invalid token');
        }

        const {userId, role} = decoded as {userId: string, role : string};

        req.user = {
            id: userId,
            role: role,
        };

        const isHaveAccess = allowedRoles.includes(role);
        if (!isHaveAccess) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        next();
    };
}

export default authMiddleware;