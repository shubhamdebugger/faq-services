import express from 'express';
import { submitFeedback, getFeedback } from '../controllers/tradeFeedbackController.js';
import { authorize } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/v1/submit-trade-feedback', authorize('user'), submitFeedback);
router.get('/v1/get-trade-feedback', authorize('admin'), getFeedback);

export default router;