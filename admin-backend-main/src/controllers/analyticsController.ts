import { 
    fetchEarliestInteractionTimestamp,
    fetchSentimentData, 
    fetchUserPersonaData, 
    fetchConversationDepthBarData,
    fetchUserReturn,
    fetchPeakTime,
    fetchInteractionDuration,
    fetchUserQueries,
    fetchInteractionMessages,
    fetchAllInteractionsRaw,
    getCustomerServiceConversations,
    getCustomerServiceConversation,
    saveMessageToChatbot,
    fetchAllProducts,
    fetchAllCustomers,
    fetchABConversionData,
    fetchCostPerConversationData,
    fetchUserMessagesPerConversationData,
    fetchAverageLengthOfClientMessages,
    fetchAverageLengthOfBotMessages,
    fetchThumbsMessagesData,
    fetchThumbsOneConversation,
    fetchPolicyCounter,
    fetchSecurityModuleCost,
    fetchDataForMainContainer,
    fetchAverageWordsMonthly,

} from '../models/analyticsModel';
import { RequestHandler } from 'express';
import tryCatch from '../utils/tryCatch';
import { ValidationError } from '../utils/error';
import constants from '../constants';
import { AdminFinalResponse, AdvancedAnalyticsFinalResponse, DashboardFinalResponse, Message } from '../types/interfaces';
import { fetchUserResponseTime } from '../models/charts/userResponseTime';

export const getThumbsMessagesData : RequestHandler = tryCatch(async (req, res, next) => {
    const finalResponse = await fetchThumbsMessagesData()
    res.json(finalResponse)
})

export const getOneThumbsConversation: RequestHandler = tryCatch(async (req, res, next) => {
    const messageId = req.params.messageId;
    const finalResponse = await fetchThumbsOneConversation(messageId);
    res.json(finalResponse);
});

export const controlDashboardData : RequestHandler = tryCatch(async (req, res, next) => {
    const earliestInteractionTimestamp = await fetchEarliestInteractionTimestamp();
    const finalResponse: DashboardFinalResponse = {
        earliestInteractionTimestamp: earliestInteractionTimestamp,
    };   
    res.json(finalResponse)
})

export const controlAdminData : RequestHandler = tryCatch(async (req, res, next) => {
    const nowMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonth = `${nowMonth}-${currentYear}`;
 
    const { productPopularityMonth = currentMonth, securityModuleCostMonth = currentMonth, thumbsUpAndDownCountMonth = currentMonth, averageLengthOfUserAndBotMessagesMonth = currentMonth, interactionMessageId } = req.query;

    if (parseFloat((productPopularityMonth as string).split(" - ")[0]) < 0 || parseFloat((productPopularityMonth as string).split(" - ")[0]) > 11 || isNaN(parseFloat((productPopularityMonth as string).split(" - ")[0]))) {
    throw new ValidationError(`Provided months must be integer 0-11. '${productPopularityMonth}' is not valid.`)
    }

    const earliestInteractionTimestamp = await fetchEarliestInteractionTimestamp();

    const peakTimeData = await fetchPeakTime();
    if (peakTimeData.length !== constants.DAYS_NAMES.length) {
        return constants.ZERO_OBJECTS.PEAK_TIME_ZERO
    }

    const interactionDuration = await fetchInteractionDuration();

    const userQueries = await fetchUserQueries();

    let interactionMessages = {}
    if (interactionMessageId) {
        interactionMessages = await fetchInteractionMessages(interactionMessageId.toString());
    }

    const ABConversionData = await fetchABConversionData()

    const costPerConversationData = await fetchCostPerConversationData()

    const userMessagesPerConversation = await fetchUserMessagesPerConversationData()

    const averageLengthOfClientMessages = await fetchAverageLengthOfClientMessages()
    const averageLengthOfBotMessages = await fetchAverageLengthOfBotMessages()
    const policyCounter  = await fetchPolicyCounter()
    const securityModuleCost = await fetchSecurityModuleCost(String(securityModuleCostMonth));
    const averageLengthOfUserAndBotMessages = await fetchAverageWordsMonthly(String(averageLengthOfUserAndBotMessagesMonth));
    const dataForMainContainer = await fetchDataForMainContainer()

    const finalResponse: AdminFinalResponse = {
        peakTimeData: peakTimeData,
        interactionDuration: interactionDuration,
        userQueries: userQueries,
        earliestInteractionTimestamp: earliestInteractionTimestamp,
        ABConversionData: ABConversionData,
        costPerConversationData: costPerConversationData,
        userMessagesPerConversationData: userMessagesPerConversation,
        averageLengthOfClientMessages: averageLengthOfClientMessages,
        averageLengthOfBotMessages: averageLengthOfBotMessages,
        policyCounter: policyCounter,
        securityModuleCost: securityModuleCost,
        averageLengthOfUserAndBotMessages: averageLengthOfUserAndBotMessages,
        dataForMainContainer: dataForMainContainer,
    };       
    res.json(finalResponse)
})

export const controlAdvancedAnalyticsData : RequestHandler = tryCatch(async (req, res, next) => {
        const nowMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const currentMonth = `${nowMonth}-${currentYear}`;
        const { userReturnMonth = currentMonth, conversationDepthMonth = currentMonth } = req.query
        

        for (let variable of [ userReturnMonth, conversationDepthMonth]) {
            if (parseFloat((variable as string).split(" - ")[0]) < 0 || parseFloat((variable as string).split(" - ")[0]) > 11 || isNaN(parseFloat((variable as string).split(" - ")[0]))) {
                throw new ValidationError(`Provided months must be integer 0-11. '${variable}' is not valid.`)
            }
        }

        const earliestInteractionTimestamp = await fetchEarliestInteractionTimestamp();

        let sentimentDonutData = await fetchSentimentData();
        const sentimentDonutCorrectKeys = constants.CORRECT_KEYS.SENTIMENT_DONUT_KEYS
        if (Object.keys(sentimentDonutData).length !== sentimentDonutCorrectKeys.length || !Object.keys(sentimentDonutData).every(key => sentimentDonutCorrectKeys.includes(key))) {
            sentimentDonutData = constants.ZERO_OBJECTS.SENTIMENT_DONUT_ZERO
        };
        
        let userPersonaData = await fetchUserPersonaData();
        const userPersonaCorrectKeys = constants.CORRECT_KEYS.USER_PERSONA_KEYS
        if (Object.keys(userPersonaData).length !== userPersonaCorrectKeys.length || !Object.keys(userPersonaData).every(key => userPersonaCorrectKeys.includes(key))) {
            userPersonaData = constants.ZERO_OBJECTS.USER_PERSONA_ZERO
        };

        let conversationDepthBarData = await fetchConversationDepthBarData(String(conversationDepthMonth));
        const conversationDepthCorrectKeys = constants.CORRECT_KEYS.CONVERSATION_DEPTH_KEYS;
        if (Object.keys(conversationDepthBarData[0]).length !== conversationDepthCorrectKeys.length || !Object.keys(conversationDepthBarData[0]).every(key => conversationDepthCorrectKeys.includes(key))) {
            conversationDepthBarData = constants.ZERO_OBJECTS.CONVERSATION_DEPTH_ZERO
        };

        const userReturnData = await fetchUserReturn(String(userReturnMonth));

        const finalResponse: AdvancedAnalyticsFinalResponse = {
            earliestInteractionTimestamp: earliestInteractionTimestamp,
            sentimentDonutData: sentimentDonutData,
            userPersonaData: userPersonaData,
            conversationDepthBarData: conversationDepthBarData,
            userReturnData: userReturnData,
        };       
        res.json(finalResponse)
});

export const controlGetDashboardConversations: RequestHandler = tryCatch(async (req, res, next) => {
    const response = await fetchAllInteractionsRaw();
    res.json(response)
})

export const controlGetChatbotConversations : RequestHandler = tryCatch(async (req, res, next) => {
    const requestedStatus = req.params.status.toLowerCase();
    if (!requestedStatus || requestedStatus === "") {
        throw new ValidationError("conversation status must be provided")
    }
    if (requestedStatus === "inactive") {
        const allInteractions = await fetchAllInteractionsRaw();
        res.json(allInteractions)
    } else if (requestedStatus === "customerservice") {
        const customerServiceChats = await getCustomerServiceConversations();
        let allChats = [];
        for (let chat of customerServiceChats) {
            const id = chat.conversation_id;
            const name = chat.customer_id;
            const category = chat.savings_account;
            const message = chat.messages[chat.messages.length - 1].text;
            const time = chat.messages[chat.messages.length - 1].time;
            const count = 1;
            allChats.push({
                "id": id,
                "name": name,
                "category": category,
                "message": message,
                "time": time,
                "count": count
            })
        }
        res.json(allChats)
    } else {
        throw new ValidationError("invalid conversation status")
    }
});
  
  export const controlgetCustomerServiceConversation: RequestHandler = tryCatch(async (req, res, next) => {
    try {
      const chatId = req.params.chatId;
      const csChat = await getCustomerServiceConversation(chatId);
      let conversation = [];  
      if (csChat && 'messages' in csChat) {
        const messages = csChat.messages as Message[];
        let index = 0;
        for (let m of messages) {
          const id = index;
          let user;
          if (m.pov === "bot") {
            user = "receiver"
          } else if (m.pov === "user") {
            user = "sender"
          } else {
            throw new ValidationError("invalid message author")
          };
          const message = m.text;
          const date = m.time;
          conversation.push({
            "id": id,
            "user": user,
            "message": message,
            "date": date
          })
          index ++
        }
      }
  
      res.json(conversation);
    } catch (error) {
      console.error(error);
    }
  });
  
  export const controlUpdateCustomerServiceConversation: RequestHandler = tryCatch(async (req, res, next) => {
    try {
        const chatId = req.params.chatId;
        const newMessageText = req.body.newMessageText;
        const response = saveMessageToChatbot(chatId, newMessageText); // chatbot endpoint needed
        res.json(`message added to chat ${chatId}`);
    } catch (error) {
        console.error(error)
    }
  });

  export const controlGetProducts: RequestHandler = tryCatch(async (req, res, next) => {
    const response = await fetchAllProducts();
    res.json(response)
});

export const controlGetCustomers: RequestHandler = tryCatch(async (req, res, next) => {
    const response = await fetchAllCustomers();
    res.json(response)
});

