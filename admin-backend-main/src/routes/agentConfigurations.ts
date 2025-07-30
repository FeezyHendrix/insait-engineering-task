import express from "express";
import { getAgentConfiguration, updateAgentConfiguration, uploadAgentAvatar } from '../controllers/agentConfigurationController';
import { allowedMimeTypesAvatars, uploadFile } from "../middlewares/FileMulter";
import { mimeTypeAvatarSize } from "../constants";

const agentConfigurationsRouter = express.Router();
agentConfigurationsRouter.get("/" , getAgentConfiguration)
agentConfigurationsRouter.put("/" , updateAgentConfiguration)
agentConfigurationsRouter.post(
    "/uploadAvatar", 
    uploadFile(mimeTypeAvatarSize, allowedMimeTypesAvatars, 'file', 1),
    uploadAgentAvatar
)
export default agentConfigurationsRouter;