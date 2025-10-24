import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: String,
  password: String,
  code: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120,
  },
});

export const VerificationCode = mongoose.models.VerificationCode || mongoose.model('VerificationCode', verificationCodeSchema);