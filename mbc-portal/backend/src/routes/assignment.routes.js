import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../utils/multer.js';
import { createAssignment, listAssignments, submitAssignment, listSubmissions } from '../controllers/assignment.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', authorize('admin', 'developer', 'professor'), upload.single('attachment'), createAssignment);
router.get('/', authorize('admin', 'developer', 'professor', 'student'), listAssignments);

router.post('/submit', authorize('student', 'developer'), upload.single('file'), submitAssignment);
router.get('/submissions', authorize('admin', 'developer', 'professor'), listSubmissions);

export default router;