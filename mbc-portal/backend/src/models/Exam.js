import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    examDate: { type: Date, required: true },
    venue: { type: String },
    timetableFileUrl: { type: String },
  },
  { timestamps: true }
);

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    marksObtained: { type: Number, min: 0 },
    totalMarks: { type: Number, min: 1, default: 100 },
    grade: { type: String },
    reportFileUrl: { type: String },
  },
  { timestamps: true }
);

export const Exam = mongoose.model('Exam', examSchema);
export const Result = mongoose.model('Result', resultSchema);