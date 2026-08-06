import express from 'express';
// You can import JSON file!
import workshops from '../data/workshops.json';

const router = express.Router();

router.get('/workshops', (req, res) => {
    // json(), redirect(), send(), sendFile() are added onto the Node JS response object
    // Content-Type HTTP header conveys the MIME type (format) of the data
    res.json(workshops);
});

export default router;
