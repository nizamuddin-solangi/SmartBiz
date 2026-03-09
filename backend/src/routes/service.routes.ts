import { Router } from 'express';
import {
    createService,
    getBusinessServices,
    updateService,
    deleteService
} from '../controllers/service.controller';
import { protect, authorize } from '../middlewares/auth';

const router = Router();

router.post('/', protect, authorize('BUSINESS'), createService);
router.get('/business/:businessId', getBusinessServices);

router.route('/:id')
    .put(protect, updateService)
    .delete(protect, deleteService);

export default router;
