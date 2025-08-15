import mongoose from 'mongoose';

const researchProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    program: { type: String, enum: ['B.Tech', 'M.Tech', 'MCA', 'PhD'], required: true },
    supervisors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Professor' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['ongoing', 'completed', 'paused'], default: 'ongoing' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const publicationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    authors: [{ type: String, required: true }],
    doi: { type: String },
    venue: { type: String },
    year: { type: Number },
    keywords: [{ type: String }],
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'ResearchProject' },
    fileUrl: { type: String },
  },
  { timestamps: true }
);

export const ResearchProject = mongoose.model('ResearchProject', researchProjectSchema);
export const Publication = mongoose.model('Publication', publicationSchema);