import logger from '../libs/pino';
import { prisma } from "../libs/prisma";
import { OperationalError } from "../utils/error";
import { KnowledgePaginationParams, KnowledgePaginationResult, KnowledgeType } from "../types/interfaces";
// import { formatKnowledgeEmailTemplate, processEmailSending } from "../utils/email";
import constants from '../constants';
import { generateKnowledgeFilters, generateKnowledgeOrderBy } from "../services/pagination";
import { randomUUID } from 'crypto';
export const addKnowledgeToDatabase = async (data: KnowledgeType) => {
    try {
            const newKnowledge = await prisma.knowledge.create({
        data: {
            id: randomUUID(),
            question: data.question,
            answer: data.answer ?? '',
            url: data.url ?? '',
            createdAt: data.createdAt,
            product: data.product,
            active: true
        }
    })

    // DEPRECATED! const template = formatKnowledgeEmailTemplate(newKnowledge, 'added');
    // DEPRECATED! processEmailSending(`New Knowledge Base Item added - ${data.product}`, template, constants.INSAIT_DS_EMAIL)


    logger.info(`knowledge ${newKnowledge.id} added to database`)
    return newKnowledge
    } catch (error) {
        logger.info(error)
        return error
    }
}


export const getAllKnowledges = async () => {
    try {
        const allKnowledges = await prisma.knowledge.findMany();
        return allKnowledges
    } catch (error) {
        logger.info(error)
        return error
    }
} 
  
export const deleteKnowledgeFromDatabase = async (selectedKnowledge: KnowledgeType) => {
    try {
        const knowledgeId = selectedKnowledge.id
        const deletedKnowledge = await prisma.knowledge.delete({
            where: {
                id: knowledgeId
            }
        })
        // const template = formatKnowledgeEmailTemplate(deletedKnowledge, 'deleted');

        // DEPRECATED! processEmailSending(`Knowledge Base Item deleted - ${deletedKnowledge.product}`, template, constants.INSAIT_DS_EMAIL)

        logger.info(`Knowledge ${deletedKnowledge.id} deleted from database`)        
        return deletedKnowledge.id;
    } catch (error) {
        logger.error(`Error deleting knowledge: ${error}`);
        return error
    }
}

export const toggleKnowledgeActivenessInDatabase = async (selectedKnowledge: KnowledgeType) => {
    try {    
        const { id, active } = selectedKnowledge
        const toggledKnowledge = await prisma.knowledge.update({
            where: {
                id: id
            },
            data: {
                active: active
            }
        })
        // const template = formatKnowledgeEmailTemplate(toggledKnowledge, 'statusChanged');

        // DEPRECATED! rocessEmailSending(`Knowledge Base Status Changed - ${toggledKnowledge.product}`, template, constants.INSAIT_DS_EMAIL)


        logger.info(`Knowledge ${toggledKnowledge.id} set to ${toggledKnowledge.active ? "active" : "inactive"}`)
    } catch (error) {
        logger.error(`Error updating knowledge: ${error}`);
        return error
    }
}

export const updateKnowledgeInDatabase = async (selectedKnowledge: KnowledgeType) => {
    try {    
        const { id, question, answer } = selectedKnowledge
        const updatedKnowledge = await prisma.knowledge.update({
            where: { id },
            data: {
                question,
                answer: answer ?? '',
            }
        })
        // const template = formatKnowledgeEmailTemplate(updatedKnowledge, 'updated');


        // DEPRECATED! processEmailSending(`Knowledge Base Item Updated - ${updatedKnowledge.product}`,template, constants.INSAIT_DS_EMAIL)


        logger.info(`Knowledge with id ${updatedKnowledge.id} successfully updated.`);
        return updatedKnowledge
        } catch (error: any) {
        logger.error(`Error updating knowledge: ${error}`);
        return error
    }
};

export const getKnowledgePagesWithPagination = async (
    params: KnowledgePaginationParams & { skip?: number }
  ): Promise<KnowledgePaginationResult> => {
    const {
      pageNumber,
      limitNumber,
      order,
      orderBy,
      search,
      skip = (pageNumber - 1) * limitNumber,
    } = params;
  
    const searchParam = search?.toLocaleLowerCase() || "";
    const generatedOrderBy = generateKnowledgeOrderBy(orderBy, order);
    const filter = generateKnowledgeFilters(searchParam);
  
    try {
      const knowledges = await prisma.knowledge.findMany({
        where: filter,
        orderBy: generatedOrderBy,
        take: limitNumber,
        skip,
      });
  
      const totalRecords = await prisma.knowledge.count({ where: filter });
  
      return { allKnowledges: knowledges, totalRecords };
    } catch (error: any) {
      throw new OperationalError("Something is wrong with the knowledge model", error);
    }
};

export const getKnowledgeCount = async (search: string = ''): Promise<number> => {
    const filter = generateKnowledgeFilters(search.toLocaleLowerCase());
    return prisma.knowledge.count({ where: filter });
};
