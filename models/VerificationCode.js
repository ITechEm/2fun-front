import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: String,
  password: String,
  code: { type: String, required: true },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
}, { timestamps: true });

export const VerificationCode = mongoose.models.VerificationCode || mongoose.model('VerificationCode', verificationCodeSchema);


// import mongoose, { Schema, models } from "mongoose";

// const VerificationCodeSchema = new Schema({
//   email: { type: String, required: true, unique: true },
//   code: { type: String, required: true },
//   name: String,
//   password: String,
//    createdAt: {
//     type: Date,
//     default: Date.now,
//     expires: 120,
//   }
// });

// export const VerificationCode =
//   models?.VerificationCode || mongoose.model("VerificationCode", VerificationCodeSchema);
