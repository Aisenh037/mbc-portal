import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rollNumber: { type: String, required: true, unique: true },
    program: { type: String, enum: ['B.Tech', 'M.Tech', 'MCA', 'PhD'], required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    semester: { type: Number, min: 1, max: 10 },
    admissionYear: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model('Student', studentSchema);