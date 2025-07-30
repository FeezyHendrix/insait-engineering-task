import { UnansweredQType } from '../types/interfaces';
import logger from '../libs/pino';
import { prisma } from '../libs/prisma';

export const fetchUnansweredQs = async (page: number = 1, limit: number, startTime?: string, endTime?: string) => {
    const skip = (page - 1) * limit
    const take = limit
    const whereClause = startTime || endTime ? {
        createdAt: {
          ...(startTime && { gte: startTime }),
          ...(endTime && { lte: endTime }),
        },
      } : undefined;
    

    const [total, data] = await prisma.$transaction([
        prisma.unansweredQuestion.count({ where: whereClause }),
        prisma.unansweredQuestion.findMany({ 
            skip, 
            take,
            where: whereClause,
            orderBy: {
                createdAt: 'desc',
            }, 
        })
    ]);
    return { total, data }
}

export const addUnansweredQToDatabase = async (receivedUnansweredQ: UnansweredQType) => {
    try {
        const { unansweredQId, conversationId, question, answer, reason, createdAt, archive } = receivedUnansweredQ
        const newQuestion = await prisma.unansweredQuestion.create({
            data: {
                unansweredQId: unansweredQId,
                conversationId: conversationId,
                question: question,
                answer: answer,
                reason: reason,
                createdAt: createdAt,
                archive: archive
            }
        })
        const successMessage =`unanswered question ${newQuestion.unansweredQId}, from conversation ${newQuestion.conversationId}, added to database`;
        logger.info(successMessage)
        return {status:201, msg: successMessage};
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessages: {[errorCode: string]: string} = {
            P2002: `The unanswered question id: ${receivedUnansweredQ.unansweredQId} from conversation id ${receivedUnansweredQ.conversationId} already exists and was not added to the database.`,
            P2025: `No conversation found with id: ${receivedUnansweredQ.conversationId}. Unable to add the unanswered question.`,
        };
        if (errorCode === 'P2002') {
            logger.info(errorMessages[errorCode]);
            return { status: 409 ,msg: errorMessages[errorCode]};
        }
        logger.error(errorMessages[errorCode] || 'An unknown error occurred:', { error });
        throw error;
    }
}

export const deleteUnansweredQFromDatabase = async (qId: string) => {
    try {
        await prisma.unansweredQuestion.delete({
            where: {
                unansweredQId: qId
            }
        })
        logger.info(`unanswered question ${qId} removed from database`)
    } catch (error) {
        logger.info(error)
        return error
}}  

export const updateUnansweredQArchiveInDatabase = async (qId: string, archive: boolean) => {    
    try {
        await prisma.unansweredQuestion.update({
            where: {
                unansweredQId: qId
            },
            data: {
                archive: archive
            }
        })
        logger.info(`unanswered question ${qId} ${archive ? "archived" : "unarchived"}`)
    } catch (error) {
        logger.info(error)
        return error
}}  