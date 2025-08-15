import mongoose from 'mongoose';

const professorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeId: { type: String, required: true, unique: true },
    designation: { type: String },
    branches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }],
    researchInterests: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Professor', professorSchema);