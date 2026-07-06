import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  qrCode: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Table', tableSchema);
