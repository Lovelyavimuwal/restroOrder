import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  expiry: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);
