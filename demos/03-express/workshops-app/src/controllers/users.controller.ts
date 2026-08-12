import { Request, Response } from 'express';
import * as Service from '../services/users.service';
import IUser from '../models/IUser';
import { ErrorWithStatus } from '../models/utils';

const register = async (req: Request<{}, {}, Omit<IUser, 'id'>>, res: Response) => {
    const user = req.body;

    // if user = req.body -> {}
    if (Object.keys(user).length === 0) {
        const error: ErrorWithStatus = new Error('Body is missing');
        error.status = 400;
        throw error;
    }

    const updatedUser = await Service.addUser(user);

    // password is removed automatically by User.toJSON() when sending JSON response
    res.status(201).json({
        status: 'success',
        data: updatedUser,
    });
};

export { register };
