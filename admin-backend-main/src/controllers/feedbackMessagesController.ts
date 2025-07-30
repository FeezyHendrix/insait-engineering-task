import { RequestHandler } from 'express';
import tryCatch from '../utils/tryCatch';
import { fetchFeedbackMessagesModel } from '../models/feedbackMessagesmodel';

export const getFeedbackMessagesAndRating: RequestHandler = tryCatch(async (req, res, next) => {
    const data = await fetchFeedbackMessagesModel()
    res.json(data)
})