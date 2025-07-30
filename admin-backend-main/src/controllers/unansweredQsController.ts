import { RequestHandler } from 'express';
import tryCatch from '../utils/tryCatch';
import { fetchUnansweredQs, addUnansweredQToDatabase, deleteUnansweredQFromDatabase, updateUnansweredQArchiveInDatabase } from '../models/unansweredQsModel';
import constants from '../constants';

export const getUnansweredQsByConversation: RequestHandler = tryCatch(async (req, res, next) => {
    const { page, limit, startTime, endTime } = req.query;
    const pageInt = parseInt(page as string ||  constants.PAGINATION.DEFAULT_PAGE);
    const limitInt = parseInt(limit as string || constants.PAGINATION.DEFAULT_LIMIT);
    const allUnansweredQs = await fetchUnansweredQs(pageInt, limitInt, startTime as string, endTime as string)
    res.json(allUnansweredQs)
})

export const postUnansweredQ: RequestHandler = tryCatch(async (req, res, next) => {
    const receivedUnansweredQs = req.body;
    const response = await addUnansweredQToDatabase(receivedUnansweredQs);
    res.json({status:response.status, msg: response.msg})
})


    export const deleteUnansweredQ: RequestHandler = tryCatch(async(req, res, next) => {
        const qId = req.params.unansweredQId;    
        const response = await deleteUnansweredQFromDatabase(qId)
        res.json({ msg: response })
    })
    
    export const updateUnansweredQArchive: RequestHandler = tryCatch(async(req, res, next) => {
        const { unansweredQId, archive } = req.body.data ?? req.body;    
        const response = await updateUnansweredQArchiveInDatabase(unansweredQId, archive)
        res.json({ msg: response })
    })  