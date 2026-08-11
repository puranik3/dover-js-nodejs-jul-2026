import { Controller } from '../models/util';

import Joi from 'joi';
import { ErrorWithStatus } from '../models/util';

// You can import JSON file!
import workshops from '../data/workshops.json';

import { getAllWorkshops, addWorkshop } from '../services/workshops.service';

// set up the Joi schema for validation
const timeSchema = Joi.object({
    hours: Joi.number().integer().min(0).max(23).required(),
    minutes: Joi.number().integer().min(0).max(59).required(),
});

const workshopSchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string()
        .valid('frontend', 'backend', 'database', 'devops', 'language', 'mobile')
        .required(),
    description: Joi.string().max(1024).required(),
    startDate: Joi.string().isoDate().required(),
    endDate: Joi.string().isoDate().required(),
    startTime: timeSchema.required(),
    endTime: timeSchema.required(),
    speakers: Joi.array().items(Joi.string()).min(1).required(),
    location: Joi.object({
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
    }).required(),
    modes: Joi.object({
        inPerson: Joi.boolean().required(),
        online: Joi.boolean().required(),
    }).required(),
    imageUrl: Joi.string().uri().required(),
});

const getWorkshops: Controller = async (req, res) => {
    // status(), json(), redirect(), send(), sendFile() are added onto the Node JS response object
    // Content-Type HTTP header conveys the MIME type (format) of the data
    const workshops = await getAllWorkshops();

    res.json({
        status: 'success',
        data: workshops,
    });
};

const postWorkshop: Controller = (req, res) => {
    const newWorkshop = req.body;

    // Check if body is sent and not empty
    if (!newWorkshop || Object.keys(newWorkshop).length === 0) {
        // return res.status(400).json({
        //     status: 'error',
        //     message: 'The request body is empty. Workshop object expected.',
        // });
        const err: ErrorWithStatus = new Error(
            'The request body is empty. Workshop object expected.'
        );
        err.status = 400;
        throw err;
    }

    // Validate using Joi
    const { error, value } = workshopSchema.validate(newWorkshop, {
        abortEarly: false,
        convert: false,
    });

    if (error) {
        const err: any = new Error((error as any).details.map((d) => d.message));
        err.status = 400;
        throw err;
    }

    // newWorkshop.id = nextId++;
    // workshops.push(newWorkshop);

    const insertedWorkshop = addWorkshop(newWorkshop);

    res.status(201).json({
        status: 'success',
        data: insertedWorkshop,
    });
};

export { getWorkshops, postWorkshop };
