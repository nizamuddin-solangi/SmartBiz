import { Router } from 'express';
import {
    createBusiness,
    getBusinesses,
    getBusiness,
    updateBusiness,
    deleteBusiness
} from '../controllers/business.controller';
import { protect, authorize } from '../middlewares/auth';

const router = Router();

router.route('/')
    .get(getBusinesses)
    .post(protect, authorize('BUSINESS', 'ADMIN'), createBusiness);

router.route('/:id')
    .get(getBusiness)
    .put(protect, updateBusiness)
    .delete(protect, deleteBusiness);

export default router;
