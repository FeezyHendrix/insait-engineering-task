import { fetchAllInteractionsRaw } from './analyticsModel';
import { AdminConversationType } from '../types/interfaces'

interface FeedbackMessage {
  userFeedback: string;
  userRating: number;
  conversationId: string;
  endTime: Date | null;
  userId: string;
}

export const fetchFeedbackMessagesModel = async () => {
    const allConversations: AdminConversationType[] = await fetchAllInteractionsRaw();
    const formattedData: FeedbackMessage[] = [];

    allConversations?.forEach(conversation => {
      if(conversation.userFeedback && conversation.userRating) {
        formattedData.push({
          userFeedback: conversation.userFeedback,
          userRating: conversation.userRating,
          conversationId: conversation.conversationId,
          endTime: conversation.endTime,
          userId: conversation.userId,
        });
      }
    });
    
    return formattedData
};