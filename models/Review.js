import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    stars: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User reference
  },
  { timestamps: true }
);

export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

