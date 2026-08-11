import Workshop from '../data/models/Workshop';
import IWorkshop from '../models/IWorkshop';

import { WhereOptions, OrderItem } from 'sequelize';

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

export { getAllWorkshops, addWorkshop };
