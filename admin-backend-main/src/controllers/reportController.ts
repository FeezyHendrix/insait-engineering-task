
import { RequestHandler } from 'express';
import tryCatch from '../utils/tryCatch';
import { ValidationError } from '../utils/error';
import { createClickUpTicket, updateClickupTicket } from '../utils/reportUtil';
import { deleteTicketFromDb, createSupportComment, fetchSupportTicketById, createOrUpdateSupportTicket, getReportPagesWithPagination,  } from '../models/reportModel';
import logger from '../libs/pino';
import constants,{ extractedSupportEmails } from '../constants';
import { ChangedValueType, CreateReportEmailType, MulterFile, ReportPaginationParams, tableOptions, TicketRequestType, TicketStatus, TicketType } from '../types/interfaces';
import { calculatePagination, validatePaginationData } from '../services/pagination';
import { ClickupServices } from '../services/clickupServices';

export const deleteTicket: RequestHandler = tryCatch(async (req, res) => {
    const ticketId = req.params.ticketId;
    const deletion = await deleteTicketFromDb(ticketId);
    if (!deletion.status) {
        const message = `Error deleting ticket ${ticketId}: ${deletion.message}`
        deletion.message = message;
        logger.error(message)
        return res.status(400).json(deletion)
    }
    const message = `Ticket ${ticketId} deleted successfully`;
    logger.info(message)
    return res.status(200).json(deletion)
});

export const addNewComment: RequestHandler = tryCatch(async (req, res) => {
    const files = Array.isArray(req.files) ? req.files : [];
    const data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
    const { text, username: sender, supportId, ticketCommentUrl } = data ?? {};
    if (!text || !sender || !supportId) {
        throw new ValidationError(`Invalid request data for support comment`)
    }

    const comment = await createSupportComment({ text, sender, supportId, ticketCommentUrl, files });

    const { statusCode, ...userResponse } = comment

    return res.status(statusCode).json(userResponse);

});

export const getSupportTicketById: RequestHandler = tryCatch(async (req, res) => {

    const { ticketId } = req.params;    
    const response = await fetchSupportTicketById(ticketId);
    const { statusCode, ...userResponse } = response
    return res.status(statusCode).json(userResponse);

});

export const updateTicket: RequestHandler = tryCatch(async (req, res) => {
    const { id, message, subject, chatURL, companyName, priority, requestType, status, notificationEmails, username: sender} = req.body.data ?
    req.body.data as CreateReportEmailType : 
    req.body as CreateReportEmailType
    if (
        !sender || !subject || !companyName || !priority || !requestType
        
    ) {
        throw new ValidationError(`Invalid request data for ticket update`)
    }

    const startDate = new Date().getTime()
    const emailsToSend = notificationEmails && [...extractedSupportEmails, ...notificationEmails]
    type TicketValues = {
        message: string;
        subject: string;
        chatURL?: string ;
        priority: string;
        status?: TicketStatus,
        requestType?: TicketRequestType,
    };
    const oldTicket: TicketType = await fetchSupportTicketById(id);
    const newTicketValues: TicketValues = {message, subject, chatURL, priority, requestType, status};
    const oldTicketValues: TicketValues = {
        message: oldTicket.data?.message || '',
        subject: oldTicket.data?.subject || '',
        chatURL: oldTicket.data?.chatURL || '',
        priority: oldTicket.data?.priority || '',
        requestType: oldTicket.data?.requestType,
        status: oldTicket.data?.status || undefined
    };
    const changedValues: ChangedValueType = (Object.keys(newTicketValues) as (keyof TicketValues)[]).reduce((changes: ChangedValueType, key: keyof TicketValues) => {
        const oldValue = oldTicketValues[key] ?? '';
        const newValue = newTicketValues[key] ?? '';
        if (newValue !== oldValue) {
            changes[key] = {
                old: oldValue,
                new: newValue
            };
        }
        return changes;
    }, {} as ChangedValueType);

    const supportData = await createOrUpdateSupportTicket({ id, subject, message, chatURL, companyName, sender, startDate, priority, status, notificationEmails, requestType });    
    const clickupUrl =supportData.data.ticketURL;
    const clikcupTicketId = supportData.data.id;    
    const urlOrigin = req.headers.origin;
    const adminTicketUrl = urlOrigin ? `${urlOrigin}/support/ticket?page=1&ticketId=${clikcupTicketId}` : (() => { logger.error(`urlOrigin is missing`); })();
    if (Object.keys(changedValues).length === 0) return res.status(200).json({ status: true, message: 'No changes detected', data: null, statusCode: 200 });
    emailsToSend?.forEach(userRecipientEmail => {
        // sendTicketEmail({ id, subject, companyName, sender, ticketURL: adminTicketUrl, userRecipientEmail, changedValues, clickupUrl } as CreateReportEmailType);
    })
  
    if (!status) return res.status(400).json('Error: status is missing') ;
    updateClickupTicket(subject, message, clickupUrl, status, priority, requestType, chatURL);
    const { statusCode, ...userResponse } = supportData
    return res.status(statusCode).json(userResponse);
});

export const createTicket: RequestHandler = tryCatch(async (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];

  const rawData = req.body.data ?? req.body;
  let data;
  try {
    data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
  } catch (e) {
    logger.error('Error parsing req.body.data:', rawData);
    throw new ValidationError('Invalid request body format');
  }

  const {
    message,
    subject,
    chatURL,
    companyName,
    priority,
    requestType,
    status,
    notificationEmails,
    username: sender,
  } = data ?? {};
  if (!sender || !subject || !companyName || !requestType || !priority) {
    throw new ValidationError(`Invalid request data for ticket creation`);
  }

  const { hostname } = req;
  const chatURLNoProtocol = chatURL?.replace(/(^\w+:|^)\/\//, '');
  if (chatURLNoProtocol && !chatURLNoProtocol.startsWith(hostname)) {
    throw new ValidationError(
      `Invalid chatURL: "${chatURL}" doesn't start with "${hostname}..."`
    );
  }

  const startDate = new Date().getTime();
  const supportData = await createOrUpdateSupportTicket({
    subject,
    message,
    chatURL,
    companyName,
    sender,
    startDate,
    priority,
    requestType,
    status,
    notificationEmails,
  });

  const ticketId = supportData.data?.id;

  const clickUpUrl = await createClickUpTicket({
    id: ticketId,
    subject,
    message,
    chatURL,
    companyName,
    sender,
    startDate,
    priority,
    requestType,
  });

  const urlOrigin = req.headers.origin;
  const adminTicketUrl = urlOrigin
    ? `${urlOrigin}/support/ticket?page=1&ticketId=${ticketId}`
    : (() => {
        logger.error(`urlOrigin is missing`);
        return null;
      })();

  await createOrUpdateSupportTicket({
    id: ticketId,
    subject,
    message,
    chatURL,
    companyName,
    sender,
    startDate,
    ticketURL: clickUpUrl,
    priority,
    requestType,
    status,
    notificationEmails,
  });

  const emailsToSend = [...extractedSupportEmails, ...notificationEmails]
    emailsToSend.forEach(userRecipientEmail => {
        // sendTicketEmail({ id: ticketId, subject, companyName, message, chatURL, sender, ticketURL: adminTicketUrl, startDate, priority, userRecipientEmail, requestType, clickupUrl:clickUpUrl});
    })
  const clickupTaskId = clickUpUrl?.split('/').pop();
  if (clickupTaskId) {
    const clickupService = new ClickupServices();
    await clickupService.attachFilesToTask(clickupTaskId, files);
  }
  const { statusCode, ...userResponse } = supportData;
  return res.status(statusCode).json(userResponse);
});

export const controlSupportPages : RequestHandler = tryCatch(async (req, res, next) =>{
    const {
        limit = constants.PAGINATION.DEFAULT_LIMIT,
        order = constants.PAGINATION.DEFAULT_ORDER,
        search = constants.PAGINATION.DEFAULT_SEARCH, 
        orderBy = constants.PAGINATION.DEFAULT_ORDER_BY,
        page = constants.PAGINATION.DEFAULT_PAGE,
        endpointType = 'tickets',
        status,
        priority,
    } = req.query as {
        limit?: string, 
        order?: string, 
        search?: string, 
        orderBy?: string,
        comments?:string,
        page: string,
        endpointType?: tableOptions,
        status?: string,
        priority?: string,
    };
    const pageNumber: number = parseInt(page) || parseInt(constants.PAGINATION.DEFAULT_PAGE);
    const limitNumber: number = parseInt(limit);
    const { isDataValid, error } = validatePaginationData(pageNumber, limitNumber, order, orderBy, endpointType as tableOptions);
    if(!isDataValid) throw new ValidationError(error)
    logger.info(`Getting tickets on page ${pageNumber} with ${limit} items per page, ordered ${
        order === 'asc' ? 'ascending' : 'descending'
    } by ${orderBy}${search ? `, searching for '${search}'` : ''}`);

    const params: ReportPaginationParams = {
            pageNumber,
            limitNumber,
            order,
            orderBy,
            search,
            status,
            priority,
        };
    const { allReports, totalRecords } = await getReportPagesWithPagination(params);
    const { totalPages, nextPage, previousPage } = calculatePagination(totalRecords, allReports.length, pageNumber, limitNumber)

    const response = {
        "data": allReports,
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