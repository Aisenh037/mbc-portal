import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Assignment, Submission } from '../models/Assignment.js';
import { persistFile } from '../services/storage.service.js';

export const createAssignment = asyncHandler(async (req, res) => {
  let attachmentUrl;
  if (req.file) {
    attachmentUrl = await persistFile(req.file);
  }
  const assignment = await Assignment.create({ ...req.body, attachmentUrl });
  res.status(StatusCodes.CREATED).json(assignment);
});

export const listAssignments = asyncHandler(async (req, res) => {
  const items = await Assignment.find().populate('course').populate('createdBy');
  res.json(items);
});

export const submitAssignment = asyncHandler(async (req, res) => {
  let fileUrl;
  if (req.file) {
    fileUrl = await persistFile(req.file);
  }
  const submission = await Submission.create({ assignment: req.body.assignment, student: req.body.student, fileUrl });
  res.status(StatusCodes.CREATED).json(submission);
});

export const listSubmissions = asyncHandler(async (req, res) => {
  const items = await Submission.find().populate('assignment').populate('student');
  res.json(items);
});