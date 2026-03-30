import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["category", "search"],
    required: true,
  },
  count: {
    type: Number,
    default: 1,
  },
},{timestamps: true});

export default mongoose.model("Category", categorySchema);