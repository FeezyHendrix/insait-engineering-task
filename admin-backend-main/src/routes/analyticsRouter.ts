import express from "express";
import { 
    controlAdvancedAnalyticsData, 
    controlDashboardData, 
    controlGetChatbotConversations, 
    controlgetCustomerServiceConversation,
    controlUpdateCustomerServiceConversation,
    controlGetDashboardConversations,
    controlGetProducts,
    controlGetCustomers,
    getThumbsMessagesData,
    getOneThumbsConversation,
    controlAdminData,
} from "../controllers/analyticsController";

const analyticsRouter = express.Router();

analyticsRouter.get("/oneThumbsConversation/:messageId", getOneThumbsConversation);
analyticsRouter.get("/thumbsMessagesData", getThumbsMessagesData);
analyticsRouter.get("/dashboard", controlDashboardData);
analyticsRouter.get("/admin", controlAdminData);
analyticsRouter.get("/advancedAnalytics", controlAdvancedAnalyticsData);
analyticsRouter.get("/dashboardConversations", controlGetDashboardConversations);
analyticsRouter.get("/chatbotConversations/:status", controlGetChatbotConversations);
analyticsRouter.get("/customerServiceConversation/:conversationId", controlgetCustomerServiceConversation);
analyticsRouter.put("/customerServiceConversation/:conversationId", controlUpdateCustomerServiceConversation);
analyticsRouter.get("/allProducts", controlGetProducts);
analyticsRouter.get("/allCustomers", controlGetCustomers)

export default analyticsRouter;