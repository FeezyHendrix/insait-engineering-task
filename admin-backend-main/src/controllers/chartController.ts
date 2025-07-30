import { RequestHandler } from 'express';
import tryCatch from '../utils/tryCatch';
import { fetchUserInteraction } from '../models/charts/userInteraction';
import { fetchPolicyCounter } from '../models/charts/policyCounter';
import { fetchAnsweredAndUnanswered } from '../models/charts/answeredAndUnanswered';
import { fetchPeakTime } from '../models/charts/peakInteractionTime';
import { fetchUserMessagesPerConversationData } from '../models/charts/userMessagesPerConversation';
import { fetchUserResponseTime } from '../models/charts/userResponseTime';
import { fetchInteractionDuration } from '../models/charts/interactionDuration';
import { fetchConversationCount } from '../models/charts/totalConversations';
import { fetchTotalMessageCount } from '../models/charts/totalMessageCount';
import { fetchAvgBotResponseTime } from '../models/charts/avgBotResponseTime';
import { fetchSuccessfulConversationsStats } from '../models/charts/successfulConversation';
import { fetchSentiment } from '../models/charts/sentiment';
import { fetchPersona } from '../models/charts/persona';
import { fetchFeedbackData } from '../models/charts/feedback';
import { fetchMessageReactionsChart } from '../models/charts/messageReactionsChart';
import { fetchUserExposureWithMedia } from '../models/charts/userExposure';
import { fetchTopLinks } from '../models/charts/topLinks';
import { fetchNodes } from '../models/charts/nodes';
import { fetchConversationDuration } from '../models/charts/conversationDuration';
import { fetchUniqueEnumObjects } from '../models/charts/fetchUniqueEnumObjects';
import { fetchEnumFieldNames } from '../utils/fieldEnums';

export const getChartForAdmin: RequestHandler = tryCatch(async (req, res, next) => {
    const chartType = req.params.chartType;
    const nowMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonth = `${nowMonth}-${currentYear}`;
    const flowIdOptions: { [key: string]: null | undefined } = {
        allFlows: undefined,
        noFlow: null,
    };

    const { month = currentMonth, language, startDate, endDate, product, media, flowId } = req.query as { month: string, language: string, daysBack: string, startDate: string | undefined, endDate: string | undefined, product: string | undefined, media: string | undefined, flowId:  string | undefined };
    const defaultOpenEnabled = res.locals.companyConfig?.default_open_enabled;
    const formattedFlowId: string | null | undefined = flowId === undefined 
        ? undefined 
        : (flowId in flowIdOptions) 
        ? flowIdOptions[flowId] 
        : flowId;

    
    let response;
    switch (chartType) {
        case 'userInteraction':
            response = await fetchUserInteraction(formattedFlowId);
            break;

        case 'policyCounter':
            response = await fetchPolicyCounter(String(month), formattedFlowId);
            break;

        case 'answeredAndUnanswered':
            response = await fetchAnsweredAndUnanswered(String(month), language as 'en' | 'he' ?? 'en', formattedFlowId);
            break; 

        case 'peakInteractionTime':
            response = await fetchPeakTime(startDate, endDate, formattedFlowId);
            break;

        case 'userMessagesPerConversation':
            response = await fetchUserMessagesPerConversationData(startDate, endDate, formattedFlowId);
            break;
            
        case 'userResponseTime':
            response = await fetchUserResponseTime(startDate, endDate, formattedFlowId);
            break;

        case 'interactionDuration':
            response = await fetchInteractionDuration(startDate, endDate, formattedFlowId);
            break;

        case 'totalMessageCount':
            response = await fetchTotalMessageCount(startDate, endDate, formattedFlowId);
            break;

        case 'totalConversations':
            response = await fetchConversationCount(startDate, endDate, formattedFlowId);
            break;

        case 'avgBotResponseTime':
            response = await fetchAvgBotResponseTime(startDate, endDate, formattedFlowId);
            break;

        case 'successfulConversation':
            response = await fetchSuccessfulConversationsStats(startDate, endDate, false, 'en', formattedFlowId);
            break;

        case 'successfulPercentage':
            response = await fetchSuccessfulConversationsStats(startDate, endDate, true, language as 'en' | 'he' ?? 'en', formattedFlowId);
            break; 
        
        case 'sentiment':
            response = await fetchSentiment(startDate, endDate, formattedFlowId);
            break;

        case 'persona':
            response = await fetchPersona(startDate, endDate, formattedFlowId);
            break;

        case 'userRating':
            response = await fetchFeedbackData(String(month), formattedFlowId);
            break;

        case 'messageReactionsChart':
            response = await fetchMessageReactionsChart(String(month), formattedFlowId);
            break;

        case 'userExposureMedia':
            response = await fetchUserExposureWithMedia(defaultOpenEnabled === 1, language as 'en' | 'he' ?? 'en', media, startDate, endDate, formattedFlowId);
            break;

        case 'topLinks':
            response = await fetchTopLinks();
            break;

        case 'nodes':
            response = await fetchNodes(startDate, endDate, product, formattedFlowId);
            break

        case 'conversationDuration':
            response = await fetchConversationDuration(startDate, endDate, formattedFlowId);
            break;
        case 'fetchUniqueEnumObjects':
            const companyName = res.locals.companyConfig.company;
            const fields = await fetchEnumFieldNames(companyName);
            response = await fetchUniqueEnumObjects(fields, startDate, endDate, formattedFlowId);
            break;

        default:
            res.status(404).json({ error: 'Chart type not found' });
            break;
    };
    res.json(response)
});


