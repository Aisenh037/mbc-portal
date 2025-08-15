import mongoose from 'mongoose';

const feeRecordSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    amount: { type: Number, required: true },
    term: { type: String, required: true },
    dueDate: { type: Date },
    status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  },
  { timestamps: true }
);

const receiptSchema = new mongoose.Schema(
  {
    feeRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeRecord', required: true },
    paymentDate: { type: Date, default: Date.now },
    method: { type: String, enum: ['cash', 'card', 'online'], default: 'online' },
    transactionId: { type: String },
  },
  { timestamps: true }
);

export const FeeRecord = mongoose.model('FeeRecord', feeRecordSchema);
export const Receipt = mongoose.model('Receipt', receiptSchema);