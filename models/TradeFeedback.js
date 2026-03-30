import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: { type: String, required: true },
    message: { type: String, required: true },
    rating: { type: Number, required: true },
}, { timestamps: true });
export default mongoose.model('Feedback', feedbackSchema);
