import express from "express"
import { getChartForAdmin } from "../controllers/chartController";

const chartsRouter = express.Router()

chartsRouter.get('/:chartType', getChartForAdmin);

export default chartsRouter