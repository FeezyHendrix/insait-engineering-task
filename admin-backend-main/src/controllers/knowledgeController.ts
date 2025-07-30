import { RequestHandler } from "express"
import tryCatch from "../utils/tryCatch"
import { addKnowledgeToDatabase, getAllKnowledges, deleteKnowledgeFromDatabase, toggleKnowledgeActivenessInDatabase, updateKnowledgeInDatabase, getKnowledgePagesWithPagination } from "../models/knowledgeModel"
import constants from "../constants";
import { calculatePagination, validatePaginationData } from "../services/pagination";
import { KnowledgePaginationParams, tableOptions } from "../types/interfaces";
import {
  runPrefectSendQAToR2R,
} from '../services/prefectService';


export const uploadKnowledge : RequestHandler = tryCatch(async (req, res, next) => {
        const receivedKnowledge =  req.body
        const response = await addKnowledgeToDatabase(receivedKnowledge) as { id: string, question: string, answer?: string }
        const PrefectPayload = [
            {
                id: response.id,
                question: response.question,
                answer: response.answer ?? '',
            }
        ]
        runPrefectSendQAToR2R(PrefectPayload)
        res.json({msg: response})
    }
)

export const updateKnowledge : RequestHandler = tryCatch(async (req, res, next) => {
        const receivedKnowledge =  req.body.data
        const response = await updateKnowledgeInDatabase(receivedKnowledge)

        res.json({msg: response})
    }
)

export const getKnowledges : RequestHandler = tryCatch(async (req, res, next) => {
    const response = await getAllKnowledges();
    res.json(response)
});

export const getKnowledgePages : RequestHandler = tryCatch(async (req, res, next) => {
    const {
        limit = constants.PAGINATION.DEFAULT_LIMIT,
        order = constants.PAGINATION.DEFAULT_ORDER,
        search = constants.PAGINATION.DEFAULT_SEARCH, 
        orderBy = constants.PAGINATION.DEFAULT_ORDER_BY,
        page = constants.PAGINATION.DEFAULT_PAGE,
        endpointType = 'knowledge',
    } = req.query as {
        limit?: string,
        order?: string,
        search?: string,
        orderBy?: string,
        page: string,
        endpointType?: tableOptions,
    };
    const pageNumber: number = parseInt(page) || parseInt(constants.PAGINATION.DEFAULT_PAGE);
    const limitNumber: number = parseInt(limit);
    const { isDataValid, error } = validatePaginationData(pageNumber, limitNumber, order, orderBy, endpointType);
    if (!isDataValid) throw new Error(error);
    const params: KnowledgePaginationParams = {
        pageNumber,
        limitNumber,
        order,
        orderBy,
        search,
    };
    const { allKnowledges, totalRecords } = await getKnowledgePagesWithPagination(params);
    const { totalPages, nextPage, previousPage } = calculatePagination(totalRecords, allKnowledges.length, pageNumber, limitNumber)
    const response = {
        "data": allKnowledges,
        "pagination": {
            "totalRecords": totalRecords,
            "currentPage": pageNumber,
            "totalPages": totalPages,
            "nextPage": nextPage,
            "previousPage": previousPage
        }
    };
    res.status(200).json(response)
});

export const deleteKnowledge: RequestHandler = tryCatch(async (req, res, next) => {
    const selectedKnowledge = req.body
    const response = await deleteKnowledgeFromDatabase(selectedKnowledge)
    res.json(response)
})

export const toggleKnowledgeActiveness: RequestHandler = tryCatch(async (req, res, next) => {
    const selectedKnowledge = req.body.data ?? req.body;
    const response = await toggleKnowledgeActivenessInDatabase(selectedKnowledge)
    res.json(response)
})