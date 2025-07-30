import { RequestHandler } from "express"
import tryCatch from "../utils/tryCatch"
import { MulterFile } from "../types/interfaces"
import { AuthError, ValidationError } from "../utils/error"
import { fetchAgentEditableConfigurations, updateAgentConfigurationService, uploadAgentAvatarFile } from "../services/agentConfigurationsServices"
import logger from "../libs/pino"

export const getAgentConfiguration : RequestHandler = tryCatch(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) throw new AuthError('Missing Token');
  
  const tenant = res.locals.companyConfig.company;
  if (!tenant) throw new Error('Missing tenant information');
  logger.info(`Fetching editable configurations for ${tenant}`)

  const data = await fetchAgentEditableConfigurations(authHeader, tenant);
  res.status(200).json({ data });
})

export const updateAgentConfiguration: RequestHandler = tryCatch(async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) throw new AuthError('Missing token');

  const tenant = res.locals.companyConfig.company;
  if (!tenant) throw new Error('Missing tenant information');

  const editable =
  req.body.editable ??
  req.body.data?.editable;

  if (!editable || typeof editable !== 'object' || Object.keys(editable).length === 0) {
    throw new ValidationError('No editable configuration provided.');
  }
  logger.info(`Updating editable configurations for ${tenant}`)

  const result = await updateAgentConfigurationService(authHeader, tenant, editable);

  res.status(200).json({ message: 'Configuration updated', data: result });
});

export const uploadAgentAvatar: RequestHandler = tryCatch(async (req, res) => {
  const files = req.files as MulterFile[];
  const file = files?.[0];
  const tenant = res.locals.companyConfig.company;

  if (!file) throw new ValidationError('File not uploaded');

  logger.info(`Uploading avatar image for ${tenant}`)

  const { url } = await uploadAgentAvatarFile(tenant, file);
  res.json({ url });
});