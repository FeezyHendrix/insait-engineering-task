import express from "express"
import { getUserSettings, updateUserSettings } from "../controllers/userSettingsController";

const userSettingsRouter = express.Router()

userSettingsRouter.get('/', getUserSettings);
userSettingsRouter.put('/:field', updateUserSettings);
export default userSettingsRouter