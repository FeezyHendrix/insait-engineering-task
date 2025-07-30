import { NextFunction, Request, Response } from 'express';
import constants, { baseUrlPrefix } from '../constants';
import logger from '../libs/pino';
import jwt from 'jsonwebtoken';
import { OperationalError } from '../utils/error';
import { getConfigAxiosInstance } from '../utils/configAxios';
import { extractTenant } from '../utils/extractTenant';

export const getCompanyConfig = async (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith(`${baseUrlPrefix}/health`)) {
    return next();
  }

  const company = extractTenant(req)

  if (!company) {
    return next(new OperationalError("No subdomain, header company, or tenant found", new Error("No subdomain, header company, or tenant found")));
  };
  if (!constants.COMPANY_CONFIG_SECRET) {
    return next(new OperationalError("Config secret not found", new Error("Config secret not found")));
  }
  const token = jwt.sign({ name: company }, constants.COMPANY_CONFIG_SECRET);
  const authHeader = `Bearer ${token}`
  try {
    const configInstance = getConfigAxiosInstance(authHeader)
    const configResponse = await configInstance.get(`?name=${company}&product=admin&section=api`);

    if (!configResponse.data) {
      logger.error("Bad response from config service");

      return next(new OperationalError("Company config not found", new Error("Company config not found")));
    }
    res.locals.companyConfig = configResponse.data.data;
    res.locals.companyConfig.company = company
    next();
  } catch (e) {
    logger.error(`Error fetching company config: ${e}`);
    if (!res.headersSent) {
      logger.error("Headers not sent");
      return next(new OperationalError("Error fetching company config", new Error("Error fetching company config")));
    }
  }
};
