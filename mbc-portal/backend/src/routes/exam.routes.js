import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { createExam, listExams, createResult, listResults } from '../controllers/exam.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', authorize('admin', 'developer', 'professor'), createExam);
router.get('/', authorize('admin', 'developer', 'professor', 'student'), listExams);

router.post('/results', authorize('admin', 'developer', 'professor'), createResult);
router.get('/results', authorize('admin', 'developer', 'professor', 'student'), listResults);

export default router;