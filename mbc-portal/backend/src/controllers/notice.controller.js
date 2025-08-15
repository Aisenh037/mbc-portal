import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler.js';
import Notice from '../models/Notice.js';

export const createNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.create({ ...req.body, createdBy: req.user.id });
  res.status(StatusCodes.CREATED).json(notice);
});

export const listNotices = asyncHandler(async (req, res) => {
  const audience = req.query.audience || undefined;
  const query = audience ? { audience: audience } : {};
  const items = await Notice.find(query).sort({ createdAt: -1 }).populate('createdBy', 'name email');
  res.json(items);
});

export const deleteNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Notice.findByIdAndDelete(id);
  res.status(StatusCodes.NO_CONTENT).send();
});