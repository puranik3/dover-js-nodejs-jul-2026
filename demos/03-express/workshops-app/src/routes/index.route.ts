import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.write('This is the workshops app. It serves details of workshops happening nearby!');
    res.end();
});

router.get('/home', (req, res) => {
    // tell the browser to make request to / instead. On receiving this response, the browser makes a new request to /
    res.redirect('/');
});

export default router;
