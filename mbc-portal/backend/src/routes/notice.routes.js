import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { createNotice, listNotices, deleteNotice } from '../controllers/notice.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', authorize('admin', 'developer', 'professor'), createNotice);
router.get('/', authorize('admin', 'developer', 'professor', 'student'), listNotices);
router.delete('/:id', authorize('admin', 'developer'), deleteNotice);

export default router;