import { Router } from 'express';
import { createReview, getBusinessReviews } from '../controllers/review.controller';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/', protect, createReview);
router.get('/business/:businessId', getBusinessReviews);

export default router;
