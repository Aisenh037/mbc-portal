import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler.js';
import Branch from '../models/Branch.js';
import Course from '../models/Course.js';
import Professor from '../models/Professor.js';
import Student from '../models/Student.js';

// Branch CRUD
export const createBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.create(req.body);
  res.status(StatusCodes.CREATED).json(branch);
});
export const listBranches = asyncHandler(async (req, res) => {
  const items = await Branch.find().sort({ createdAt: -1 });
  res.json(items);
});
export const updateBranch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await Branch.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
});
export const deleteBranch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Branch.findByIdAndDelete(id);
  res.status(StatusCodes.NO_CONTENT).send();
});

// Course CRUD
export const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  res.status(StatusCodes.CREATED).json(course);
});
export const listCourses = asyncHandler(async (req, res) => {
  const items = await Course.find().populate('branch');
  res.json(items);
});
export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await Course.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
});
export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Course.findByIdAndDelete(id);
  res.status(StatusCodes.NO_CONTENT).send();
});

// Professor CRUD
export const createProfessor = asyncHandler(async (req, res) => {
  const prof = await Professor.create(req.body);
  res.status(StatusCodes.CREATED).json(prof);
});
export const listProfessors = asyncHandler(async (req, res) => {
  const items = await Professor.find().populate('user').populate('branches');
  res.json(items);
});
export const updateProfessor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await Professor.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
});
export const deleteProfessor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Professor.findByIdAndDelete(id);
  res.status(StatusCodes.NO_CONTENT).send();
});

// Student CRUD
export const createStudent = asyncHandler(async (req, res) => {
  const student = await Student.create(req.body);
  res.status(StatusCodes.CREATED).json(student);
});
export const listStudents = asyncHandler(async (req, res) => {
  const items = await Student.find().populate('user').populate('branch');
  res.json(items);
});
export const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await Student.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
});
export const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Student.findByIdAndDelete(id);
  res.status(StatusCodes.NO_CONTENT).send();
});