import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default:'active',
        required: true
    },
    video_url:{
        type: String,
        required: true
    },
    tags:{
        type: [String],
        required: true
    },
    category:{
        type: String,
        required: true
    },
    videoLength:{
        type: Number,
        required: true
    },
    total_seen: { type: Number, default: 0 }
},{timestamps: true});

export default mongoose.model('Faq', faqSchema);
