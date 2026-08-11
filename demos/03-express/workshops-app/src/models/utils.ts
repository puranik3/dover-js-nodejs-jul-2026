import { NextFunction, Request, Response } from 'express';

export type ErrorWithStatus = Error & {
    status?: number;
    code?: number;
    type?: string;
};

export type Controller = (req: Request, res: Response, next?: NextFunction) => void;
