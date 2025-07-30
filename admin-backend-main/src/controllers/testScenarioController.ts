import { RequestHandler } from 'express';
import tryCatch from '../utils/tryCatch';
import { formatTestRuns, sendQuestionsToBot, validateTestScenarioParams } from '../services/testScenarioServices';
import { ProductType, ScenarioPaginationParams, tableOptions, TestConversation, TestRunType, TestScenarioQAResponse } from '../types/interfaces';
import { addOrUpdateProduct, addOrUpdateUser, addTestConversation } from '../models/conversationsModel';
import logger from '../libs/pino';
import { addTestRunToAdminDb, addTestScenario, fetchTestScenarios, linkConversationToTestRun, fetchTestRuns, deleteTestScenarioFromDb, setTestRunStatus, getTestScenarioData, getTestScenariosWithPagination } from '../models/testScenarioModel';
import { randomUUID } from 'crypto';
import constants from '../constants';
import { calculatePagination, validatePaginationData } from '../services/pagination';
import { ValidationError } from '../utils/error';

export const postTestScenario: RequestHandler = tryCatch(async (req ,res, next) => {
    const { name, type, questions } = req.body.data ?? req.body;
    const areParamsValid = validateTestScenarioParams(name, type, questions);
    if (!areParamsValid.valid) {
        logger.error(areParamsValid.message);
        res.status(400).json({ error: areParamsValid.message });
        return;
    };
    const createdTestScenario = await addTestScenario({ name, type, questions });
    res.status(201).json({success: createdTestScenario});
});

export const postTestRun: RequestHandler = tryCatch(async (req, res, next) => {
    const { testScenarioId, language } = req.body.data ?? req.body;
    if (!testScenarioId) {
        const errorMessage = 'testScenarioId is required';
        logger.error(errorMessage);
        res.status(400).json({error: errorMessage});
    }
    const formattedLanguage = language === 'he' ? 'hebrew' : 'english';
    const createdTestRun = await addTestRunToAdminDb(testScenarioId);
    try {
        const { questions, type, correctAnswers } = await getTestScenarioData(testScenarioId);
        const productName = res.locals.companyConfig.product;
        if (!productName) {
            const errorMessage = 'Product name not found in company config';
            logger.error(errorMessage);
            res.status(400).json({error: errorMessage});
        };
        try {
            const { testRunBotConversation, testRunStatus }: TestScenarioQAResponse = await sendQuestionsToBot(questions, correctAnswers, productName, formattedLanguage, type);
            const userPayload: { id: string, isTestUser: boolean } = { id: randomUUID(), isTestUser: true };
            const createdUser: { userId: string } = await addOrUpdateUser(userPayload);
            const productPayload: ProductType = { id: productName, name: productName, available: true };
            const newProduct: ProductType = await addOrUpdateProduct(productPayload);
            const newProductId = newProduct.id;
            logger.info(`Product id: ${productName} added to database`);
            const conversationsPayload: TestConversation = {
                conversationId: randomUUID(),
                userId: createdUser.userId,
                productId: newProductId,
                startedTime: new Date(),
                avgResponseTimePerQuery: 0,
                endStatus: 'completed',
                positivenessScore: 0,
                complexityScore: 0,
                speed: 0,
                comment: '',
                messages: testRunBotConversation.responseData.messages,
            };
            const createdConversationId: string = await addTestConversation(conversationsPayload);
            await linkConversationToTestRun(createdConversationId, createdTestRun);
            await setTestRunStatus(createdTestRun, testRunStatus);
        } catch (error) {
            logger.error(`Something went wrong fetching response from agent backend: ${error}`);
            throw error;
        }
        res.status(201).json({success: createdTestRun});
    } catch (error) {
        await setTestRunStatus(createdTestRun, 'ERROR');
        logger.error(error)
        res.status(500).json({error});
    }
});

export const getTestScenarios: RequestHandler = tryCatch(async (req, res, next) => {
    const testScenarios = await fetchTestScenarios();
    res.json(testScenarios)
});

export const getTestScenarioFullData: RequestHandler = tryCatch(async (req, res, next) => {
    const { testScenarioId } = req.params;
    if (!testScenarioId) res.status(400).json({error: 'Test Scenario Id is required'});
    const testRuns: TestRunType[] = await fetchTestRuns(testScenarioId);
    const formattedTestRuns = formatTestRuns(testRuns);
    res.json(formattedTestRuns)
});

export const deleteTestScenario: RequestHandler = tryCatch(async (req, res, next) => {
    const { testScenarioId } = req.params;
    if (!testScenarioId) res.status(400).json({error: 'Test Scenario Id is required'});
    await deleteTestScenarioFromDb(testScenarioId);
    res.json({success: 'Test Scenario deleted'})
});

export const getTestScenarioPages: RequestHandler = tryCatch(async (req, res, next) => {
    const {
        limit = constants.PAGINATION.DEFAULT_LIMIT,
        order = constants.PAGINATION.DEFAULT_ORDER,
        search = constants.PAGINATION.DEFAULT_SEARCH, 
        orderBy = 'createdAt',
        page = constants.PAGINATION.DEFAULT_PAGE,
        endpointType = 'testScenarios'
    } = req.query as {
        limit?: string,
        order?: string,
        search?: string,
        orderBy?: string,
        page: string,
        endpointType?: tableOptions
    };
    const pageNumber: number = parseInt(page) || parseInt(constants.PAGINATION.DEFAULT_PAGE);
    const limitNumber: number = parseInt(limit);
    const { isDataValid, error } = validatePaginationData(pageNumber, limitNumber, order, orderBy, endpointType);
    if(!isDataValid) throw new ValidationError(error);
    const params: ScenarioPaginationParams = {
        pageNumber,
        limitNumber,
        order,
        orderBy,
        search,
    };
    const { allScenarios, totalRecords } = await getTestScenariosWithPagination(params);
    const { totalPages, nextPage, previousPage } = calculatePagination(totalRecords, allScenarios.length, pageNumber, limitNumber)
    const response = {
        "data": allScenarios,
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