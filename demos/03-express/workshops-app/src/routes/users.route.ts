import express from 'express';

import * as Controller from '../controllers/users.controller';

const router = express.Router();

router.post('/register', Controller.register);

export default router;
