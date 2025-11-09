import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ResearchProject, Publication } from '../models/Research.js';
// import { persistFile } from '../services/storage.service.js'; // No longer needed

export const createProject = asyncHandler(async (req, res) => {
  const project = await ResearchProject.create(req.body);
  res.status(StatusCodes.CREATED).json(project);
});
export const listProjects = asyncHandler(async (req, res) => {
  const items = await ResearchProject.find().populate('supervisors').populate('students');
  res.json(items);
});
export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await ResearchProject.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
});
export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await ResearchProject.findByIdAndDelete(id);
  res.status(StatusCodes.NO_CONTENT).send();
});

export const createPublication = asyncHandler(async (req, res) => {
  let fileUrl;
  if (req.file) fileUrl = req.file.path; // Get URL from Cloudinary
  const pub = await Publication.create({ ...req.body, fileUrl });
  res.status(StatusCodes.CREATED).json(pub);
});
export const listPublications = asyncHandler(async (req, res) => {
  const items = await Publication.find().populate('project');
  res.json(items);
});