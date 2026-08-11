import { NextFunction, Request, Response } from 'express';

export type ErrorWithStatus = Error & {
    status?: number;
    code?: number;
    type?: string;
};

export class NotFoundError extends Error {
    status : number = 404;
    code: number = 404;
    type: string = 'NotFound';

    // This is the default constructor, and need not be provided if no other constructor exists
    constructor( message : string ) {
        super( message );
    }
}

export type Controller = (req: Request, res: Response, next?: NextFunction) => void;
