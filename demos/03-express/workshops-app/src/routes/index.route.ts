import express from 'express';
import { getIndex, getHome } from '../controllers/index.controller';

const router = express.Router();

router.get('/', getIndex);

router.get('/home', getHome);

export default router;
