import express from "express"
import rateLimit from "express-rate-limit";
import { RATE_LIMIT } from "../constants";
import { getCurrentIDPData, getFlowStatus, postLoginPreference } from "../controllers/loginPreferencesController";

const loginPreferencesRouter = express.Router()
const postLimiter = rateLimit(RATE_LIMIT);

loginPreferencesRouter.get('/flowStatus/:prefectFlowId', getFlowStatus);
loginPreferencesRouter.post('/currentIDPData', getCurrentIDPData);
loginPreferencesRouter.use(postLimiter);
loginPreferencesRouter.post('/', postLoginPreference);

export default loginPreferencesRouter