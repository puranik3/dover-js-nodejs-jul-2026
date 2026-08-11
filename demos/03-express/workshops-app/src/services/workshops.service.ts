import Workshop from '../data/models/Workshop';
import IWorkshop from '../models/IWorkshop';
import { ErrorWithStatus } from '../models/utils';
import { ValidationError, UniqueConstraintError } from 'sequelize';

import workshops from '../data/workshops.json';

let nextId = 13;

const getAllWorkshops = async () => {
    // const workshops = await Workshop.findAll();
    return workshops;
};

const addWorkshop = async (workshop: Omit<IWorkshop, 'id'>) => {
    try {
        // const insertedWorkshop = await Workshop.create(workshop);
        // return insertedWorkshop;

        const insertedWorkshop: any = { ...workshop };

        insertedWorkshop.id = nextId++;
        workshops.push(insertedWorkshop);
    } catch (err) {
        const error = err as ErrorWithStatus;

        if (err instanceof UniqueConstraintError) {
            error.type = 'ValidationError';
            error.status = 400;
        }

        if (err instanceof ValidationError) {
            error.type = 'ValidationError';
            error.status = 400;
        }

        throw error;
    }
};

export { getAllWorkshops, addWorkshop };
