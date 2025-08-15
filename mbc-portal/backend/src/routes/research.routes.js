import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../utils/multer.js';
import { createProject, listProjects, updateProject, deleteProject, createPublication, listPublications } from '../controllers/research.controller.js';

const router = Router();

router.use(authenticate);

router.post('/projects', authorize('admin', 'developer', 'professor'), createProject);
router.get('/projects', authorize('admin', 'developer', 'professor', 'student'), listProjects);
router.put('/projects/:id', authorize('admin', 'developer', 'professor'), updateProject);
router.delete('/projects/:id', authorize('admin', 'developer'), deleteProject);

router.post('/publications', authorize('admin', 'developer', 'professor'), upload.single('file'), createPublication);
router.get('/publications', authorize('admin', 'developer', 'professor', 'student'), listPublications);

export default router;