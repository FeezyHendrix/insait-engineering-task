import express from "express"
import { getSecurityViolationMessages } from "../controllers/securityViolationMessagesController"

const securityViolationMessagesRouter = express.Router()

securityViolationMessagesRouter.get("/getAll", getSecurityViolationMessages);

export default securityViolationMessagesRouter