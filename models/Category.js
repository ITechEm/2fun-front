import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },

  properties: {
    type: Object,
    default: {},
  },

  visible: {
    type: Boolean,
    default: true,
  },
});


export const Category =
  mongoose.models?.Category ||
  mongoose.model("Category", CategorySchema);