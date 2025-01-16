import 'express';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
    export interface Response {
        sendResponse?: (body?: any) => Response;
    }
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: string | JwtPayload;
    }
}
