import { Request, Response } from 'express';

import * as Service from '../services/sessions.service';
import ISession from '../models/ISession';

const postSession = async (req: Request<{}, {}, ISession>, res: Response) => {
    const session = req.body;

    const newSession = await Service.addSession(session);

    res.status(201).json({
        status: 'success',
        data: newSession,
    });
};

export { postSession };
