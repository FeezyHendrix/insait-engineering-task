import { CreateReportEmailType, CreateSupportCommentType, TicketType, TicketPriority, TicketStatus, ReportPaginationResult, SearchReportType, ReportPaginationParams, MulterFile } from "../types/interfaces"
import logger from '../libs/pino';
import { failedResponse, serviceErrorHandler, successResponse } from "../utils/reportUtil";
import { extractedSupportEmails } from '../constants';
import { prisma } from "../libs/prisma";
import { generateReportOrderBy, generateTicketFilters } from "../services/pagination";
import { OperationalError } from "../utils/error";
import { ClickupServices } from "../services/clickupServices";

export const createOrUpdateSupportTicket = async (data: CreateReportEmailType) => {
  try {
    const { id, subject, sender, companyName, message, chatURL, ticketURL, priority, status, notificationEmails, requestType} = data;
    const ticketData = {
      subject,
      sender: sender ?? "",
      companyName,
      message,
      chatURL,
      priority: priority || TicketPriority.normal,
      notificationEmails,
      requestType,
      status: status || TicketStatus.toDo,
      ...(ticketURL && { ticketURL: ticketURL }),
    };

    const newTicket = await prisma.support.upsert({
      where: {
        id: id || -1,
      },
      update: ticketData,
      create: ticketData,
    });

    const action = id ? 'updated' : 'added';
    logger.info(`Support Ticket ${newTicket.id} ${action} in database`);
    return successResponse(newTicket)
  } catch (error) {
    return serviceErrorHandler("createSupportTicket", error, 'Creating Ticket failed');
  }
}

export const deleteTicketFromDb = async (ticketId: string) => {
  try {
    await prisma.support.delete({
      where: {
        id: parseInt(ticketId)
      }
    });
    return successResponse(null, `Ticket ${ticketId} deleted successfully`)
  } catch (error) {
    return serviceErrorHandler("deleteTicketFromDb", error, 'Deleting Ticket failed');
  }
};

export const createSupportComment = async (data: CreateSupportCommentType, files: MulterFile[] = []) => {
  try {
    const { text, sender, supportId, ticketCommentUrl, files = [] } = data;
    const supportIdInt = Number(supportId);

    const support = await prisma.support.findUnique({
      where: { id: supportIdInt },
      select: { commentHistory: true, subject: true, companyName: true, notificationEmails: true, message: true, chatURL: true, ticketURL: true },
    });

    if (!support) {
      return failedResponse("No related support ticket", support)
    }

    const ticketData = {
      text,
      sender,
      support: {
        connect: { id: supportIdInt }
      }
    };

    const commentHistory = `${support.commentHistory || ''}\n${sender}: ${text}`.trim();

    const [ticketComment] = await prisma.$transaction(async () => {
      const comment = await prisma.comment.create({
        data: ticketData,
      });

      const updatedSupport = await prisma.support.update({
        where: { id: supportIdInt },
        data: {
          commentCount: { increment: 1 },
          commentHistory: commentHistory,
        },
      });

      return [comment, updatedSupport];
    });

    const clickupTaskId = support.ticketURL?.split('/').pop();
    if (clickupTaskId && files.length) {
      const clickupService = new ClickupServices();
        await clickupService.attachFilesToTask(clickupTaskId, files)
      
    }

    const emailsToSend = [...extractedSupportEmails, ...support.notificationEmails]

    emailsToSend.map(userRecipientEmail => {
      // sendTicketEmail({
      //   id: supportIdInt,
      //   subject: support.subject,
      //   newComment: data.text,
      //   companyName: support.companyName,
      //   ticketURL: ticketCommentUrl,
      //   chatURL: support.chatURL || '',
      //   message: support.message,
      //   sender,
      //   userRecipientEmail,
      //   startDate: new Date().getTime(),
      // });
    })

    logger.info(`Support Comment ${ticketComment.id} added to database`);

    return successResponse(ticketComment);
  } catch (error) {
    return serviceErrorHandler("createSupportComment", error, 'Creating Comment failed');
  }
}
export const fetchSupportTicketById = async (supportId: number | string | undefined): Promise<TicketType> => {
  try {
    const supportIdInt = Number(supportId);
    const supportTicket = await prisma.support.findUnique({
      where: { id: supportIdInt },
      select: {
        id:true,
        comments: true,
      }
    });

    if (!supportTicket) {
      return failedResponse("No related support ticket", supportTicket);
    }

    return successResponse({ ...supportTicket }); 

  } catch (error) {
    return serviceErrorHandler("createSupportComment", error, 'Fetching Ticket failed');
  }
};

export const getReportPagesWithPagination = async (params: ReportPaginationParams): Promise<ReportPaginationResult> => {
  const {
    pageNumber,
    limitNumber,
    order,
    orderBy,
    search,
    status,
    priority,
  } = params;
  const searchParam = search?.toLocaleLowerCase() || "";
  const generatedOrderBy = generateReportOrderBy(orderBy, order); 
  const filter = generateTicketFilters(searchParam, status, priority);

  try {
   const reports = await prisma.support.findMany({
      where: filter,
      orderBy: generatedOrderBy,
      take: limitNumber,
      skip: limitNumber * (pageNumber - 1),
      select: {
        id: true,
        subject: true,
        sender: true,
        companyName: true,
        message: true,
        chatURL: true,
        ticketURL: true,
        priority: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        comments: {
          select: {
            id: true,
            text: true,
            sender: true,
            createdAt: true,
            supportId: true,
          }
        },
        notificationEmails: true,
        commentHistory: true,
        commentCount:true,
        requestType: true,
      }
    });

    const reportCount = await prisma.support.count({
      where: filter,
    })
    return { allReports: reports, totalRecords: reportCount };
    
  } catch (error: any) {
    throw new OperationalError("Somthing is wrong with the report model", error);
  }

};
