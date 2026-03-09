import { Router } from 'express';
import { getStats, getAllUsers, deleteUser } from '../controllers/admin.controller';
import { protect, authorize } from '../middlewares/auth';

const router = Router();

router.use(protect, authorize('ADMIN'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

export default router;
