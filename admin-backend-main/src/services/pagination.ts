import constants from "../constants"
import { ConversationFilterType, ConversationFilter, ValidationResult, chatPageConversationType, tableOptions } from "../types/interfaces";

export const validatePaginationData = (pageInt: number, limitInt: number, order: string, orderBy: string, endpointType: tableOptions, startTime?: string | undefined, endTime?: string | undefined): ValidationResult => {
    const validatedStartTime = startTime ? new Date(Date.parse(startTime)) : null;
    const validatedEndTime = endTime ? new Date(Date.parse(endTime)) : null;
    
    if ((startTime && validatedStartTime && isNaN(validatedStartTime.getTime())) || (endTime && validatedEndTime && isNaN(validatedEndTime.getTime()))) {
        return {
            isDataValid: false,
            error: `Invalid date format in either start time or end time: ${startTime ? `startTime: ${startTime}` : ''} ${endTime ? `endTime: ${endTime}` : ''}`
        }
    }

    const validOrders = ['asc', 'des'];
    if(!validOrders.includes(order)){
        return{
            isDataValid: false,
            error:`Invalid order value: ${order}`
        }
    }

    const validColumnNames = constants.PAGINATION.VALID_COLUMN_NAMES[endpointType];

    if(!validColumnNames.includes(orderBy)){
        return {
            isDataValid: false,
            error: `invalid orderBy. must be one of '${validColumnNames.join(", ")}', not "${orderBy}"`
        }
    }

    if (isNaN(pageInt) || isNaN(limitInt)) {
        return {
            isDataValid: false,
            error: "invalid page or limit"
        }
    };
    if (pageInt < 1) {
        return {
            isDataValid: false,
            error: "invalid page number. must be positive number"
        }
    };
    if (limitInt < 1 || limitInt > 500) {
        return {
            isDataValid: false,
            error: "invalid limit. must be positive number less or equal to 500."
        }
    };
    if (!['asc', 'des', ''].includes(order)) {
        return {
            isDataValid: false,
            error: "invalid order. must be either 'asc' or 'des'."
        }
    };
    if ((validatedStartTime && validatedEndTime) && (validatedStartTime > validatedEndTime)) {
        return {
            isDataValid: false,
            error: `invalid start and end time. start time must be before end time. start: ${startTime}, end: ${endTime}`
        }
    };
    return {
        isDataValid: true,
        error: ""
    }
};

export const paginateConversations = (
        formattedData: chatPageConversationType[], 
        generatedPage: number, 
        generatedLimit: number, 
        generatedOrder: string,
        generatedOrderBy: string): { totalRecords: number; conversations: chatPageConversationType[] } => {
    const totalRecords = formattedData.length
    const pageInt = generatedPage;
    const limitInt = generatedLimit;
    const startIndex = (pageInt - 1) * limitInt;
    const endIndex = Math.min(startIndex + limitInt, totalRecords);
    const sortedConversations = sortConversations(formattedData, generatedOrderBy, generatedOrder)
    const paginatedData = sortedConversations.slice(startIndex, endIndex);    
    return {
        totalRecords,
        conversations: paginatedData
    };
};

export const calculatePagination = (
    totalRecords: number, 
    conversationCount: number, 
    generatedPage: number, 
    generatedLimit: number): { totalPages: number; nextPage: number | null; previousPage: number | null } => {
    const totalPages: number = totalRecords && conversationCount ? Math.ceil(totalRecords / generatedLimit) : 0;
    const nextPage: number | null  = generatedPage < totalPages ? generatedPage + 1 : null;
    const previousPage: number | null = generatedPage > 1 ? generatedPage - 1 : null;
    return { totalPages, nextPage, previousPage };
}

const sortConversations = (formattedData: chatPageConversationType[], generatedOrderBy: string, generatedOrder: string): chatPageConversationType[] => {
    switch (generatedOrderBy) { //TODO make dynamic
        case "updatedAt":
            return formattedData.sort((a: chatPageConversationType, b: chatPageConversationType) => {
                const dateA = new Date(a.updatedAt).getTime();
                const dateB = new Date(b.updatedAt).getTime();
                
                if (generatedOrder === 'asc') {
                    return dateA - dateB;
                } else {
                    return dateB - dateA;
                }
            });
        case "user.id": case "userId":
            return formattedData.sort((a: chatPageConversationType, b: chatPageConversationType) => {
                const userA: number = parseInt(a.user.id);
                const userB: number = parseInt(b.user.id);
                
                if (generatedOrder === 'asc') {
                    return userA - userB;
                } else {
                    return userB - userA;
                }
            });
        case "dataObject.email":
            return formattedData.sort((a: chatPageConversationType, b: chatPageConversationType) => {
                const emailA: string = JSON.parse((a.dataObject || '{}'))?.email ?? '';
                const emailB: string = JSON.parse((b.dataObject || '{}'))?.email ?? '';
                
                if (generatedOrder === 'asc') {
                    return emailA.localeCompare(emailB);
                } else {
                    return emailB.localeCompare(emailA);
                }                
            });
        case "dataObject.country":
            return formattedData.sort((a: chatPageConversationType, b: chatPageConversationType) => {                
                const countryA: string = JSON.parse((a.dataObject || '{}'))?.country ?? '';
                const countryB: string = JSON.parse((b.dataObject || '{}'))?.country ?? '';                
                if (generatedOrder === 'asc') {
                    return countryA.localeCompare(countryB);
                } else {
                    return countryB.localeCompare(countryA);
                }                
            });
        case "dataObject.name":
            return formattedData.sort((a: chatPageConversationType, b: chatPageConversationType) => {                                
                const nameA: string = JSON.parse((a.dataObject || '{}'))?.name ?? '';
                const nameB: string = JSON.parse((b.dataObject || '{}'))?.name ?? '';                
                if (generatedOrder === 'asc') {
                    return nameA.localeCompare(nameB);
                } else {
                    return nameB.localeCompare(nameA);
                }                
            });
        case "messageCount":
            return formattedData.sort((a: chatPageConversationType, b: chatPageConversationType) => {                                
                const messageCountA: number = parseInt(a.messageCount);
                const messageCountB: number = parseInt(b.messageCount);                  
                if (generatedOrder === 'asc') {
                    return messageCountA - messageCountB;
                } else {
                    return messageCountB - messageCountA;
                }                
            });
        case "firstName":
            return formattedData.sort((a: chatPageConversationType, b: chatPageConversationType) => {                                
                const firstNameA: string = a.user.firstName ?? '';
                const firstNameB: string = b.user.firstName ?? '';                  
                if (generatedOrder === 'asc') {
                    return firstNameA.localeCompare(firstNameB);
                } else {
                    return firstNameB.localeCompare(firstNameA);
                }                
            });
        case "lastName":
            return formattedData.sort((a: chatPageConversationType, b: chatPageConversationType) => {
                const lastNameA: string = a.user.lastName ?? '';
                const lastNameB: string = b.user.lastName ?? '';                  
                if (generatedOrder === 'asc') {
                    return lastNameA.localeCompare(lastNameB);
                } else {
                    return lastNameB.localeCompare(lastNameA);
                }                
            });
        default:
            return formattedData.sort((a: chatPageConversationType, b: chatPageConversationType) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                
                if (generatedOrder === 'asc') {
                    return dateA - dateB;
                } else {
                    return dateB - dateA;
                }
            });
    }
};

export const generateConversationFilters = (generatedStartTime?: string, generatedEndTime?: string, botSuccessOnly?: boolean) => {
    const filters: ConversationFilterType = {};    
    Object.assign(filters, {
        endTime: {
            gte: generatedStartTime && new Date(generatedStartTime),
            lte: generatedEndTime && new Date(generatedEndTime)
        }
    });
    if (botSuccessOnly) {
    filters.botSuccess = true
    };
    return filters;
};

export const generateOrderBy = (generatedOrderBy: string, generatedOrder: string): { [key: string]: string | { [key: string]: string } } => {
    const order = generatedOrder === 'asc' ? 'asc' : 'desc';
    switch (generatedOrderBy) {
        case "user.id":
        case "userId":
            return { userId: order };
        case "messageCount":
            return { messageCount: order };
        case "user.firstName":
            return { User: { firstName: order } };
        case "user.lastName":
            return { User: { lastName: order } };
        case "createdAt":
            return { startedTime: order };
        default:
            return { startedTime: order };
    }
};
export const generateReportOrderBy = (generatedOrderBy: string, generatedOrder: string): { [key: string]: string | { [key: string]: string } } => {
    const order = generatedOrder === 'asc' ? 'asc' : 'desc';
    switch (generatedOrderBy) {
        case "id":
            return { id: order }
        case "subject":
            return { subject: order };
        case "sender":
            return { sender: order };
        case "companyName":
            return { companyName: order };
        case "message":
            return { message: order };
        case "chatURL":
            return { chatURL: order };
        case "ticketURL":
            return { ticketURL: order };
        case "createdAt":
            return { createdAt: order };
        case "notificationEmails":
            return { notificationEmails: order };
        case "commentHistory":
            return { commentHistory: order };
        case "priority":
            return { priority : order}
        case "status":
            return {status: order}
        case "commentCount":
            return {commentCount: order}
        case "updatedAt":
            return { updatedAt: order}
        default:
            return { id: order };
    }
};

export const generateFilters = (
    searchParam: string | undefined, 
    hasFeedbackOnlyValue: boolean | undefined, 
    ratingValue: string | undefined, 
    botSuccessOnlyValue: boolean, 
    sentimentValue?: string, 
    personaValue?: string,
    nodeValue?: string,
    startTime?: string | undefined,
    endTime?: string | undefined,
    flowIdValue?: string | null
    ) => {
    const filters: ConversationFilter = {
        messageCount: {
            gt: 1
        },
        AND: [
            {
                OR: [
                    {
                        conversationId: {
                            contains: searchParam,
                            mode: constants.INSENSITIVE_MODE
                        }
                    },
                    {
                        userId: {
                            contains: searchParam,
                            mode: constants.INSENSITIVE_MODE
                        }
                    },
                    {
                        messages: {
                            array_contains: searchParam
                        }
                    },
                    {
                        history: {
                            contains: searchParam,
                            mode: constants.INSENSITIVE_MODE
                        }
                    },
                    {
                        dataObject: {
                            contains: searchParam,
                            mode: constants.INSENSITIVE_MODE
                        }
                    },
                    {
                        requestId: {
                            contains: searchParam,
                            mode: constants.INSENSITIVE_MODE
                        }
                    },
                    {
                        externalId: {
                            contains: searchParam,
                            mode: constants.INSENSITIVE_MODE
                        }
                    },
                    {
                        User: {
                                firstName: {
                                    contains: searchParam,
                                    mode: constants.INSENSITIVE_MODE
                                },
                        },
                    },
                    {
                        User: {
                                lastName: {
                                    contains: searchParam,
                                    mode: constants.INSENSITIVE_MODE
                                },
                        },
                    }
                ]
            }
        ]
    };

    if (botSuccessOnlyValue) {
        filters.AND.push({
            dataObject: {
                not: null
            },
            botSuccess: true
        });
    };

    if (hasFeedbackOnlyValue) {
        filters.AND.push({
            OR: [
                {
                    userFeedback: {
                        not: null
                    }
                },
                {
                    userRating: {
                        not: null
                    }
                }
            ]
        });
    };

    if (ratingValue && ratingValue !== 'null') {
        filters.AND.push({
            userRating: {
                equals: parseInt(ratingValue)
            }
        });
    };

    if (sentimentValue && sentimentValue !== 'null') {
        filters.AND.push({
            sentiment: {
                equals: sentimentValue,
                mode: constants.INSENSITIVE_MODE
            }
        });
    }
    if (personaValue && personaValue !== 'null') {
        filters.AND.push({
            persona: {
                equals: personaValue,
                mode: constants.INSENSITIVE_MODE
            }
        });
    };
    if (nodeValue && nodeValue !== 'null') {
        filters.AND.push({
            nodes: {
                has: nodeValue
            }
        });
    }
    if (startTime || endTime) {
        Object.assign(filters, {
            startedTime: {
                gte: startTime && new Date(startTime),
                lte: endTime && new Date(endTime)
            }
        });
    };
    if (flowIdValue && flowIdValue !== 'null') {
        filters.AND.push({
            flowId: {
                equals: flowIdValue === "noFlow" ? null : flowIdValue
            }
        });
    };

    return filters;
};

export const generateTicketFilters = (
    searchParam: string | undefined,
    status: string | undefined,
    priority: string | undefined
) => {
    const filters: any = { AND: [] }; 
    if (searchParam) {
        const searchFilters = {
            OR: [
                ...(isNaN(Number(searchParam)) ? [] : [{ id: { equals: Number(searchParam) } }]),
                {
                    message: {
                        contains: searchParam,
                        mode: 'insensitive',
                    },
                },
                {
                    subject: {
                        contains: searchParam,
                        mode: 'insensitive',
                    },
                },
                {
                    chatURL: {
                        contains: searchParam,
                        mode: 'insensitive',
                    },
                },
                {
                    ticketURL: {
                        contains: searchParam,
                        mode: 'insensitive',
                    },
                },
                {
                    commentHistory: {
                        contains: searchParam,
                        mode: 'insensitive',
                    },
                },
            ],
        };
        filters.AND.push(searchFilters); 
    }
    if (status) {
        filters.AND.push({
            status: {
                equals: status,
            },
        });
    }
    if (priority) {
        filters.AND.push({
            priority: {
                equals: priority,
            },
        });
    }

    return filters;
};

export const generateTestScenariosOrderBy = (generatedOrderBy: string, generatedOrder: string): { [key: string]: string | { [key: string]: string } } => {
    const order = generatedOrder === 'asc' ? 'asc' : 'desc';
    switch (generatedOrderBy) {
        case "testScenarioId":
            return { testScenarioId: order }
        case "name":
            return { name: order };
        case "createdAt":
            return { createdAt: order };
        case "type":
            return { type: order}
        default:
            return { createdAt: order };
    }
};

export const generateTestScenarioFilters = (
    searchParam: string | undefined,
) => {
    const filters: any = { AND: [] }; 
    if (searchParam) {
        const searchFilters = {
            OR: [
                ...(isNaN(Number(searchParam)) ? [] : [{ id: { equals: Number(searchParam) } }]),
                {
                    testScenarioId: {
                        contains: searchParam,
                        mode: constants.INSENSITIVE_MODE,
                    },
                },
                {
                    name: {
                        contains: searchParam,
                        mode: constants.INSENSITIVE_MODE,
                    },
                },
                {
                    questions: {
                        has: searchParam,
                    },
                },
            ],
        };
        filters.AND.push(searchFilters); 
    }
   
    return filters;
};

export const generateKnowledgeOrderBy = (generatedOrderBy: string, generatedOrder: string): { [key: string]: string | { [key: string]: string } } => {
    const order = generatedOrder === 'asc' ? 'asc' : 'desc';
    switch (generatedOrderBy) {
        case "id":
            return { id: order }
        case "createdAt":
            return { createdAt: order };
        case "question":
            return { question: order };
        case "answer":
            return { answer: order };
        case "url":
            return { url: order };
        default:
            return { id: order };
    }
};

export const generateKnowledgeFilters = (
    searchParam: string | undefined,
) => {
    const filters: any = { AND: [] }; 
    if (searchParam) {
        const searchFilters = {
            OR: [
                ...(isNaN(Number(searchParam)) ? [] : [{ id: { equals: Number(searchParam) } }]),
                {
                    question: {
                        contains: searchParam,
                        mode: 'insensitive',
                    },
                },
                {
                    answer: {
                        contains: searchParam,
                        mode: 'insensitive',
                    },
                },
                {
                    url: {
                        contains: searchParam,
                        mode: 'insensitive',
                    },
                },
                {
                    id: {
                        contains: searchParam,
                        mode: 'insensitive',
                    },
                }
            ],
        };
        filters.AND.push(searchFilters); 
    }

    return filters;
};
