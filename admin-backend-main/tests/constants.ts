import dotenv from "dotenv"

dotenv.config()

export const testConstants = {
    JEST_TIMEOUT_MSECONDS: 10000,
    DASHBOARD_VARIABLE_TYPES: {
        peakTimeData: "object",
        interactionDuration: "string",
        userQueries: "string",
        earliestInteractionTimestamp: "Date",
        ABConversionData: "object",
        costPerConversationData: "object",
        userMessagesPerConversationData: "object",
        averageLengthOfClientMessages: "number",
        averageLengthOfBotMessages: "number",
        policyCounter: "number",
        securityModuleCost: "object",
        averageLengthOfUserAndBotMessages:"object",
        dataForMainContainer: "object",

    },
    ADVANCED_ANALYTICS_VARIABLE_TYPES: {
        earliestInteractionTimestamp: "Date",
        sentimentDonutData: "object",
        userPersonaData: "object",
        conversationDepthBarData: "object",
        userReturnData: "object",
    },
    SECRETS: {
        // BREVO_API_KEY: process.env.BREVO_API_KEY,
        BACKEND_URL: process.env.BACKEND_URL,
        TWILIO_TO_PHONE: process.env.TWILIO_TO_PHONE,
        COMPANY_CONFIG_BASE_URL: process.env.COMPANY_CONFIG_BASE_URL,
        COMPANY_CONFIG_SECRET: process.env.COMPANY_CONFIG_SECRET
    }
};

export const testScenarioPayload = {
    "testScenarioId": "",
    "name": "fake name",
    "type": "QA",
    "createdAt": "",
    "testRuns": [],
    "questions": [
        {
            "message": "why?",
            "answer": "because"
        }
    ]
};
