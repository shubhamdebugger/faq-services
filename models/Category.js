import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("category", categorySchema);
