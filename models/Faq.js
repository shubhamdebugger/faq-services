import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['active', 'inactive'],
        required: true
    },
    video_url:{
        type: String,
        required: true
    },
    tags:{
        type: String,
        required: true
    },
    category:{
        type: [String],
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
},{timestamps: true});

export default mongoose.model('Faq', faqSchema);
