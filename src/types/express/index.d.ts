import 'express';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
    export interface Response {
        sendResponse?: (body?: any) => Response;
    }
}

declare global {
    namespace Express {
        interface Request {
            user?:
                | {
                      userId: number;
                      name: string;
                      email: string;
                      role: string;
                  }
                | JwtPayload;
        }
    }
}
