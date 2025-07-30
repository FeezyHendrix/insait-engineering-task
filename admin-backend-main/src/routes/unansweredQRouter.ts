import { getUnansweredQsByConversation, postUnansweredQ, deleteUnansweredQ, updateUnansweredQArchive } from "../controllers/unansweredQsController";
import express from "express";

const unansweredQsRouter = express.Router();
unansweredQsRouter.get("/getUnansweredQs", getUnansweredQsByConversation)
unansweredQsRouter.post("/addUnansweredQ", postUnansweredQ)
unansweredQsRouter.delete("/delete/:unansweredQId", deleteUnansweredQ)
unansweredQsRouter.put("/archive", updateUnansweredQArchive)
export default unansweredQsRouter;