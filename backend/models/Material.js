import mongoose from 'mongoose';

export const UNITS = ['KG', 'Meter', 'Nos', 'Litre'];
export const LOW_STOCK_LIMIT = 150;

const materialSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Material code is required.'],
      unique: true,
      uppercase: true,
      trim: true,
      immutable: true, // code is fixed after creation
    },
    name: { type: String, required: [true, 'Material name is required.'], trim: true },
    unit: { type: String, enum: { values: UNITS, message: 'Invalid unit.' }, required: true },
    openingQty: { type: Number, required: true, min: [0, 'Opening quantity cannot be negative.'], default: 0 },
    availableQty: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Material', materialSchema);
