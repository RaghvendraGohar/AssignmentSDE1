// models/Request.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  serialNumber: Number,
  productName: String,
  inputImageUrls: [String],
  outputImageUrls: [String]
});

const requestSchema = new mongoose.Schema({
  requestId: { type: String, unique: true },
  status: { type: String, enum: ['pending', 'processing', 'completed'], default: 'pending' },
  products: [productSchema],
  createdAt: Date,
  updatedAt: Date
});

export default mongoose.model('Request', requestSchema);
