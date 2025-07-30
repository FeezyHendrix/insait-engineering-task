import { TestRunType, TestScenarioQAResponse, TestScenarioQuestion, TestScenarioType } from "../types/interfaces";
import constants from "../constants";
import axiosInstance from "../utils/axiosInstance";
import logger from "../libs/pino";
import axios from "axios";

export const sendQuestionsToBot = async (questions: string[], correctAnswers: string[], company: string, language: string = 'english', scenarioType: TestScenarioType | undefined): Promise<TestScenarioQAResponse> => {
    logger.info(`Sending ${questions.length} ${scenarioType} questions to agent backend of product ${company}...`);
    const agentEndpointURL = `${constants.AGENT_URL}:${constants.AGENT_PORT}/chatbot/scripted`
    const payload = {
        messages: questions,
        language,
        product: company,
        scenario_type: scenarioType,
        correct_answers: correctAnswers.map((answer) => answer === '' ? null : answer)
    };

    const jwtToken = constants.AGENT_JWT_TOKEN;
    if (!jwtToken) {
        throw new Error('JWT token is missing');
    };

    const headers = {
        "Authorization": `Bearer ${jwtToken}`,
    };
    try {
        const agentResponse = await axiosInstance.post(agentEndpointURL, payload, { headers });
        const responseData: { 
            messages: { content: string, role: string }[],
            evaluations: (boolean | null)[]
        } = agentResponse.data;

        const responseWithCorrectness = responseData.messages.reduce((acc: { 
            messages: { content: string, role: string, correct?: boolean | null }[], 
            evaluationIndex: number }, 
            message) => {
            if (message.role === 'assistant') {
                const correct = responseData.evaluations[acc.evaluationIndex];
                acc.evaluationIndex += 1;
                acc.messages.push({ ...message, correct });
            } else {
                acc.messages.push(message);
            }
            return acc;
        }, { messages: [], evaluationIndex: 0 }).messages;

        const backAndForthCount = responseWithCorrectness.reduce((acc: { user: string, assistant: string}[], message, index, array) => {
            if (message.role === 'user' && array[index + 1]?.role === 'assistant') {
                acc.push({ user: message.content, assistant: array[index + 1].content });
            }
            return acc;
        }, []).length;
        const testRunStatus = backAndForthCount === questions.length ? 'SUCCESS' : 'ERROR';
        if (testRunStatus === 'ERROR') {
            logger.error(`Received ${backAndForthCount} answers from agent backend, expected ${questions.length}`);
        } else {
            logger.info(`Received ${backAndForthCount === questions.length ? 'all ' : ''}${backAndForthCount} answers from agent backend`);
        }
        return { testRunBotConversation: { responseData: { messages: responseWithCorrectness } }, testRunStatus };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            logger.error(`Agent backend responded with status ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        }
        throw new Error('Error sending questions to agent backend');
    }
};

export const validateTestScenarioParams = (name: string, type: string, questions:TestScenarioQuestion[]): {valid: boolean, message?: string} => {
    if (!questions || !name || !type) {
        return { valid: false, message: 'Name, type, and questions are required' };
    }
    const questionMessageCount = questions.map((question) => question.message).length;
    const questionAnswerCount = questions.map((question) => question.answer).length;
    if (questionMessageCount !== questionAnswerCount) {
        return { valid: false, message: 'Questions and answers must be the same length' }
    };
    const validTypes = ['QA', 'SESSION'];
    if (!validTypes.includes(type)) {
        return { valid: false, message: 'Type must be QA or SESSION' };
    };
    return { valid: true };
};

export const formatTestRuns = (testRuns: TestRunType[]) => {
    const formattedTestRuns = testRuns.map((testRun) => {
        const backAndForths = testRun.Interaction?.messages.reduce((
            acc: { user: string, assistant: string, correct?: boolean }[], 
            message: { role: 'assistant' | 'user', content: string}, 
            index: number, 
            array: { role: 'assistant' | 'user', content: string, correct?: boolean }[]) => {
            if (message.role === 'user' && array[index + 1]?.role === 'assistant') {
                acc.push({ user: message.content, assistant: array[index + 1].content, correct: array[index + 1].correct });
            }
            return acc;
        }, []);
        return {
            testRunId: testRun.testRunId,
            testScenarioId: testRun.testScenarioId,
            status: testRun.status,
            messages: backAndForths || [],
            runDate: testRun.runDate,
        }
    });
    return formattedTestRuns;
};