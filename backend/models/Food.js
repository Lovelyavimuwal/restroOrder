import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  rating: { type: Number, default: 4.5 },
  preparationTime: { type: Number, default: 15 },
  veg: { type: Boolean, default: true },
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Food', foodSchema);
