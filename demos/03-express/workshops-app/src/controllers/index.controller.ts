import { Controller } from '../models/utils';

const getIndex: Controller = (req, res) => {
    res.end('This is the workshops app. It serves details of workshops happening nearby.');
};

const getHome: Controller = (req, res) => {
    res.redirect('/');
};

export { getIndex, getHome };
