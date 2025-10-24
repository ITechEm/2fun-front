import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  clientNumber: { type: String, unique: true, sparse: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  lastResetRequest: { type: Date, default: null },
}, {
  timestamps: true,
});

if (mongoose.models.User) {
  delete mongoose.models.User;
}

export const User = mongoose.model("User", UserSchema);
