import { uploadKnowledge, getKnowledges, getKnowledgePages, deleteKnowledge, toggleKnowledgeActiveness, updateKnowledge } from '../controllers/knowledgeController';
import express from "express";
import multer from "multer"

const upload = multer({ dest: 'uploads/' })
const knowledgeRouter = express.Router();
knowledgeRouter.post("/uploadKnowledge", upload.single("file"), uploadKnowledge)
knowledgeRouter.put("/updateKnowledge", updateKnowledge)
knowledgeRouter.get("/getKnowledges", getKnowledges)
knowledgeRouter.get("/", getKnowledgePages)
knowledgeRouter.delete("/deleteKnowledge", deleteKnowledge)
knowledgeRouter.put("/toggleKnowledgeActiveness", toggleKnowledgeActiveness)
export default knowledgeRouter;