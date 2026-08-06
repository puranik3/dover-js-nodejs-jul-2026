import express from 'express';
// You can import JSON file!
import workshops from '../data/workshops.json';

let nextId = 13;

const router = express.Router();

router.get('/workshops', (req, res) => {
    // status(), json(), redirect(), send(), sendFile() are added onto the Node JS response object
    // Content-Type HTTP header conveys the MIME type (format) of the data
    res.json(workshops);
});

router.post('/workshops', (req, res) => {
    const newWorkshop = req.body;

    newWorkshop.id = nextId;
    ++nextId;
    workshops.push(newWorkshop);

    res.status(201).json(newWorkshop);
});

export default router;
