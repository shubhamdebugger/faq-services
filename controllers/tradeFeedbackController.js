import Feedback from '../models/TradeFeedback.js';

export const submitFeedback = async (req, res) => {
    try {
        const { message, rating } = req.body;
        const user_id = req.user.id;
        const name = req.user.name;
        if (!message || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }
        if (!user_id || !name) {
            return res.status(400).json({
                success: false,
                message: 'User is not authorized',
            });
        }
        const feedback = await Feedback.create({
            user_id,
            name,
            message,
            rating,
        });
        return res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            feedback,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: 'Feedback fetched successfully',
            feedback,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
