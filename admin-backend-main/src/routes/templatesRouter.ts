import express from "express"
import {  getAllTemplates, addTemplate, deleteTemplateById } from "../controllers/templatesControllers"

const templatesRouter = express.Router()

templatesRouter.get("/getAll", getAllTemplates);
templatesRouter.post("/add", addTemplate); 
templatesRouter.delete("/delete/:templateId", deleteTemplateById); 

export default templatesRouter