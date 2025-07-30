import { RequestHandler } from 'express';
import tryCatch from '../utils/tryCatch';
import { fetchSecurityViolationMessages } from '../models/securityViolationMessagesModel'

export const getSecurityViolationMessages: RequestHandler = tryCatch(async (req, res) => {
    const data = await fetchSecurityViolationMessages();
    res.json(data);
});
