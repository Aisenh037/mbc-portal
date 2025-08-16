import axios from 'axios';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Student from '../models/Student.js';
import Branch from '../models/Branch.js';
import Course from '../models/Course.js';
import { FeeRecord } from '../models/Finance.js';
import { Exam, Result } from '../models/Exam.js';
import { Assignment, Submission } from '../models/Assignment.js';

export const getStudentPerformance = asyncHandler(async (req, res) => {
	const { studentId } = req.params;
	const { data } = await axios.get(`${env.PY_SERVICE_URL}/analytics/student/${studentId}`);
	res.json(data);
});

export const predictFeePayment = asyncHandler(async (req, res) => {
	const { data } = await axios.post(`${env.PY_SERVICE_URL}/analytics/fee/predict`, req.body);
	res.json(data);
});

export const categorizePaper = asyncHandler(async (req, res) => {
	const { data } = await axios.post(`${env.PY_SERVICE_URL}/analytics/paper/categorize`, req.body);
	res.json(data);
});

export const overview = asyncHandler(async (req, res) => {
	const [studentCount, courseCount, branchCount] = await Promise.all([
		Student.countDocuments(),
		Course.countDocuments(),
		Branch.countDocuments()
	]);

	const programDistribution = await Student.aggregate([
		{ $group: { _id: '$program', count: { $sum: 1 } } },
		{ $project: { program: '$_id', count: 1, _id: 0 } },
		{ $sort: { count: -1 } }
	]);

	const branchDistribution = await Student.aggregate([
		{ $group: { _id: '$branch', count: { $sum: 1 } } },
		{ $lookup: { from: 'branches', localField: '_id', foreignField: '_id', as: 'branch' } },
		{ $unwind: { path: '$branch', preserveNullAndEmptyArrays: true } },
		{ $project: { branch: '$branch.name', count: 1, _id: 0 } },
		{ $sort: { count: -1 } }
	]);

	const feeStatus = await FeeRecord.aggregate([
		{ $group: { _id: '$status', count: { $sum: 1 } } },
		{ $project: { status: '$_id', count: 1, _id: 0 } }
	]);

	const gradeDistribution = await Result.aggregate([
		{ $group: { _id: '$grade', count: { $sum: 1 } } },
		{ $project: { grade: '$_id', count: 1, _id: 0 } },
		{ $sort: { count: -1 } }
	]);

	const [assignmentCount, submissionCount] = await Promise.all([
		Assignment.countDocuments(),
		Submission.countDocuments()
	]);

	res.json({
		counters: { studentCount, courseCount, branchCount, assignmentCount, submissionCount },
		distributions: { programDistribution, branchDistribution, feeStatus, gradeDistribution }
	});
});