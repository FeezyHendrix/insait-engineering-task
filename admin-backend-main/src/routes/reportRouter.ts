import express from "express";
import { deleteTicket, addNewComment, getSupportTicketById, updateTicket, createTicket, controlSupportPages } from "../controllers/reportController";
import { allowedMimeTypesMedia, uploadFile } from "../middlewares/FileMulter";
import { mimeTypeMediaSize } from "../constants";
import isUserAuthenticated from "../middlewares/auth";

const uploadMiddleware = uploadFile(mimeTypeMediaSize, allowedMimeTypesMedia, 'files', 300);


const reportRouter = express.Router();
reportRouter.get("/getAll", controlSupportPages)
reportRouter.get("/:ticketId", getSupportTicketById)
reportRouter.put("/ticket", updateTicket)
reportRouter.post("/ticket", uploadMiddleware,isUserAuthenticated, createTicket)
reportRouter.post("/comment", uploadMiddleware,isUserAuthenticated, addNewComment)
reportRouter.delete("/delete/:ticketId", deleteTicket)

export default reportRouter;
