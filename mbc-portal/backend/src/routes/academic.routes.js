import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { createBranch, listBranches, updateBranch, deleteBranch, createCourse, listCourses, updateCourse, deleteCourse, createProfessor, listProfessors, updateProfessor, deleteProfessor, createStudent, listStudents, updateStudent, deleteStudent } from '../controllers/academic.controller.js';

const router = Router();

router.use(authenticate);

router.post('/branches', authorize('admin', 'developer'), createBranch);
router.get('/branches', authorize('admin', 'developer', 'professor', 'student'), listBranches);
router.put('/branches/:id', authorize('admin', 'developer'), updateBranch);
router.delete('/branches/:id', authorize('admin', 'developer'), deleteBranch);

router.post('/courses', authorize('admin', 'developer', 'professor'), createCourse);
router.get('/courses', authorize('admin', 'developer', 'professor', 'student'), listCourses);
router.put('/courses/:id', authorize('admin', 'developer', 'professor'), updateCourse);
router.delete('/courses/:id', authorize('admin', 'developer'), deleteCourse);

router.post('/professors', authorize('admin', 'developer'), createProfessor);
router.get('/professors', authorize('admin', 'developer', 'professor'), listProfessors);
router.put('/professors/:id', authorize('admin', 'developer'), updateProfessor);
router.delete('/professors/:id', authorize('admin', 'developer'), deleteProfessor);

router.post('/students', authorize('admin', 'developer'), createStudent);
router.get('/students', authorize('admin', 'developer', 'professor'), listStudents);
router.put('/students/:id', authorize('admin', 'developer'), updateStudent);
router.delete('/students/:id', authorize('admin', 'developer'), deleteStudent);

export default router;