import { sendBatch, getWhatsappTemplates } from "../controllers/batchController";
import upload from '../middlewares/multer';
import express from "express";
import getContactEntries from "../middlewares/csvParser";

const batchRouter = express.Router();
batchRouter.post("/send", upload.single('csv'), getContactEntries , sendBatch)
batchRouter.get("/getTemplates", getWhatsappTemplates)
export default batchRouter;