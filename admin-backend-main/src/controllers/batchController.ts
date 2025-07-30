
import { RequestHandler } from 'express';
import tryCatch from '../utils/tryCatch';
import { OperationalError, ValidationError } from '../utils/error';
import constants from '../constants';
import logger from '../libs/pino';
import { extractBatchParams } from '../utils/batchUtils';
import { fetchWhatsappTemplates } from '../services/batchServices';
import { addBatchMessage, getBatchSentCount } from '../models/batchModel';

// export const emailClient = require('@getbrevo/brevo');
// export const emailApiInstance = new emailClient.TransactionalEmailsApi();
// let apiKey = emailApiInstance.authentications['apiKey'];
// apiKey.apiKey = constants.BREVO_API_KEY;

const accountSid = constants.TWILIO_ACCOUNT_SID;
const authToken = constants.TWILIO_AUTH_TOKEN;
export const twilioClient = accountSid && authToken ? require('twilio')(accountSid, authToken) : null;


export const sendBatch : RequestHandler = tryCatch(async (req, res, next) => {
    const currentBatchSentCount: number = await getBatchSentCount();
    if (currentBatchSentCount  < 0) {
        const errorMessage = `Failed to get current batch sent count`;
        throw new OperationalError(errorMessage, new Error(errorMessage));
    }
    const maxBatchSentCount = res.locals.companyConfig?.batch_message_limit;
    if (maxBatchSentCount && currentBatchSentCount >= maxBatchSentCount) {
        const errorMessage = `Max batch messages limit reached. Current: ${currentBatchSentCount}, Max: ${maxBatchSentCount}`;
        logger.error(errorMessage);
        return res.json({ error: errorMessage });
    };
    const { type, defaultMessage, username: sender, subject, messageData }: { 
        type: string; 
        defaultMessage: string; 
        username: string; 
        subject: string; 
        messageData: { message: string | null, phone?: string, email?: string }[]; 
    } = req.body.data ?? req.body;
    const twilioFromPhone = res.locals.companyConfig?.twilio_from_phone;
    const messageRequestCount = messageData.length;
    let successCount = 0;
    logger.info(`Sending ${messageRequestCount} ${type} messages...`);
    if (!messageData) throw new ValidationError(`Invalid request params. provide message data`);
    try {
        for (const messageDataItem of messageData) {
            const { recipientType, requiredFields, sendFunction, sendFunctionParams } = extractBatchParams(type, messageDataItem, subject, sender, twilioFromPhone);
            if (!messageDataItem || requiredFields.some((field) => !field)) {
                logger.error(`Invalid request params for ${messageDataItem.email || messageDataItem.phone}. Missing required fields for ${type} message`);
                continue;
            }
            const messageToSend = messageDataItem.message || defaultMessage;
            if (!messageToSend) {
                logger.error(`Invalid request params for ${messageDataItem.email || messageDataItem.phone}. No individual or default message provided`);
                continue;
            }
            try {
                await sendFunction(messageToSend, ...sendFunctionParams);
                logger.info(`${type} with message ${messageToSend.substring(0, 20)}... sent to ${recipientType}`);
                successCount++;
                addBatchMessage(type, messageToSend, sender, [recipientType], subject);
            } catch (error: any) {
                logger.error(`Error sending ${type} message to ${recipientType}: ${error.message}`);
                continue
            }
        }
        if (successCount !== messageRequestCount) {
            const errorMessage = `Failed to send ${messageRequestCount - successCount} ${type} messages`;
            throw new OperationalError(errorMessage, new Error(errorMessage));
        };
        return res.json({
            result: `${successCount} ${type}s sent`,
            successes: successCount,
            errors: messageRequestCount - successCount
        });
    } catch (error: any) {
        return res.status(400).json({
            error: error.message,
            successes: successCount,
            errors: messageRequestCount - successCount
        });
    };
});

export const getWhatsappTemplates: RequestHandler = tryCatch(async (req, res, next) => {
    const whatsappTemplates = await fetchWhatsappTemplates()
    if (!whatsappTemplates) return
    let whatsappTemplateTexts = whatsappTemplates.contents.map((element: any) => {
        return element.types['twilio/text'].body
    });
    res.json({ whatsappTemplateTexts });
});
