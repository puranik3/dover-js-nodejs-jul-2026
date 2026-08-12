import express from 'express';
import * as Controller from '../controllers/sessions.controller';

const router = express.Router();

router.route('/').post(Controller.postSession);

export default router;
