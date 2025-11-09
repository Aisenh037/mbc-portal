import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Assignment, Submission } from '../models/Assignment.js';
// --- FIX: Import Professor and Student models ---
import Professor from '../models/Professor.js';
import Student from '../models/Student.js';

export const createAssignment = asyncHandler(async (req, res) => {
  let attachmentUrl;
  if (req.file) {
    attachmentUrl = req.file.path; // Get URL from Cloudinary
  }

  // --- FIX: Find the Professor profile linked to the logged-in user ---
  const professorProfile = await Professor.findOne({ user: req.user.id });
  if (!professorProfile) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: 'Only professors can create assignments.',
    });
  }

  const assignment = await Assignment.create({
    ...req.body,
    attachmentUrl,
    createdBy: professorProfile._id, // --- FIX: Use the Professor's ID ---
  });
  res.status(StatusCodes.CREATED).json(assignment);
});

export const listAssignments = asyncHandler(async (req, res) => {
  const items = await Assignment.find()
    .populate('course')
    .populate('createdBy'); // This will now correctly populate the Professor details
  res.json(items);
});

export const submitAssignment = asyncHandler(async (req, res) => {
  let fileUrl;
  if (req.file) {
    fileUrl = req.file.path; // Get URL from Cloudinary
  }

  // --- FIX: Find the Student profile linked to the logged-in user ---
  const studentProfile = await Student.findOne({ user: req.user.id });
  if (!studentProfile) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: 'Only students can submit assignments.',
    });
  }

  const submission = await Submission.create({
    assignment: req.body.assignment,
    student: studentProfile._id, // --- FIX: Use the Student's ID ---
    fileUrl,
  });
  res.status(StatusCodes.CREATED).json(submission);
});

export const listSubmissions = asyncHandler(async (req, res) => {
  const items = await Submission.find()
    .populate('assignment')
    .populate('student'); // This will now correctly populate the Student details
  res.json(items);
});