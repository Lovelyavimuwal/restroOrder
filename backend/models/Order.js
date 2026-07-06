import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  customerName: { type: String, default: 'Guest' },
  items: [{ name: String, price: Number, quantity: Number, notes: String }],
  total: { type: Number, required: true },
  status: { type: String, default: 'Received' },
  paymentMethod: { type: String, default: 'Cash' },
  paymentStatus: { type: String, default: 'Pending' },
  notes: { type: String, default: '' },
  estimatedTime: { type: Number, default: 20 }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
