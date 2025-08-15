import axios from 'axios';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

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