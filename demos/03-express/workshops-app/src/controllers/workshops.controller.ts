import { Controller, ErrorWithStatus } from '../models/utils';
import * as Service from '../services/workshops.service';
import { Request, Response } from 'express';

// http://localhost:3000/api/workshops
// http://localhost:3000/api/workshops?page=1&sort=name&category=frontend
// http://localhost:3000/api/workshops?sort=name&category=frontend
// http://localhost:3000/api/workshops
// http://localhost:3000/api/workshops?page=1&sort=name&category=frontend
interface GetWorkshopsQuery {
    page?: string | number; // query strings are always string or undefined. But we shall type cast this property to a number.
    sort?: string;
    category?: string;
}

const getWorkshops: Controller = async (req, res) => {
    let { page, sort: sortField, category } = req.query as GetWorkshopsQuery;

    if (page) {
        page = +page;
    } else {
        page = 1;
    }

    const workshopsWithCount = await Service.getAllWorkshops(page, sortField || '', category || '');

    // send(), redirect(), json(), sendFile(), render() are other methods on response `res` object
    res.json({
        status: 'success',
        data: workshopsWithCount,
    });
};
const postWorkshop: Controller = async (req, res) => {
    const newWorkshop = req.body;

    // Check if body is sent and not empty
    if (!newWorkshop || Object.keys(newWorkshop).length === 0) {
        const err = new Error(
            'The request body is empty. Workshop object expected.'
        ) as ErrorWithStatus;
        err.status = 400;
        throw err;
    }

    // Remove the try..catch block here...
    const createdWorkshop = await Service.addWorkshop(newWorkshop);
    res.status(201).json({
        status: 'success',
        data: createdWorkshop,
    });
};

interface WorkshopIdParams {
    id: string;
}

// http://localhost:3000/api/workshops/:id
const getWorkshopById = async (req: Request<WorkshopIdParams>, res: Response) => {
    const { id } = req.params;

    const workshopId = +id;

    if (isNaN(workshopId)) {
        const err = new Error('Workshop id should be a number') as ErrorWithStatus;
        err.status = 400;
        err.type = 'ValidationError';
        throw err;
    }

    const workshop = await Service.getWorkshopById(workshopId);

    res.json({
        status: 'success',
        data: workshop,
    });
};

export { getWorkshops, postWorkshop, getWorkshopById };
