import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  clientNumber: { type: String, unique: true, sparse: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  lastResetRequest: { type: Date, default: null },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);




// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   clientNumber: { type: String, unique: true, sparse: true },
//   resetToken: { type: String },
//   resetTokenExpiry: { type: Date },
//   lastResetRequest: { type: Date, default: null },
// }, {
//   timestamps: true,
// });

// if (mongoose.models.User) {
//   delete mongoose.models.User;
// }

// export const User = mongoose.model("User", UserSchema);
