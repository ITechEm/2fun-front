import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema({
  orderNumber: { type: String, unique: true },
  userEmail: String,
  line_items: Object,
  name: String,
  email: String,
  phone: { type: Number, required: true },
  streetAddress: String,
  city: String,
  postalCode: String,
  country: String,
  isApproved: { type: Boolean, default: false },
  paid: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["Cancelled", "Pending", "In Progress", "In Delivery", "Delivered"],
    default: "Pending",
  },
}, {
  timestamps: true,
});

export const Order = models?.Order || model("Order", OrderSchema);
