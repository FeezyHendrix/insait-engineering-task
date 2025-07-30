import { AdminConversationType, ConversationFilterType, Link, Message, PaginationParams, PaginationResult, ProductType, ReceivedChat, ReceivedCustomer, TestConversation, chatPageConversationType } from "../types/interfaces";
import logger from "../libs/pino";
import { convertConversationData } from "../services/conversationServices";
import { prisma } from "../libs/prisma";
import { generateConversationFilters, generateOrderBy, generateFilters, paginateConversations } from "../services/pagination";
import { OperationalError, ValidationError } from "../utils/error";
import { serviceErrorHandler, successResponse } from "../utils/reportUtil";
import axiosInstance from "../utils/axiosInstance";
import { getFileNameFromUrl } from "../utils/fileUtils";

export const getConversationsWithPagination = async (params: PaginationParams): Promise<PaginationResult> => {
      const {
        pageNumber,
        limitNumber,
        order,
        minimumMessageCount,
        botSuccessOnlyBool,
        orderBy,
        search,
        startTime,
        endTime
    } = params;
    const searchLower = search.toLowerCase();    
    const filters: ConversationFilterType = generateConversationFilters(startTime, endTime, botSuccessOnlyBool);
    const allInteractions: AdminConversationType[] = await prisma.interaction.findMany({
      where: filters,
        include: {
          User: true,
          Product: true,
        }
    });
    
    try {
      const allFormattedData = allInteractions
        .filter(conversation => conversation.messages.length >= (minimumMessageCount ?? 0))
        .filter(conversation => !botSuccessOnlyBool || (conversation.botSuccess && conversation.dataObject)) // update if we will ever have botsuccess without dataobject
        const formattedData = searchLower === '' ? allFormattedData : allFormattedData.filter(conversation => {
          return (
            conversation.User?.firstName?.toLowerCase().includes(searchLower) ||
            conversation.User?.lastName?.toLowerCase().includes(searchLower) ||
            conversation.endStatus.toLowerCase().includes(searchLower) ||
            conversation.User?.userId.toLowerCase().includes(searchLower) ||
            conversation.Product?.name.toLowerCase().includes(searchLower) ||
            conversation.messages.some((message: Message) => message.text.toLowerCase().includes(searchLower))
          );
        });
      const convertedData: chatPageConversationType[] = convertConversationData(formattedData)
      const { conversations, totalRecords } = paginateConversations(convertedData, pageNumber, limitNumber, order, orderBy)
      return { allConversations: conversations, totalRecords: totalRecords}
      } catch (error: any) {
        throw new OperationalError("Product or Customer missing from the database", error)
      }
  };


  export const addOrUpdateProduct = async (receivedProduct: ProductType): Promise<ProductType> => {  
    try {
      const newProduct = await prisma.product.upsert({
        where: {
          name: receivedProduct.name,
        },
        update: {},
        create: {
          id: receivedProduct.id,
          name: receivedProduct.name,
          available: receivedProduct.available
        }
      });
      return newProduct;
    } catch (error) {
      throw new Error(`error upserting product ${receivedProduct.id}: ${error}`);
    }
  };
  
  export const addOrUpdateConversation = async (receivedChat: ReceivedChat) => {
    logger.info(`Adding/updating conversation ${receivedChat.id} to database...`);
    try {
      const productId = (await prisma.product.findUnique({
        where: {
          name: receivedChat.product_name
        },
        select: {
          id: true
        }
      }))?.id;
  
      const payload = {
        userId: receivedChat.customer_id,
        endTime: receivedChat.end_time,
        avgResponseTimePerQuery: receivedChat.avg_response_time_per_query,
        endStatus: receivedChat.end_status,
        positivenessScore: receivedChat.positiveness_score,
        complexityScore: receivedChat.complexity_score,
        speed: receivedChat.speed,
        messages: receivedChat.messages,
        comment: receivedChat.comment,
        botSuccess: receivedChat.bot_success,
        totalCompletionTokensUsed: receivedChat.total_completion_tokens_used,
        totalPromptTokensUsed: receivedChat.total_prompt_tokens_used,
        queryKnowledgebase: receivedChat.query_knowledgebase,
        securityViolations: receivedChat.security_violations,
        securityPromptTokens: receivedChat.security_prompt_tokens,
        securityCompletionTokens: receivedChat.security_completion_tokens,
        conversationCompletionTokens: receivedChat.conversation_completion_tokens,
        conversationPromptTokens: receivedChat.conversation_prompt_tokens,
        securityViolationMessages: receivedChat.security_violation_messages,
        userFeedback: receivedChat.user_feedback,
        userRating: receivedChat.user_rating,
        dataObject: receivedChat.form_data,
        messageCount: receivedChat.message_count,
        history: receivedChat.history,
        sentiment: receivedChat.sentiment,
        persona: receivedChat.persona,
        nodes: receivedChat.nodes,
        requestId: receivedChat.request_id,
        externalId: receivedChat.external_id,
        chatChannel: receivedChat.chat_channel,
        flowId: receivedChat.flow_id,
      };
  
      const newConversation = await prisma.interaction.upsert({
        where: {
          conversationId: receivedChat.id
        },
        update: {
          ...payload,
        },
        create: {
          conversationId: receivedChat.id,
          productId: productId,
          startedTime: receivedChat.started_time,
          ...payload,
        },
      });
      logger.info(`Conversation ${receivedChat.id} added/updated in database`);
      return newConversation;
    } catch (error) {
      throw new Error(`Error upserting conversation ${receivedChat.id}: ${error}`);
    }
  };

export const addTestConversation = async (conversationPayload: TestConversation): Promise<string> => {
  const createdConversation = await prisma.interaction.create({
    data: conversationPayload
  });
  return createdConversation.conversationId;
  
};


export const addOrUpdateUser = async (receivedUser: ReceivedCustomer): Promise<{userId: string}> => {
  try {
    const newCustomer = await prisma.user.upsert({
      where: {
        userId: receivedUser.id,
      },
      update: {},
      create: {
        userId: receivedUser.id,
        firstName: receivedUser.firstName,
        lastName: receivedUser.lastName,
        personaClassification: receivedUser.personaClassification || "",
        createdAt: receivedUser.createdAt,
        isTestUser: receivedUser.isTestUser,
        userAgent: receivedUser.userAgent,
      },
    });
    logger.info(`user ${receivedUser.id} added/updated in database`);
    return newCustomer;
  } catch (error) {
    throw new Error(`error upserting user ${receivedUser.id}: ${error}`);
  }
};

export const addOrUpdateLink = async (receivedLink: Link) => {
  try {
    const newLink = await prisma.link.upsert({
      where: {
        linkId: receivedLink.linkId,
      },
      update: {
        url: receivedLink.url,
        type: receivedLink.type,
        count: receivedLink.count
      },
      create: {
        linkId: receivedLink.linkId,
        url: receivedLink.url,
        type: receivedLink.type,
        count: receivedLink.count
      },
    });
    logger.info(`link ${receivedLink.linkId} added/updated in database`);
    return newLink;
  } catch (error) {
    throw new Error(`error upserting link ${receivedLink.linkId}: ${error}`);
  }
};

export const addOrUpdateFlow = async (flowId: string, flowName: string) => {
  try {
    const newFlow = await prisma.flow.upsert({
      where: {
        id: flowId,
      },
      update: {},
      create: {
        id: flowId,
        name: flowName
      },
    });
    logger.info(`flow ${flowId} added/updated in database`);
    return newFlow;
  } catch (error) {
    throw new Error(`error upserting flow ${flowId}: ${error}`);
  }
};


export const fetchConversationById = async (conversationId: string) => {
  try {
      const conversation: AdminConversationType | null = await prisma.interaction.findUnique({
      where: {
        conversationId
      },
      include: {
        User: true,
        Product: true
      }
    });    
    if (!conversation) {
      throw new ValidationError(`Conversation ${conversationId} not found`)
    };
    const result: chatPageConversationType[]  = convertConversationData([conversation]);
    return result[0]
  } catch (error: any) {
    throw new ValidationError(`Error fetching conversation ${conversationId}`);
  }
};

export const fetchFileByUrl = async (fileUrl: string) => {
  try {
    const response = await axiosInstance.get(fileUrl, {
      responseType: 'arraybuffer',
    });

    const fileName = getFileNameFromUrl(fileUrl)
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    const mimeType = response.headers['content-type'];
    
    const data = {
      file: `data:${mimeType};base64,${base64}`,
      fileName
    };

    return successResponse(data);
  } catch (error) {
    return serviceErrorHandler("fetchFile", error, 'Fetching file failed');
  }
};

export const getConversationPagesWithPagination = async (params: PaginationParams): Promise<PaginationResult> => {
  const {
    pageNumber,
    limitNumber,
    order,
    orderBy,
    search,
    rating,
    hasFeedbackOnlyBool,
    botSuccessOnlyBool,
    sentiment,
    persona,
    node,
    startTime,
    endTime,
    flowId
  } = params;
  const searchParam = search.toLowerCase();    
  const generatedOrderBy = generateOrderBy(orderBy, order);
  const filters = generateFilters(searchParam, hasFeedbackOnlyBool, rating, botSuccessOnlyBool, sentiment, persona, node, startTime, endTime, flowId);
  const allInteractions: AdminConversationType[] = await prisma.interaction.findMany({
    where: filters,
    orderBy: generatedOrderBy,
    take: limitNumber,
    skip: limitNumber * (pageNumber - 1),
    include: {
      User: true,
      Flow: true
    },
  });
  const conversationCount = await prisma.interaction.count({
    where: filters
  });  
  try {
    const convertedData: chatPageConversationType[] = convertConversationData(allInteractions)
    return { allConversations: convertedData, totalRecords: conversationCount}
    } catch (error: any) {
      throw new OperationalError("Something went wrong in conversation model", error)
    }
};

export const resetOldConversationsFromDb = async (cutoffTime: Date) => {
  try {
    logger.info(`Resetting conversations from before ${cutoffTime}...`);
    const ticketsWithConversations: { chatURL: string | null }[] = await prisma.support.findMany({
      where: {
        chatURL: {
          not: null
        }
      },
      select: {
        chatURL: true
      }
    });
    const ticketConversationIds = ticketsWithConversations.map(ticket => {
      try {
        const url = new URL(ticket.chatURL!);
        return url.searchParams.get('conversationId');
      } catch {
        return null;
      }
    }).filter(id => id !== null);
    const updatedConversations = await prisma.interaction.updateMany({
      where: {
        startedTime: { lte: cutoffTime },
        testRunId: null,
        conversationId: {
          notIn: ticketConversationIds
        },
        securityViolations: {
          equals: 0
        },
        UnansweredQuestion: {
          none: {}
        }
      },
      data: {
        messages: {},
        dataObject: null,
        history: null,
        userFeedback: null,
      }
    });
    const message = `Reset ${updatedConversations.count} old conversations from before ${cutoffTime}.`
    logger.info(message);
    return { message };
  } catch (error: any) {
    throw new OperationalError("Error resetting old conversations", error);
  }
}

export const deletePIIFromDb = async (startTime: Date) => {
  const updatedConversationCount = (await prisma.interaction.updateMany({
    where: {
      endTime: {
        lt: startTime
      }
    },
    data: {
      securityViolationMessages: [],
      dataObject: null,
    }
  })).count;
  return updatedConversationCount;
};

export const getAllProducts = async (): Promise<string[]> => {
  const products: {name: string}[] = await prisma.product.findMany({
    select: {
      name: true,
    }
  });
  if (!products.length) return [];
  return products.map(product => product.name);
};

export const getAllUsedFlows = async (): Promise<({ id: string, name: string } | null)[]> => {
  const conversations = await prisma.interaction.findMany({
    distinct: ['flowId'],
    where: {
      messageCount: {
        gt: 1
      }
    },
    include: {
      Flow: true
    }
  });

  const flows = conversations.map((conversation: {Flow: {name: string, id: string} | null}) => {
    if (!conversation.Flow) return null;
    return {
      id: conversation.Flow.id,
      name: conversation.Flow.name
    }
  });
  
  return flows
};
