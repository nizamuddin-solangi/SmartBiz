import { Router } from 'express';
import {
    createBooking,
    getMyBookings,
    updateBookingStatus
} from '../controllers/booking.controller';
import { protect } from '../middlewares/auth';

const router = Router();

router.use(protect);

router.route('/')
    .get(getMyBookings)
    .post(createBooking);

router.patch('/:id/status', updateBookingStatus);

export default router;
