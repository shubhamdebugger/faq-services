import mongoose from "mongoose";

const categoryUniqueSearch = new mongoose.Schema(
  {
    search: {
      type: String,
      required: true,
      unique: true,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("categoryUniqueSearch", categoryUniqueSearch);
