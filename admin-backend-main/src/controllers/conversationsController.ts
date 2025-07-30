import { RequestHandler } from "express";
import tryCatch from "../utils/tryCatch";
import { calculatePagination, validatePaginationData } from "../services/pagination";
import logger from "../libs/pino";
import { addOrUpdateConversation, addOrUpdateProduct, addOrUpdateUser, getConversationsWithPagination, fetchConversationById, getConversationPagesWithPagination, fetchFileByUrl, addOrUpdateLink, deletePIIFromDb, getAllProducts, addOrUpdateFlow, getAllUsedFlows } from "../models/conversationsModel";
import constants from "../constants";
import { Link, PaginationParams } from "../types/interfaces";
import { ValidationError } from "../utils/error";
import { resetOldConversationsFromDb } from "../models/conversationsModel";


export const controlConversations : RequestHandler = tryCatch(async (req, res, next) => {
    const { 
        page = constants.PAGINATION.DEFAULT_PAGE, 
        limit = constants.PAGINATION.DEFAULT_LIMIT, 
        order = constants.PAGINATION.DEFAULT_ORDER, 
        search = constants.PAGINATION.DEFAULT_SEARCH, 
        minimumMessageCount = 0, 
        botSuccessOnly = constants.PAGINATION.DEFAULT_BOT_SUCCESS_ONLY, 
        orderBy = constants.PAGINATION.DEFAULT_ORDER_BY, 
        startTime, 
        endTime 
    } = req.query as { 
        page?: string, 
        limit?: string, 
        order?: string, 
        search?: string, 
        minimumMessageCount?: string, 
        botSuccessOnly?: string, 
        orderBy?: string, 
        startTime?: string, 
        endTime?: string 
    };
    const pageNumber: number = parseInt(page);
    const limitNumber: number = parseInt(limit);    
    const botSuccessOnlyBool: boolean = botSuccessOnly === 'true';
    const { isDataValid, error } = validatePaginationData(pageNumber, limitNumber, order, orderBy, 'conversations', startTime, endTime);  
    if (!isDataValid) throw new ValidationError(error);
    const params: PaginationParams = {
        pageNumber,
        limitNumber,
        order,
        minimumMessageCount: minimumMessageCount as number,
        botSuccessOnlyBool,
        orderBy,
        search,
        startTime,
        endTime
    };
    
    const { allConversations, totalRecords } = await getConversationsWithPagination(params);
    const { totalPages, nextPage, previousPage } = calculatePagination(totalRecords, allConversations.length, pageNumber, limitNumber)
    const response = {
        "data": allConversations,
        "pagination": {
            "totalRecords": totalRecords,
            "currentPage": page,
            "totalPages": totalPages,
            "nextPage": nextPage,
            "previousPage": previousPage
        }
    }
    res.json(response)
});

export const upsertConversation: RequestHandler = tryCatch(async (req, res, next) => {
    const payload = req.body;
    const response = await addOrUpdateConversation(payload);
    res.json(response)
});

export const upsertUser: RequestHandler = tryCatch(async (req, res, next) => {
    const payload = req.body;
    const response = await addOrUpdateUser(payload);
    res.json(response)
});

export const upsertProduct: RequestHandler = tryCatch(async (req, res, next) => {
    const payload = req.body;
    const response = await addOrUpdateProduct(payload);
    res.json(response)
});

export const upsertFlow: RequestHandler = tryCatch(async (req, res, next) => {
    const { id: flowId, name: flowName } = req.body;
    if (!flowId || !flowName) {
        return res.status(400).json({ message: "No flow id or name provided" });
    };
    const response = await addOrUpdateFlow(flowId, flowName);
    res.json(response)
});

export const controlConversationById: RequestHandler = tryCatch(async (req, res, next) => {
    const { conversationId } = req.params;
    const response = await fetchConversationById(conversationId);        
    res.json(response)
});

export const getFileByUrl: RequestHandler = tryCatch(async (req, res) => {
    const { fileUrl } = req.params;

    if (!fileUrl) {
        throw new ValidationError(`Invalid request data for fetching file`)
    }
    const response = await fetchFileByUrl(fileUrl);
    const { statusCode, ...data } = response;         
    return res.status(statusCode).json(data);
});

export const controlConversationPages : RequestHandler = tryCatch(async (req, res, next) => {  
    const { 
        limit = constants.PAGINATION.DEFAULT_LIMIT, 
        order = constants.PAGINATION.DEFAULT_ORDER, 
        search = constants.PAGINATION.DEFAULT_SEARCH, 
        orderBy = constants.PAGINATION.DEFAULT_ORDER_BY,
        hasFeedbackOnly = constants.PAGINATION.DEFAULT_HAS_FEEDBACK_ONLY, 
        rating,
        sentiment,
        persona,
        node,
        botSuccessOnly = constants.PAGINATION.DEFAULT_BOT_SUCCESS_ONLY,
        startTime,
        endTime,
        flowId
    } = req.query as {
        limit?: string, 
        order?: string, 
        search?: string, 
        orderBy?: string, 
        hasFeedbackOnly?: string, 
        rating?: string, 
        sentiment?: string,
        node?: string,
        persona?: string,
        botSuccessOnly?: string,
        startTime?: string,
        endTime?: string,
        flowId?: string
    };    
    const pageNumber: number = parseInt(req.params.page) || parseInt(constants.PAGINATION.DEFAULT_PAGE);  
    const hasFeedbackOnlyBool: boolean = hasFeedbackOnly === 'true';
    const botSuccessOnlyBool = botSuccessOnly as string === 'true';
    const limitNumber: number = parseInt(limit);
    const { isDataValid, error } = validatePaginationData(pageNumber, limitNumber, order, orderBy,'conversations', startTime, endTime);  
    if (!isDataValid) throw new ValidationError(error)    
    const params: PaginationParams = {
        pageNumber,
        limitNumber,
        order,
        orderBy,
        search,
        sentiment,
        persona,
        node,
        rating,
        hasFeedbackOnlyBool,
        botSuccessOnlyBool,
        startTime,
        endTime,
        flowId
    };
    const { allConversations, totalRecords } = await getConversationPagesWithPagination(params);
    const { totalPages, nextPage, previousPage } = calculatePagination(totalRecords, allConversations.length, pageNumber, limitNumber)
    const response = {
        "data": allConversations,
        "pagination": {
            "totalRecords": totalRecords,
            "currentPage": pageNumber,
            "totalPages": totalPages,
            "nextPage": nextPage,
            "previousPage": previousPage
        }
    }
    res.json(response)
});

export const deleteOldConversations: RequestHandler = tryCatch(async (req, res, next) => {
    const cutoffHours = res.locals.companyConfig?.conversation_deletion_cutoff;
    if (!cutoffHours || cutoffHours === '') {
        const message = "Conversation deletion cutoff not found in configurations. Not deleting old conversations";
        logger.info(message);
        return res.json({ message});
    };
    
    const now = new Date();
    const cutoffTime: Date = new Date(now.getTime() - cutoffHours * 60 * 60 * 1000);
    if (isNaN(cutoffTime.getTime())) {
      const error = `Invalid cutoff time provided: '${cutoffHours}'`;
      logger.error(error);
      res.status(400).json({ message: error });
    };

    const response = await resetOldConversationsFromDb(cutoffTime)
    res.json(response);
});

export const upsertMultipleUsers: RequestHandler = tryCatch(async (req, res, next) => {
    const payload: {createdAt: string, userId: string, userAgent?: string, firstName?: string, lastName?: string }[] = req.body;
    if (!payload || !Array.isArray(payload) || !payload.length) return res.json({ successes: [], failures: [], message: 'No new users provided' });
    const successes: string[] = [];
    const failures: string[] = [];
    for (const user of payload) {
        const createdAtDate = new Date(user.createdAt);
        const response: any = await addOrUpdateUser({ id: user.userId, createdAt: createdAtDate, userAgent: user.userAgent, firstName: user.firstName, lastName: user.lastName });
        if (response.userId) successes.push(user.userId);
        else failures.push(user.userId);
    }
    res.json({ successes, failures });
});

export const upsertMultipleLinks: RequestHandler = tryCatch(async (req, res, next) => {
    const payload: Link[] = req.body;
    if (!payload || !Array.isArray(payload) || !payload.length) return res.json({ successes: [], failures: [], message: 'No new links provided' });
    const successes: string[] = [];
    const failures: string[] = [];
    for (const link of payload) {
        const response: any = await addOrUpdateLink(link);
        if (response.linkId) successes.push(link.linkId);
        else failures.push(link.linkId);
    }
    res.json({ successes, failures });
});

export const deletePII: RequestHandler = tryCatch(async (req, res, next) => {
    const hoursBackToDelete = res.locals.companyConfig?.mask_pii;
    if (!hoursBackToDelete) {
        logger.info("PII masking is not enabled. Not deleting PII")
        return res.json({ message: 'Admin BE not set to delete PII', count: 0 });
    };
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hoursBackToDelete);
    logger.info(`Deleting PII for conversations older than ${hoursBackToDelete} hours, before ${startTime}...`);
    const updatedConversationCount = await deletePIIFromDb(startTime);
    const responseMessage = `Deleted PII for ${updatedConversationCount} conversations, older than ${hoursBackToDelete} hours`;
    logger.info(responseMessage)
    res.json({ message: responseMessage, count: updatedConversationCount });
});

export const getProducts: RequestHandler = tryCatch(async (req, res, next) => {
    const products = await getAllProducts();
    res.status(200).json(products);
});

export const controlGetFlows: RequestHandler = tryCatch(async (req, res, next) => {
    const flows = await getAllUsedFlows();
    res.status(200).json(flows);
});
