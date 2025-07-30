import { prisma } from '../libs/prisma';
import logger from '../libs/pino';

export const fetchAddTemplate = async ( title: string, text: string ) => {
    try {
      const newTemplate = await prisma.templates.create({
        data: {
            title: title,
            text: text,
        }
      });
      logger.info(`template ${title} added to database`)
      return newTemplate
  } catch (error) {
    logger.info(error)
    return error
  }};

  export const fetchAllTemplates = async () => {
    const allTemplates = await prisma.templates.findMany();
    if (allTemplates.length === 0) {
      return []
    } else {
      return allTemplates
    }
  };


  export const fetchDeleteTemplateById = async (templateId: number) => {
    await prisma.templates.delete({
        where: {
          templateId: templateId,
        },
    });
  };