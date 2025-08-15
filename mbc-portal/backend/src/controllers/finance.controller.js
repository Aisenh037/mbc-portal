import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler.js';
import { FeeRecord, Receipt } from '../models/Finance.js';

export const createFeeRecord = asyncHandler(async (req, res) => {
  const rec = await FeeRecord.create(req.body);
  res.status(StatusCodes.CREATED).json(rec);
});
export const listFeeRecords = asyncHandler(async (req, res) => {
  const items = await FeeRecord.find().populate('student');
  res.json(items);
});
export const updateFeeRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await FeeRecord.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
});
export const deleteFeeRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await FeeRecord.findByIdAndDelete(id);
  res.status(StatusCodes.NO_CONTENT).send();
});

export const createReceipt = asyncHandler(async (req, res) => {
  const receipt = await Receipt.create(req.body);
  res.status(StatusCodes.CREATED).json(receipt);
});
export const listReceipts = asyncHandler(async (req, res) => {
  const items = await Receipt.find().populate({ path: 'feeRecord', populate: 'student' });
  res.json(items);
});