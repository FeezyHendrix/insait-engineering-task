import logger from '../libs/pino';
import { prisma } from "../libs/prisma";

export const addBatchMessage = async ( type: string, message: string, sender: string, recipients: string[], subject?: string ) => {
  try {
    recipients.forEach(async (recipient: string) => {
      const newMessage = await prisma.batchMessage.create({
        data: {
          type,
          message,
          sender,
          recipient,
          subject
        }
      });
      logger.info(`Batch Message ${newMessage.id} added to database`);
    });
  } catch (error) {
    logger.error(`Error adding batch message: ${error}`);
    return error;
  }
};

export const getBatchSentCount = async () => {
  try {
    const count: number = await prisma.batchMessage.count();
    return count;
  } catch (error) {
    logger.error(`Error getting batch sent count: ${error}`);
    return -1;
  }
}