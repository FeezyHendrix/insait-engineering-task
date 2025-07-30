
import { getFeedbackMessagesAndRating } from "../controllers/feedbackMessagesController"
import express from "express"

const feedbackMessagesAndRatingRouter = express.Router()

feedbackMessagesAndRatingRouter.get("/getAllFeedbackMessages", getFeedbackMessagesAndRating)

export default feedbackMessagesAndRatingRouter