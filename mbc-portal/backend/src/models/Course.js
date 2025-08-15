import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    credits: { type: Number, default: 3 },
    semester: { type: Number, min: 1, max: 10 },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);