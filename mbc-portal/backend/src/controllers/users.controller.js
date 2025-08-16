import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler.js';
import User, { USER_ROLES } from '../models/User.js';

export const listUsers = asyncHandler(async (req, res) => {
	const { role } = req.query;
	const query = role ? { role } : {};
	const users = await User.find(query).select('name email role isEmailVerified createdAt lastLoginAt');
	res.json(users);
});

export const updateUserRole = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { role } = req.body;
	if (!USER_ROLES.includes(role)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid role' });
	}
	const updated = await User.findByIdAndUpdate(id, { role }, { new: true }).select('name email role');
	res.json(updated);
});

export const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	await User.findByIdAndDelete(id);
	res.status(StatusCodes.NO_CONTENT).send();
});