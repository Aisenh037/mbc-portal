import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { listUsers, updateUserRole, deleteUser } from '../controllers/users.controller.js';

const router = Router();

router.use(authenticate, authorize('admin', 'developer'));

router.get('/', listUsers);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;