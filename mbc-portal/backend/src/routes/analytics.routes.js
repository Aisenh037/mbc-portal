import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getStudentPerformance, predictFeePayment, categorizePaper, overview } from '../controllers/analytics.controller.js';

const router = Router();

router.use(authenticate);

router.get('/overview', authorize('admin', 'developer', 'professor'), overview);
router.get('/student/:studentId', authorize('admin', 'developer', 'professor'), getStudentPerformance);
router.post('/fee/predict', authorize('admin', 'developer'), predictFeePayment);
router.post('/paper/categorize', authorize('admin', 'developer', 'professor'), categorizePaper);

export default router;