import express from 'express';
import { getWorkshops, postWorkshop } from '../controllers/workshops.controller';
const router = express.Router();

router.route('/').get(getWorkshops).post(postWorkshop);

export default router;
