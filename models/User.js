import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    faqId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faq",
    },
    duration: {
      type: Number,
      required: true,
    },
    videoLength: {
      type: Number,
      required: true,
    },
    isWatched: {
      type: Boolean,
      default: false,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    faq: [faqSchema],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
