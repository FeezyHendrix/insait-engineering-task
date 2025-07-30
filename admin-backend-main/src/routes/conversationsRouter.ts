import express from "express"
import { controlConversations, controlConversationById, upsertUser, upsertConversation, upsertProduct, controlConversationPages, deleteOldConversations, getFileByUrl, upsertMultipleUsers, upsertMultipleLinks, deletePII, getProducts, upsertFlow, controlGetFlows } from "../controllers/conversationsController";

const conversationsRouter = express.Router()

conversationsRouter.get('/allConversations', controlConversations);
conversationsRouter.get('/conversationPages/:page', controlConversationPages);
conversationsRouter.get("/fetchFile/:fileUrl", getFileByUrl);
conversationsRouter.get("/products", getProducts)
conversationsRouter.get("/flows", controlGetFlows);
conversationsRouter.get('/:conversationId', controlConversationById);
conversationsRouter.put("/addOrUpdate/conversation", upsertConversation);
conversationsRouter.put("/addOrUpdate/flow", upsertFlow);
conversationsRouter.put("/addOrUpdate/user", upsertUser);
conversationsRouter.put("/addOrUpdate/product", upsertProduct);
conversationsRouter.delete("/deleteOld", deleteOldConversations);
conversationsRouter.put("/addOrUpdate/multipleUsers", upsertMultipleUsers);
conversationsRouter.put("/addOrUpdate/multipleLinks", upsertMultipleLinks);
conversationsRouter.put("/deletePII", deletePII);

export default conversationsRouter