import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    code: { type: String, required: true },
    type: { type: String, enum: ['Inward', 'Outward'], required: true },
    qty: { type: Number, required: true, min: 0 },
    date: { type: String, required: true }, // YYYY-MM-DD
    reference: { type: String, required: true, trim: true },
    balanceAfter: { type: Number, required: true },
    status: { type: String, enum: ['Accepted', 'Rejected'], default: 'Accepted' },
    reason: { type: String },
  },
  { timestamps: true }
);

transactionSchema.index({ status: 1, date: 1 });

export default mongoose.model('Transaction', transactionSchema);
