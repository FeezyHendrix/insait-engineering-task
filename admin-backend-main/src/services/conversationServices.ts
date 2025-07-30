import { AdminConversationType, chatPageConversationType } from "../types/interfaces"

export const convertConversationData = (conversations: AdminConversationType[]) => { 
    return conversations.map((conversation, index)=> {

        const { endStatus, messages, conversationId, startedTime, endTime, comment, dataObject, botSuccess, userRating, userFeedback, chatChannel, flowId } = conversation;
        const { firstName, lastName } = conversation.User ?? {};
        const { name: flowName } = conversation.Flow ?? {};
        const userId = conversation.userId;
        const title = conversation.chatProduct || "";
        const messageCount = messages?.length || 0;
        const createdAt = startedTime.getTime();
        const updatedAt = endTime ?? "";
  
        const result: chatPageConversationType = ({
          id: index + 1,
          user: {
            id: userId,
            firstName,
            lastName,
          },
          product: {
            title,
          },
          chatId: conversationId,
          createdAt, updatedAt,
          endStatus,
          messageCount,
          messages,
          comment,
          dataObject,
          botSuccess,
          userRating,
          userFeedback,
          chatChannel,
          flowId,
          flowName
        })
        return result
      })
}