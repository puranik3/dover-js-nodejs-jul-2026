import express from 'express';
import * as Controllers from '../controllers/workshops.controller';
const router = express.Router();

router.route('/').get(Controllers.getWorkshops).post(Controllers.postWorkshop);

// Add this...
router
    .route('/:id')
    .get(Controllers.getWorkshopById)
    .patch(Controllers.patchWorkshop)
    .delete(Controllers.deleteWorkshop);

export default router;
