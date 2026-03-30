import mongoose from "mongoose";

const LogoutFeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    experience: {
      type: String,
      required: true,
      enum: ["very poor", "poor", "neutral", "good", "very good"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("LogoutFeedback", LogoutFeedbackSchema);
