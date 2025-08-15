import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Exam, Result } from '../models/Exam.js';

export const createExam = asyncHandler(async (req, res) => {
  const exam = await Exam.create(req.body);
  res.status(StatusCodes.CREATED).json(exam);
});
export const listExams = asyncHandler(async (req, res) => {
  const items = await Exam.find().populate('course');
  res.json(items);
});

export const createResult = asyncHandler(async (req, res) => {
  const result = await Result.create(req.body);
  res.status(StatusCodes.CREATED).json(result);
});
export const listResults = asyncHandler(async (req, res) => {
  const items = await Result.find().populate('student').populate('course');
  res.json(items);
});