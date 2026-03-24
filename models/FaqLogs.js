import mongoose from "mongoose";

const faqLogsSchema = new mongoose.Schema({
    faq_id:   { type: mongoose.Schema.Types.ObjectId, ref: "Faq", required: true },
    user_id:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seen_at: { type: Date, required: true}
  },{timestamps:true});
  
  // IMPORTANT: prevent duplicate seen logs for same user + message
  faqLogsSchema.index({ faq_id: 1, user_id: 1 }, { unique: true });

 export default mongoose.model("FaqLogs", faqLogsSchema);
