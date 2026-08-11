import Workshop from '../data/models/Workshop';
import IWorkshop from '../models/IWorkshop';

import { WhereOptions, OrderItem } from 'sequelize';

import { ErrorWithStatus, NotFoundError } from '../models/utils';

const getWorkshopById = async (id: number) => {
    const workshop = await Workshop.findByPk(id);

    if (workshop === null) {
        throw new NotFoundError('No such workshop');
    }

    return workshop;
};

const getAllWorkshops = async (page: number, sortField: string = '', category = '') => {
    const limit = 10;
    const offset = limit * (page - 1);

    const where: WhereOptions = {};

    if (category) {
        where.category = category;
    }

    // Build the ORDER BY clause if sortField is provided
    let order: OrderItem[] | undefined = undefined;
    if (sortField) {
        order = [[sortField, 'ASC']];
    }

    const { rows: workshops, count } = await Workshop.findAndCountAll({
        where,
        // We can either blacklist or whitelist fields. Here we blacklist (i.e. omit certain fields)
        attributes: {
            exclude: ['description'],
        },
        limit,
        offset,
        order,
    });

    return {
        workshops,
        count,
    };
};

const addWorkshop = async (workshop: Omit<IWorkshop, 'id'>) => {
    const insertedWorkshop = await Workshop.create(workshop);
    return insertedWorkshop;
};

const updateWorkshop = async (id: number, workshop: Partial<IWorkshop>) => {
    // NOTES
    // ---
    // 1. In Sequelize, we pass the fields to update as a plain object.
    //    Only the provided fields are updated (similar to PATCH semantics).
    // 2. Sequelize runs validations on update by default based on the model definitions.
    // 3. update() returns the number of affected rows. To return the updated record, we fetch it again.
    const [affectedCount] = await Workshop.update(workshop, {
        where: { id },
    });

    if (affectedCount === 0) {
        const error: ErrorWithStatus = new Error('No such workshop');
        error.type = 'NotFound';
        throw error;
    }

    const updatedWorkshop = await Workshop.findByPk(id);

    return updatedWorkshop;
};

const deleteWorkshop = async (id: number) => {
    const deletedCount = await Workshop.destroy({
        where: { id },
    });

    if (deletedCount === 0) {
        const error: ErrorWithStatus = new Error('No such workshop');
        error.type = 'NotFound';
        throw error;
    }

    return;
};

export { getAllWorkshops, addWorkshop, getWorkshopById, updateWorkshop, deleteWorkshop };
