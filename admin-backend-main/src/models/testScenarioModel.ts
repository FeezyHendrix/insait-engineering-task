import { ScenarioPaginationParams, TestRunType, TestScenarioQuestion, TestScenarioType } from "../types/interfaces";
import logger from "../libs/pino";
import { prisma } from "../libs/prisma"
import { generateTestScenarioFilters, generateTestScenariosOrderBy } from "../services/pagination";
import { OperationalError } from "../utils/error";

export const addTestScenario = async (testScenarioPayload: { name: string, type: 'QA' | 'SESSION', questions: TestScenarioQuestion[] }) => {
    try {
        const createdTestScenario = await prisma.testScenario.create({
        data: {
            name: testScenarioPayload.name,
            type: testScenarioPayload.type,
            questions: testScenarioPayload.questions?.map((question) => question.message),
            correctAnswers: testScenarioPayload.type === 'QA' ? testScenarioPayload.questions?.map((question) => question.answer ?? '') : []
        }
        });
        logger.info(`${testScenarioPayload.type} Test Scenario with ${testScenarioPayload.questions?.length} questions/messages created: ${testScenarioPayload.name}`);
        return createdTestScenario;
    } catch (error) {
        logger.error(`Error creating Test Scenario ${testScenarioPayload.name}: ${error}`);
        throw error;
    }
};

export const getTestScenarioData = async (testScenarioId: string) => {
    try {
        const testScenario: {questions: string[], type: TestScenarioType, correctAnswers: string[]} | null = await prisma.testScenario.findUnique({
            where: {
                testScenarioId: testScenarioId
            },
            select: {
                questions: true,
                type: true,
                correctAnswers: true
            }
        });
        if (!testScenario) return { questions: [], correctAnswers: []};
        const { questions, type, correctAnswers } = testScenario;
        return { questions, type, correctAnswers };
    } catch (error) {
        logger.error(`Error fetching Test Scenario ${testScenarioId}: ${error}`);
        throw error;
    }
};

export const addTestRunToAdminDb = async (testScenarioId: string) => {
    try {
        const testRun = await prisma.testRun.create({
            data: {
                testScenarioId
            }
        });
        logger.info(`Test Run created: ${testRun.testRunId}`);
        return testRun.testRunId;
    } catch (error) {
        logger.error(`Error creating test run for scenario ${testScenarioId}: ${error}`);
        throw error;
    }
};

export const linkConversationToTestRun = async (conversationId: string, testRunId: string) => {
    try {
        await prisma.$transaction( [
            prisma.testRun.update({
                where: {
                    testRunId
                },
                data: {
                    Interaction: {
                    connect: { conversationId }
                    }
                }
            }),
            prisma.interaction.update({
            where: {
                conversationId
            },
            data: {
                testRunId
            }
            })
        ]);
        logger.info(`Conversation ${conversationId} linked to Test Run ${testRunId}`);
    } catch (error) {
        logger.error(`Error linking Conversations to Test Run ${testRunId}: ${error}`);
        throw error;
    }
};

export const setTestRunStatus = async (testRunId: string, status: 'SUCCESS' | 'FAILURE' | 'ERROR') => {
    try {
        await prisma.testRun.update({
            where: {
                testRunId
            },
            data: {
                status
            }
        });
        logger.info(`Test Run ${testRunId} set to ${status}`);
    } catch (error) {
        logger.error(`Error setting Test Run ${testRunId} to complete: ${error}`);
        throw error;
    }
}

export const fetchTestScenarios = async () => {
    try {
        const testScenarios = await prisma.testScenario.findMany({
            include: {
                TestRun: {
                    select: {
                        runDate: true
                    },
                    orderBy: {
                        runDate: 'desc'
                    },
                }
            }
        });
        const output = {
            data: testScenarios,
            pagination: { // TODO complete pagination
                totalRecords: testScenarios.length
            }
        }
        return output;
    } catch (error) {
        logger.error(`Error fetching Test Scenarios: ${error}`);
        throw error;
    }
};

export const fetchTestRuns = async (testScenarioId: string): Promise<Array<TestRunType>> => {
    try {
        const testRuns: TestRunType[] = await prisma.testRun.findMany({
            where: {
                testScenarioId
            },
            orderBy: {
                runDate: 'desc'
            },
            select: {
                testRunId: true,
                status: true,
                runDate: true,
                testScenarioId: true,
                Interaction: {
                    select: {
                        conversationId: true,
                        messages: true,
                        startedTime: true
                    }
                }
            }
        });
        return testRuns;
    } catch (error) {
        logger.error(`Error fetching Test Runs for scenario ${testScenarioId}: ${error}`);
        throw error;
    }
};

export const deleteTestScenarioFromDb = async (testScenarioId: string) => {
    try {
        await prisma.testScenario.delete({
            where: {
                testScenarioId
            }
        });
        logger.info(`Test Scenario ${testScenarioId} deleted successfully`);
    } catch (error) {
        logger.error(`Error deleting Test Scenario ${testScenarioId}: ${error}`);
        throw error;
    }
};

export const getTestScenariosWithPagination = async (params: ScenarioPaginationParams) => {
    const {
        pageNumber,
        limitNumber,
        order,
        orderBy,
        search
    } = params;
    const searchParam = search?.toLocaleLowerCase() || "";
    const generatedOrderBy = generateTestScenariosOrderBy(orderBy, order);
    const filter = generateTestScenarioFilters(searchParam);
    try {
        const testScenarios = await prisma.testScenario.findMany({
            where: filter,
            orderBy: generatedOrderBy,
            take: limitNumber,
            skip: limitNumber * (pageNumber - 1),
            include: {
                TestRun: {
                    orderBy: {
                        runDate: 'desc'
                    },
                    include: {
                        Interaction: {
                            select: {
                                messages: true,
                            }
                        }
                    }
                }
            }
        });

        const testScenarioCount = await prisma.testScenario.count({ where: filter });
        return { allScenarios: testScenarios, totalRecords: testScenarioCount };
    } catch (error: any) {
        throw new OperationalError("Something went wrong fetching test scenarios", error);
    }
};