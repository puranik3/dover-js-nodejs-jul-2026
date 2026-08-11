import { NextFunction, Request, Response } from 'express';
import { ErrorWithStatus } from '../models/utils';

import {
    ValidationError,
    UniqueConstraintError,
    DatabaseError,
    ForeignKeyConstraintError,
} from 'sequelize';

// Utility to enrich error with type and status code
export const enrichResponseError = (error: ErrorWithStatus) => {
    // Unique constraint violation (e.g. unique index on name)
    if (error instanceof UniqueConstraintError) {
        error.type = 'DuplicateKeyError';
        error.status = 400;
    }

    // Sequelize ValidationError (model-level validation)
    if (error instanceof ValidationError) {
        error.type = 'ValidationError';
        error.status = 400;
    }

    // Foreign key constraint errors (for related tables, if any)
    if (error instanceof ForeignKeyConstraintError) {
        error.type = 'ForeignKeyConstraintError';
        error.status = 409; // conflict
    }

    // Low-level database errors (syntax errors, connectivity, etc.)
    if (error instanceof DatabaseError) {
        error.type = 'DatabaseError';
        error.status = 500;
    }

    // Fallback — unknown error
    error.type = error.type || 'InternalServerError';
    error.status = error.status || 500;

    return error;
};

export const resourceNotFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const err: ErrorWithStatus = new Error('Resource not found');
    err.status = 404;
    err.type = 'NotFound';

    // pass an error object to transfer control directly to the error handler middleware
    // (error handler middleware need not be the next one in the middleware chain)
    // next(err);

    throw err;
};

export const errorHandler = (
    err: ErrorWithStatus,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err = enrichResponseError(err);

    res.status(err.status || 500).json({
        status: 'error',
        type: err.type,
        message: err.message,
    });
};