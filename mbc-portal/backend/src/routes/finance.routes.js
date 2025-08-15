import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { createFeeRecord, listFeeRecords, updateFeeRecord, deleteFeeRecord, createReceipt, listReceipts } from '../controllers/finance.controller.js';

const router = Router();

router.use(authenticate);

router.post('/fees', authorize('admin', 'developer'), createFeeRecord);
router.get('/fees', authorize('admin', 'developer', 'professor'), listFeeRecords);
router.put('/fees/:id', authorize('admin', 'developer'), updateFeeRecord);
router.delete('/fees/:id', authorize('admin', 'developer'), deleteFeeRecord);

router.post('/receipts', authorize('admin', 'developer'), createReceipt);
router.get('/receipts', authorize('admin', 'developer'), listReceipts);

export default router;