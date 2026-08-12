import Session from '../data/models/Session';
import Workshop from '../data/models/Workshop';
import ISession from '../models/ISession';
import { ErrorWithStatus } from '../models/utils';

const addSession = async (session: Omit<ISession, 'id'>) => {
    // Ensure the workshop exists (foreign key should point to a valid workshop)
    const workshop = await Workshop.findByPk(session.workshopId);

    if (!workshop) {
        const error: ErrorWithStatus = new Error(`Workshop not found`);
        error.type = 'ValidationError';
        error.status = 400;
        throw error;
    }

    const insertedSession = await Session.create({
        ...session,
        upvoteCount: session.upvoteCount ?? 0,
    });

    return insertedSession;
};

export { addSession };
