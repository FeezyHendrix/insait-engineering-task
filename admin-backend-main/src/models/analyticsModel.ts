import constants, { ABUsers, UserType } from '../constants';
import { OperationalError, ValidationError } from '../utils/error';
import { io } from 'socket.io-client';
import { prisma } from '../libs/prisma';
import logger from '../libs/pino';
import hardcodedConstants from '../constants'
import { AdminConversationType, Chat, InteractionObject, MessageType, PeakTimeData, AdminUserType, Week, ProductType } from '../types/interfaces';
import axiosInstance from '../utils/axiosInstance';
import { JsonValue } from '@prisma/client/runtime/library';
export const fetchEarliestInteractionTimestamp = async () => {
  const earliestInteraction = await prisma.interaction.findFirst({
    select: {
      startedTime: true,
    },
    orderBy: {
      startedTime: 'asc',
    },
  });
  return earliestInteraction ? earliestInteraction.startedTime : null;
}

export const fetchSentimentData = async () => {
const allInteractions: AdminConversationType[] = await prisma.interaction.findMany();

const groupedInteractions: { [positivenessScore: number]: number } = {};

allInteractions.forEach((interaction) => {
  const { positivenessScore } = interaction;
  if (positivenessScore in groupedInteractions) {
    groupedInteractions[positivenessScore]++;
  } else {
    groupedInteractions[positivenessScore] = 1;
  }
});  
  

  if (allInteractions.length === 0) {
    return constants.ZERO_OBJECTS.SENTIMENT_DONUT_ZERO
  }
  
  const label: string[] = []

  let dataItemCount = 0;
  let positivenessIndex: Record<string, number> = {};
  

  if (Object.keys(groupedInteractions).some((item) => parseInt(item) < 34)) {
    positivenessIndex[constants.INTERACTION_SENTIMENT_LABELS.NEGATIVE] = dataItemCount;
    label[dataItemCount] = constants.INTERACTION_SENTIMENT_LABELS.NEGATIVE;
    dataItemCount++;
  }
  if (Object.keys(groupedInteractions).some((item) => parseInt(item) < 67 && parseInt(item) >= 34)) {
    positivenessIndex[constants.INTERACTION_SENTIMENT_LABELS.NEUTRAL] = dataItemCount;
    label[dataItemCount] = constants.INTERACTION_SENTIMENT_LABELS.NEUTRAL
    dataItemCount++
  }
  if (Object.keys(groupedInteractions).some((item) => parseInt(item) >= 67)) {
    positivenessIndex[constants.INTERACTION_SENTIMENT_LABELS.POSITIVE] = dataItemCount;
    label[dataItemCount] = constants.INTERACTION_SENTIMENT_LABELS.POSITIVE
    dataItemCount++
  }

  const data = Array(dataItemCount).fill(0)

  for (const scoreStr in groupedInteractions) {
    const score = parseInt(scoreStr);
    const count = groupedInteractions[scoreStr];
  
    if (score >= 1 && score <= 33) {
      data[positivenessIndex.Negative] += count;
    } else if (score >= 34 && score <= 66) {
      data[positivenessIndex.Neutral] += count;
    } else if (score >= 67 && score <= 100) {
      data[positivenessIndex.Positive] += count;
    }
  }
  
  return { data, label }

};

export const fetchCompletionRateData = async () => {
  const allInteractions: AdminConversationType[] = await prisma.interaction.findMany();

  const groupedInteractions: Record<string, number> = {};

  allInteractions.forEach((interaction) => {
    const { endStatus } = interaction;
    if (endStatus in groupedInteractions) {
      groupedInteractions[endStatus]++;
    } else {
      groupedInteractions[endStatus] = 1;
    }
  });

  const label: string[] = [];
  const data: number[] = [];

  for (const status in groupedInteractions) {
    const count = groupedInteractions[status];
    data.push(count);

    switch (status) {
      case constants.INTERACTIONS_END_STATUS.COMPLETION.NAME:
        label.push(constants.INTERACTIONS_END_STATUS.COMPLETION.LABEL);
        break;
      case constants.INTERACTIONS_END_STATUS.CUSTOMER_SERVICE.NAME:
        label.push(constants.INTERACTIONS_END_STATUS.CUSTOMER_SERVICE.LABEL);
        break;
      case constants.INTERACTIONS_END_STATUS.DROP_OFF.NAME:
        label.push(constants.INTERACTIONS_END_STATUS.DROP_OFF.LABEL);
        break;
      default:
        label.push(status);
        break;
    }
  }

  return { data, label };
};


export const fetchUserPersonaData = async () => {
  const personas: {personaClassification: string | null}[] = await prisma.user.findMany({
    select: {
      personaClassification: true,
    },
  });
  
  if (personas.length === 0) {
    return constants.ZERO_OBJECTS.USER_PERSONA_ZERO
  }

  const countMap: Record<string, number> = {};

  personas.forEach((persona) => {
    const classification = persona.personaClassification || 'Unknown';
    countMap[classification] = (countMap[classification] || 0) + 1;
  });

  const data = Object.values(countMap);
  const labels = Object.keys(countMap).map(i => i.charAt(0).toUpperCase() + i.slice(1));

  return {
    data,
    label: labels,
  };
};


export const fetchProductIdNamesById = async () => {
  const result = await prisma.product.findMany({
    select: {
      id: true,
      name: true
    }
  });
  const formattedResult: Record<string, string> = {};

  result.forEach((product: {name: string, id: string}) => {
    formattedResult[product.id.toString()] = product.name;
  });
  return formattedResult
};

export const fetchConversationDepthBarData = async (month: string) => {
  const givenMonth = parseInt(month.split('-')[0]);
  const givenYear = parseInt(month.split('-')[1]);
  const startOfTargetMonth = (new Date(givenYear, givenMonth, 1));
  const monthsToDisplay = constants.MONTHS_TO_DISPLAY;
  const startOfAfterMonth = givenMonth > 8 ? new Date(givenYear + 1, givenMonth - monthsToDisplay - 6, 1) : (new Date(givenYear, givenMonth + monthsToDisplay, 1));
  const weeks = [];

  const allInteractions1: InteractionObject[] = await prisma.interaction.findMany({
    select: {
      conversationId: true,
      userId: true,
      productId: true,
      startedTime: true,
    },
  });
  const allInteractionStartedTimes: Date[] = allInteractions1.map(obj => obj.startedTime);
  const earliestInteractionDate: Date = new Date(Math.min(...allInteractionStartedTimes.map(date => date.getTime())));

  const startDate = earliestInteractionDate;
  const endDate = new Date();

  let currentWeekStart = new Date(startDate);
  while (currentWeekStart <= endDate) {
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);

    const weekName = `${(currentWeekStart.getMonth() + 1).toString().padStart(2, '0')}/${currentWeekStart.getDate().toString().padStart(2, '0')} - ${(currentWeekEnd.getMonth() + 1).toString().padStart(2, '0')}/${currentWeekEnd.getDate().toString().padStart(2, '0')}`;

    weeks.push({
      name: weekName,
      simple: 0,
      moderate: 0,
      complex: 0,
      month: currentWeekStart.getMonth(),
      year: currentWeekStart.getFullYear()
    });

    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  };
  

  const allInteractions = await prisma.interaction.findMany({
    select: {
      startedTime: true,
      complexityScore: true,
    },
    where: {
      startedTime: {
        gte: startOfTargetMonth,
        lt: startOfAfterMonth,
      }
    }
  });

  if (allInteractions.length === 0) {
    return constants.ZERO_OBJECTS.CONVERSATION_DEPTH_ZERO
  }


  for (let week of weeks) {
    const weekStart = new Date(`${week.year}-${week.name.split(' - ')[0]}`);
    const weekEnd = new Date(`${week.year}-${week.name.split(' - ')[1]}`);
    for (let interaction of allInteractions) {
      if (interaction.startedTime >= weekStart && interaction.startedTime <= weekEnd) {
        if (interaction.complexityScore <= constants.INTERACTION_COMPLEXITY_SCORES.simple) {
          week.simple++
        } else if (interaction.complexityScore <= constants.INTERACTION_COMPLEXITY_SCORES.moderate) {
          week.moderate++
        } else if (interaction.complexityScore <= constants.INTERACTION_COMPLEXITY_SCORES.complex) {
          week.complex++
        }
      }
    };
  };

  return weeks
};

export const fetchUserReturn = async (month: string) => {
  const givenMonth = parseInt(month.split('-')[0]);
  const givenYear = parseInt(month.split('-')[1]);
  const startOfTargetMonth = (new Date(givenYear, givenMonth, 1));
  const monthsToDisplay = constants.MONTHS_TO_DISPLAY;
  const startOfAfterMonth = givenMonth > 8 ? new Date(givenYear + 1, givenMonth - monthsToDisplay - 6, 1) : (new Date(givenYear, givenMonth + monthsToDisplay, 1));
  const weeks = [];
  
  const allInteractions: InteractionObject[] = await prisma.interaction.findMany({
    select: {
      conversationId: true,
      userId: true,
      productId: true,
      startedTime: true,
    },
  });
  
  const allInteractionStartedTimes: Date[] = allInteractions.map(obj => obj.startedTime);
  const earliestInteractionDate: Date = new Date(Math.min(...allInteractionStartedTimes.map(date => date.getTime())));

  const startDate = earliestInteractionDate;
  const endDate = new Date();

  if (allInteractions.length === 0) {
    return constants.ZERO_OBJECTS.USER_RETURN_ZERO
  }

  let currentWeekStart = new Date(startDate);
  while (currentWeekStart <= endDate) {
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
    const weekName = `${(currentWeekStart.getMonth() + 1).toString().padStart(2, '0')}/${currentWeekStart.getDate().toString().padStart(2, '0')} - ${(currentWeekEnd.getMonth() + 1).toString().padStart(2, '0')}/${currentWeekEnd.getDate().toString().padStart(2, '0')}`;

    weeks.push({
      name: weekName,
      value: 0,
      month: currentWeekStart.getMonth(),
      year: currentWeekStart.getFullYear()
    });

    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }

  function isDateWithinWeek(date: Date, week: Week) {
    const weekStart = new Date(`${week.year}-${week.name.split(' - ')[0]}`);
    const weekEnd = new Date(`${week.year}-${week.name.split(' - ')[1]}`);
    return date >= weekStart && date <= weekEnd;
  }

  const usedKeys: string[] = [];
  for (let interaction of allInteractions) {
    const key = `${interaction.userId}_${interaction.productId}`;
    if (usedKeys.includes(key)) {
      for (let week of weeks) {
        const interactionTimestamp = new Date(interaction.startedTime);
        // if (isDateWithinWeek(interactionTimestamp, week) && startOfTargetMonth <= interactionTimestamp && startOfAfterMonth > interactionTimestamp) {
        if (isDateWithinWeek(interactionTimestamp, week)) {
          week.value++
        }
      }
    }
    usedKeys.push(key)
  };
  return weeks
};

export const fetchProductPopularity = async (month: string) => {
  const givenMonth = parseInt(month.split('-')[0]);
  const givenYear = parseInt(month.split('-')[1]);
  const startOfTargetMonth = (new Date(givenYear, givenMonth, 1));
  const startOfNextMonth = givenMonth === 11 ? new Date(givenYear + 1, 0, 1) : (new Date(givenYear, givenMonth + 1, 1));
  const allInteractionProducts: {productId: string | null}[] = (await prisma.interaction.findMany({
    select: {
      productId: true
    },
    where: {
      startedTime: {
        gte: startOfTargetMonth,
        lt: startOfNextMonth,
      }
    }
  }));
  
  if (allInteractionProducts.length === 0) {
    return []
  };

  const allInteractionProductIds = allInteractionProducts.map(i => i.productId);

  const allProducts: ProductType[] = await prisma.product.findMany();

  if (allProducts.length === 0) {
    return []
  }
  
  const productIdCounts: Record<string, number> = {};

  try {
    for (const product of allProducts.map((i) => i.name)) {
      productIdCounts[product] = 0;
    };
  } catch (error: any) {
    throw new OperationalError("No products in the database", error)
  }

  const countMap = new Map();

  for (const item of allInteractionProductIds) {
    const currentCount = countMap.get(item) || 0;
    countMap.set(item, currentCount + 1);
  }

  const productIdToName = (Object.fromEntries(countMap));

  const formattedData = allProducts.map(({ id, name }) => ({
    name: name,
    value: productIdToName[id] || 0,
  }));

  return formattedData;
};

export const fetchUserInteraction = async () => {
  const allInteractions: {startedTime: Date}[] = (await prisma.interaction.findMany({
    select: {
      startedTime: true
    }
  }));

  if (allInteractions.length === 0) {
    return constants.ZERO_OBJECTS.USER_INTERACTIONS_ZERO
  }
  
  const allInteractionDays = allInteractions.map(i => i.startedTime.toLocaleDateString("en-us", {weekday: 'short'}));

  const formattedData = constants.DAYS_NAMES.map((day) => {
    return {
      name: day,
      value: 0
    }
  })

  for (let interactionDay of allInteractionDays) {
    for (let weekday of formattedData) {
      if (interactionDay === weekday.name) {
        weekday.value++
      }
    }
  };
  
  return formattedData
};

export const fetchPeakTime = async () => {
  const allInteractions: {startedTime: Date}[] = (await prisma.interaction.findMany({
    select: {
      startedTime: true
    }
  }));

  if (allInteractions.length === 0) {
    return constants.ZERO_OBJECTS.PEAK_TIME_ZERO
  }
  
  const allInteractionTimes = allInteractions.map(i => i.startedTime);
  
  const peakTimeData: PeakTimeData[] = [];
  
  const days: string[] = constants.DAYS_NAMES;
  
  days.forEach((day) => {
    const dayData: { x: string; y: number }[] = [];
  
    for (let hour = 0; hour < 24; hour+=3) {
      const currentTimestamp = allInteractionTimes
        .filter((timestamp) => timestamp.getDay() === days.indexOf(day))
        .filter((timestamp) => timestamp.getHours() >= hour && timestamp.getHours() < hour + 3);
  
      const count = currentTimestamp.length;
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      const ampm = hour < 12 ? "AM" : "PM";
      dayData.push({
        x: `${displayHour} ${ampm}`,
        y: count,
      });
    }
  
    peakTimeData.push({
      name: day,
      data: dayData,
    });
  });
  
  return peakTimeData;
};

export const fetchCompletionRateTable = async (completionType: string) => {
  const completionTypeOptions = Object.values(constants.INTERACTIONS_END_STATUS).map(status => status.NAME.toLowerCase());
  if (!completionTypeOptions.includes(completionType.toLowerCase())) {
    throw new ValidationError(`completion type ${completionType} not valid`)
  }
  
  const allInteractions: AdminConversationType[] = (await prisma.interaction.findMany())
  .filter((interaction: AdminConversationType) => {
    return interaction.endStatus.toLowerCase() === completionType.toLowerCase();
  })

  if (allInteractions.length === 0) {
    return []
  }
  
  const allCustomers: AdminUserType[] = await prisma.user.findMany();
  if (allCustomers.length === 0) {
    throw new ValidationError("no customers found")
  }
  const allProducts = await prisma.product.findMany();
  if (allProducts.length === 0) {
    return []
  }
  
  let index = 0
  try {
    const formattedData = allInteractions.map(i=> {
      const user = allCustomers
        .filter((user) => i.userId === user.userId)[0];
      const userLower = [user.firstName, user.lastName];
      const userUpper = !userLower[0] || !userLower[1] ? "" : `${userLower[0].charAt(0).toUpperCase() + userLower[0].slice(1)} ${userLower[1].charAt(0).toUpperCase() + userLower[1].slice(1)}`
      const userId = user.userId;

      const productName = allProducts
        .filter((product: ProductType) => i.productId === product.id)[0].name;
      
      const createdAt = i.startedTime.getTime();

      const chatId = i.userId;
      
      index++;

      return ({
        id: index,
        user: {
          id: userId,
          name: userUpper,
        },
        product: {
          title: productName,
        },
        createdAt: createdAt,
        chatId: chatId,
      })
    });
    return formattedData
  } catch (error: any) {
    throw new OperationalError("Product or Customer missing from the database", error)
  }
};

export const fetchInteractionDuration = async () => {
  const allEndedInteractions: AdminConversationType[] = await prisma.interaction.findMany({
    where: {
      endTime: {
        not: null
      }
    }
  });

  if (allEndedInteractions.length === 0) {
    return ""
  };

  const durations = allEndedInteractions
    .map(interaction => interaction.endTime!.getTime() - interaction.startedTime!.getTime())
    .filter(value => value >= 0);
  const avgDurationMinutes = durations.length === 0 ? 0 : durations.reduce((acc, curr) => acc + curr, 0) / durations.length / 60000;

  return `${Math.round(avgDurationMinutes * 60)}s`
};

export const fetchUserQueries = async () => {
  const allInteractions: AdminConversationType[] = await prisma.interaction.findMany();
  if (allInteractions.length === 0) {
    return ""
  }
  const avgResponseTimes = allInteractions.map(i => i.avgResponseTimePerQuery).filter(i => i !== 0);
  
  const avgResponseTimeInSeconds = avgResponseTimes.reduce((acc, curr) => acc + curr, 0) / avgResponseTimes.length / 1000;
  const avgResponseTimeInDecimalSeconds = Math.round(avgResponseTimeInSeconds * 10) / 10;
  
  return `${avgResponseTimeInDecimalSeconds.toFixed(1)}s`;
}



export const fetchInteractionMessages = async (interactionId: string) => {
  if (interactionId) {
      const result = await prisma.interaction.findFirst({
        where: {
          conversationId: interactionId.toString()
        }
      });

      if (!result) {
        throw new ValidationError(`interaction not found with id ${interactionId}`)
      }

      return {
        id: interactionId,
        createdAt: result.startedTime,
        data: result.messages,
        comment: result.comment
      }
  } else {
    throw new ValidationError("no interaction ID provided")
  }
  
};

export const fetchAllInteractionsRaw = async () => {
  try {
    const allInteractions = await prisma.interaction.findMany();
    if (allInteractions.length === 0) {
      return []
    } else {
      return allInteractions
    }
  } catch (error) {
    logger.info("Error fetching Admin conversations:", error)
    throw new OperationalError("An error occurred fetching interactions", new Error());  
  }
};

export const getCustomerServiceConversations = async () => {
  try {
    const response = await axiosInstance.get(`${process.env.CHATBOT_URL}/conversations/inactive`) // chatbot's customer service EP in progress
    const data = response.data
    return data
  } catch (error) {
    logger.info(error)
  }
};


type ResponseType = Chat | { msg: string };

export const getCustomerServiceConversation = async (chatId: string): Promise<ResponseType> => {
  try {
    const response = await axiosInstance.get(`${process.env.CHATBOT_URL}/conversations/inactive`);
    const data: Chat[] = response.data;

    const chat = data.find((chat) => chat.conversation_id === chatId);

    if (!chat) {
      return { msg: 'Conversation not found' };
    }

    return chat;
  } catch (error) {
    console.error(error);
    return { msg: 'Error fetching conversation' };
  }
};

export const saveMessageToChatbot = async (chatId: string, message: string) => {
  try {
    const socket = io(`http://localhost:5001/`)
    // const response = await axios.post(`${process.env.CHATBOT_URL}/endpoint/needed`, message)
    socket.emit("message", message)
  } catch (error) {
    logger.info(error)
  }
};

export const fetchAllProducts = async () => {
  const allProducts = await prisma.product.findMany();
  if (allProducts.length === 0) {
    return []
  } else {
    return allProducts
  }
};

export const fetchAllCustomers = async () => {
  const allCustomers = await prisma.user.findMany();
  if (allCustomers.length === 0) {
    return []
  } else {
    return allCustomers
  }
};


export const fetchABConversionData = async () => {
    const ABConversations: AdminConversationType[] = await fetchAllInteractionsRaw();   
    
    // const allCustomers = await fetchAllCustomers();  TODO fetch data received from chatbot
    const abChartBeginDate = new Date();
    abChartBeginDate.setDate(abChartBeginDate.getDate() - constants.AB_CHART_DURATION);
    abChartBeginDate.setHours(0,0,0,0)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    const conversationConversionCounts: { [key: string]: number } = {};
    if (!ABConversations) return []
    ABConversations.filter(
      (conversation) => 
      new Date(conversation.startedTime) >= abChartBeginDate
      && new Date(conversation.startedTime) <= yesterday
      && conversation.botSuccess
    ).forEach((conversion) => {      
        const date = new Date(conversion.startedTime);
        const day = date.toDateString();
        conversationConversionCounts[day] = (conversationConversionCounts[day] || 0) + 1;
    });

    const foundUsers: UserType[] = ABUsers.filter((user) => user.user_found)
    const userConversionCounts: { [key: string]: number } = {};
    foundUsers.filter(
      (user) =>
      new Date(user.data.session_date) >= abChartBeginDate
      && new Date(user.data.session_date) <= yesterday
      && user.data.signed_up
    ).forEach((conversion: UserType) => {
      const date = new Date(conversion.data.session_date);
      const day = date.toDateString();
      userConversionCounts[day] = (userConversionCounts[day] || 0) + 1;
    })

    const chartDates = [];
    for (let i = constants.AB_CHART_DURATION; i >= 1; i--) {
      const date = new Date();
      date.setDate(yesterday.getDate() - i + 1);
      chartDates.push(date.toDateString());
    }
    
    const abChartData = chartDates.map((day) => {
      const displayDate = `${new Date(day).toLocaleString('en-US', { month: 'short' })}-${new Date(day).getDate()}`
      const dailyConversationConversions = conversationConversionCounts[new Date(day).toDateString()] || 0
      const dailyUserConversions = userConversionCounts[new Date(day).toDateString()] || 0

      return {
        date: displayDate,
        "Saw Chatbot": dailyConversationConversions,
        "No Chatbot": dailyUserConversions
      }
    });
    
    return abChartData
}

export const fetchCostPerConversationData = async () => {
  const allConversations: AdminConversationType[] = await fetchAllInteractionsRaw()
  const conversationPriceArray = allConversations.map((conversation) => 

  Math.round((conversation.totalPromptTokensUsed || 0) * constants.GPT_INPUT_DOLLARS_PER_TOKEN * 100 +
  (conversation.totalCompletionTokensUsed || 0) * constants.GPT_OUTPUT_DOLLARS_PER_TOKEN * 100)
  
  )

  const counts: Record<number, number> = {};
  conversationPriceArray.forEach((value) => {
      counts[value] = (counts[value] || 0) + 1;
  });

  const formattedData: { x: number; y: number }[] = Object.entries(counts).map(([x, y]) => ({
      x: parseFloat(x),
      y: y
  }));
  
  return formattedData
}

export const fetchUserMessagesPerConversationData = async () => {
  const allConversations: AdminConversationType[] = await fetchAllInteractionsRaw()
  if (!allConversations || allConversations.length === 0) return []
  const userMessageCounts = allConversations.map((conversation) => {
    const conversationMessages = conversation.messages
    if (!conversationMessages) return 0
    return JSON.parse(JSON.stringify(conversationMessages)).filter((message: MessageType) => message.pov === "user").length
  })
  const formattedData = constants.USER_MESSAGE_COUNT_RANGES.map((range) => ({
    "name": range.label,
    "value": userMessageCounts.filter((value: number) => value >= range.min && (range.max === null || value <= range.max)).length
}));

  return formattedData
}


export const fetchAverageLengthOfClientMessages = async () => {
  const allConversations: AdminConversationType[] = await fetchAllInteractionsRaw(); 

  let countOfClientMessages = 0
  let totalClientWords = 0
  
  allConversations.forEach((conversation) => {

    if (conversation && conversation.messages) {
      conversation.messages.forEach((message: any) => {
        if (message.pov === "user") {
          countOfClientMessages += 1;
          totalClientWords += message.text.split(" ").length;
        }
      });
    }

  })

  const averageLength = countOfClientMessages !== 0 ? totalClientWords / countOfClientMessages : 0; //).toFixed(2)
  return averageLength;
};

export const fetchAverageLengthOfBotMessages = async () => {
  
  const allConversations: AdminConversationType[] = await fetchAllInteractionsRaw(); 

  let countOfBotMessages = 0
  let totalBotWords = 0

  allConversations.forEach((conversation) => {

    if (conversation && conversation.messages) {
      conversation.messages.forEach((message: any) => {
        if (message.pov === "bot") {
          countOfBotMessages += 1;
          totalBotWords += message.text.split(" ").length;
        }
      });
    }

  });

  const averageLength = countOfBotMessages !== 0 ? totalBotWords / countOfBotMessages : 0;
  
  return averageLength;
};

export const fetchThumbsMessagesData = async () => {
  const allConversations: { messages: JsonValue }[] = await prisma.interaction.findMany({
    select: {
      messages: true
    },
    where: {
      messageCount: {
        gt: 1
      }
    }
  });
  const thumbsUpMessages: any[] = [];
  const thumbsDownMessages: any[] = [];
  
  allConversations.forEach((conversation) => {
    if (conversation && conversation.messages) {
      (conversation.messages as any[]).forEach((message: any) => {
        if(message.pov === 'bot') {
          if (message.rating === "positive") {
            thumbsUpMessages.push(message);
          } else if (message.rating === "negative") {
            thumbsDownMessages.push(message);
          }
        }
      });
    }
  });  
  const sortedLikes = thumbsUpMessages.sort((a, b) => {
    const dateA = new Date(a.time)
    const dateB = new Date(b.time)    
    return dateB.getTime() - dateA.getTime();
  });

  const sortedDislikes = thumbsDownMessages.sort((a, b) => {
    const dateA = new Date(a.time)
    const dateB = new Date(b.time)    
    return dateB.getTime() - dateA.getTime();
  });
  const formattedData = { thumbsUpMessages: sortedLikes, thumbsDownMessages: sortedDislikes };

  return formattedData;
};

export const fetchThumbsOneConversation = async (messageId: string) => {
  const allConversations: AdminConversationType[] = await fetchAllInteractionsRaw();
  
  const conversationWithMessage = allConversations.find((conversation) =>
    conversation.messages.some((message: any) => message.id === messageId)
  );

  if (conversationWithMessage && conversationWithMessage.messages) {
    return {
      messages:conversationWithMessage.messages,
      conversationId: conversationWithMessage.conversationId,
      startedTime: conversationWithMessage.startedTime,
    }
  } else {
    return [];
  }
};



export const fetchPolicyCounter = async () => {
  
  const allConversations: AdminConversationType[] = await fetchAllInteractionsRaw(); 
  let policyCounter: number = 0

  allConversations.forEach((conversation) => {
    if (conversation.securityViolations) {
      policyCounter += conversation.securityViolations
    }

  });
  
  return policyCounter;
};

export const fetchSecurityModuleCost = async (month: string) => {
  const allConversations: AdminConversationType[] = await fetchAllInteractionsRaw(); 

  let firstWeekSecurity = 0
  let firstWeekConversation = 0
  let secondWeekSecurity = 0
  let secondWeekConversation = 0
  let thirdWeekSecurity = 0
  let thirdWeekConversation = 0
  let lastWeekSecurity = 0
  let lastWeekConversation = 0

  const givenMonth = parseInt(month.split('-')[0]);
  const givenYear = parseInt(month.split('-')[1]);
  const startOfTargetMonth = (new Date(givenYear, givenMonth, 1));
  const startOfNextMonth = givenMonth === 11 ? new Date(givenYear + 1, 0, 1) : (new Date(givenYear, givenMonth + 1, 1));

  const conversationsInChoosenDate:AdminConversationType[] = []

  allConversations.filter(conversation => {
    const conversationDate = new Date(conversation.startedTime);
    if(conversationDate >= startOfTargetMonth && conversationDate < startOfNextMonth) {
      conversationsInChoosenDate.push(conversation)
    }
  });

  if(conversationsInChoosenDate.length) {
    
    conversationsInChoosenDate.forEach((conversation: any) => {
      const date = new Date(conversation.startedTime) 
      const dayOfMonth = date.getDate();

      const isFirstSevenDaysOfMonth = dayOfMonth <= 7;
      const isSecondWeekOfMonth = dayOfMonth >= 7 && dayOfMonth <= 14;
      const isThirdWeekOfMonth = dayOfMonth >= 14 && dayOfMonth <= 21;
      const isLastWeekOfMonth = dayOfMonth >= 21 && dayOfMonth < 32;
  
    if (isFirstSevenDaysOfMonth) {
      if (conversation.securityPromptTokens && conversation.securityCompletionTokens) {
        firstWeekSecurity += conversation.securityCompletionTokens * constants.GPT_OUTPUT_DOLLARS_PER_TOKEN + conversation.securityPromptTokens * constants.GPT_INPUT_DOLLARS_PER_TOKEN
      }
      if (conversation.conversationCompletionTokens && conversation.conversationPromptTokens) {
        firstWeekConversation += conversation.conversationCompletionTokens * constants.GPT_OUTPUT_DOLLARS_PER_TOKEN + conversation.conversationPromptTokens * constants.GPT_INPUT_DOLLARS_PER_TOKEN
      }
    }
    if (isSecondWeekOfMonth) {
      if (conversation.securityPromptTokens && conversation.securityCompletionTokens) {
        secondWeekSecurity += conversation.securityCompletionTokens * constants.GPT_OUTPUT_DOLLARS_PER_TOKEN + conversation.securityPromptTokens * constants.GPT_INPUT_DOLLARS_PER_TOKEN
      }
      if (conversation.conversationCompletionTokens && conversation.conversationPromptTokens) {
        secondWeekConversation += conversation.conversationCompletionTokens * constants.GPT_OUTPUT_DOLLARS_PER_TOKEN + conversation.conversationPromptTokens * constants.GPT_INPUT_DOLLARS_PER_TOKEN
      }
    }
    if (isThirdWeekOfMonth) {
      if (conversation.securityPromptTokens && conversation.securityCompletionTokens) {
        thirdWeekSecurity += conversation.securityCompletionTokens * constants.GPT_OUTPUT_DOLLARS_PER_TOKEN + conversation.securityPromptTokens * constants.GPT_INPUT_DOLLARS_PER_TOKEN
      }
      if (conversation.conversationCompletionTokens && conversation.conversationPromptTokens) {
        thirdWeekConversation += conversation.conversationCompletionTokens * constants.GPT_OUTPUT_DOLLARS_PER_TOKEN + conversation.conversationPromptTokens * constants.GPT_INPUT_DOLLARS_PER_TOKEN
      }
    }
    if (isLastWeekOfMonth) {
      if (conversation.securityPromptTokens && conversation.securityCompletionTokens) {
        lastWeekSecurity += conversation.securityCompletionTokens * constants.GPT_OUTPUT_DOLLARS_PER_TOKEN + conversation.securityPromptTokens * constants.GPT_INPUT_DOLLARS_PER_TOKEN
      }
      if (conversation.conversationCompletionTokens && conversation.conversationPromptTokens) {
        lastWeekConversation += conversation.conversationCompletionTokens * constants.GPT_OUTPUT_DOLLARS_PER_TOKEN + conversation.conversationPromptTokens * constants.GPT_INPUT_DOLLARS_PER_TOKEN
      }
    }
  })
  } else {
    firstWeekSecurity = 0
    firstWeekConversation = 0
    secondWeekSecurity = 0
    secondWeekConversation = 0
    thirdWeekSecurity = 0
    thirdWeekConversation = 0
    lastWeekSecurity = 0
    lastWeekConversation = 0
  }

const date = startOfTargetMonth 
const currentMonth = date.getMonth()

const nextMonth = new Date();
nextMonth.setMonth(currentMonth + 1, 1);
nextMonth.setDate(0);
const lastDayOfMonth = nextMonth.getDate();  

const formattedData = [
  {
    name: `${hardcodedConstants.MONTH_NAMES[currentMonth]} 1-7`,
    Security: firstWeekSecurity.toFixed(2),
    Conversation: firstWeekConversation.toFixed(2),
  },
  {
    name: `${hardcodedConstants.MONTH_NAMES[currentMonth]} 8-14`,
    Security: secondWeekSecurity.toFixed(2),
    Conversation: secondWeekConversation.toFixed(2),
  },
  {
    name: `${hardcodedConstants.MONTH_NAMES[currentMonth]} 15-21`,
    Security: thirdWeekSecurity.toFixed(2),
    Conversation: thirdWeekConversation.toFixed(2),
  },
  {
    name: `${hardcodedConstants.MONTH_NAMES[currentMonth]} 22-${lastDayOfMonth}`,
    Security: lastWeekSecurity.toFixed(2),
    Conversation: lastWeekConversation.toFixed(2),
  },
]

return formattedData;
};

export const fetchAverageResponseTimeFromClient = async () => {
  try {
    const allConversations: AdminConversationType[] = await fetchAllInteractionsRaw();
    let totalResponseTime = 0;
    let count = 0;

    allConversations.forEach((conversation) => {
      if (conversation.messages) { 
        for (let i = 0; i < conversation.messages.length - 1; i++) {
          const currentMessage = conversation.messages[i]
          const nextMessage = conversation.messages[i + 1]
          
          if (currentMessage.pov === 'bot' && nextMessage.pov === 'user') {

              const dateBot = new Date(currentMessage.time)
              const dateUser = new Date(nextMessage.time)

              const botTimeSec = dateBot.getTime()
              const userTimeSec = dateUser.getTime()

              const responseTime = userTimeSec - botTimeSec

              
              totalResponseTime += responseTime / 1000
              count++;
          }
        }
      }
    });

    if (count === 0) {
      return 0;
    }

    const averageResponseTime = totalResponseTime / count
    
    if(averageResponseTime > 60 && averageResponseTime < 3600) {
      const minutes = Math.floor(averageResponseTime / 60)
      const remainingSeconds = Math.round(averageResponseTime % 60)

      return `${minutes} min ${remainingSeconds} sec`
    } if(averageResponseTime >= 3600) {
      const hours: any = Math.floor(averageResponseTime / 3600)
      let minutes: any = Math.floor((averageResponseTime % 3600) / 60)
      let remainingSeconds: any = averageResponseTime % 60
      
      minutes = (minutes < 10) ? "0" + minutes : minutes
      remainingSeconds = (remainingSeconds < 10) ? "0" + Math.floor(remainingSeconds) : Math.floor(remainingSeconds)

      return `${hours} h ${minutes} min ${remainingSeconds} sec`

    } else {
      return `${Math.floor(averageResponseTime)} sec`
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const fetchDataForMainContainer = async () => {
  
  const allConversations: AdminConversationType[] = await fetchAllInteractionsRaw(); 
  let allConversationsCount: number = allConversations.length
  let allMessagesCount: number = 0

  allConversations.forEach((conversation) => {
    if (conversation.messages) {
      allMessagesCount += conversation.messages.length
    }
  });

  const avgResponseTimes = allConversations.map(i => i.avgResponseTimePerQuery).filter(i => i !== 0);
  
  const avgResponseTimeInSeconds = avgResponseTimes.reduce((acc, curr) => acc + curr, 0) / avgResponseTimes.length / 1000;
  const avgResponseTimeInDecimalSeconds = avgResponseTimeInSeconds? Math.round(avgResponseTimeInSeconds * 10) / 10 : 0

  const dataForMainContainer = [
  {
    allConversationsCount: allConversationsCount,
    allMessagesCount: allMessagesCount,
    avgResponseTimeInDecimalSeconds: avgResponseTimeInDecimalSeconds,
  }]
  
  return dataForMainContainer;
};


export const fetchAverageWordsMonthly = async (month: string) => {
  const allConversations: AdminConversationType[] = await fetchAllInteractionsRaw(); 
  const givenMonth = parseInt(month.split('-')[0]);
  const givenYear = parseInt(month.split('-')[1]);
  const startOfTargetMonth = new Date(givenYear, givenMonth, 1);
  const startOfNextMonth = new Date(givenYear, givenMonth + 1, 1);
  const lastDayOfMonth = new Date(givenYear, givenMonth + 1, 0).getDate();
  const formattedData: {name: string, Bot: string, User: string}[] = [];

  const getAverageWords = (startDay: number, endDay: number) => {
    let countOfClientMessages = 0;
    let totalClientWords = 0;
    let countOfBotMessages = 0;
    let totalBotWords = 0;

    let conversationsInChoosenDate: AdminConversationType[] = [];

    conversationsInChoosenDate = allConversations.filter(conversation => {
      const conversationDate = new Date(conversation.startedTime);
      return conversationDate >= startOfTargetMonth && conversationDate < startOfNextMonth;
    });

    conversationsInChoosenDate.forEach((conversation: any) => {
      const date = new Date(conversation.startedTime);
      const dayOfMonth = date.getDate();

      if (dayOfMonth >= startDay && dayOfMonth <= endDay) {
        conversation.messages.forEach((message: any) => {
          if (message.pov === "user") {
            countOfClientMessages += 1;
            totalClientWords += message.text.split(" ").length;
          }
          if (message.pov === "bot") {
            countOfBotMessages += 1;
            totalBotWords += message.text.split(" ").length;
          } 
        });
      }
    });

    const userAverageWords = countOfClientMessages !== 0 ? totalClientWords / countOfClientMessages : 0;
    const botAverageWords = countOfBotMessages !== 0 ? totalBotWords / countOfBotMessages : 0;

    return { userAverageWords, botAverageWords };
  };

  const weekRanges = [
    { start: 1, end: 7 },
    { start: 8, end: 14 },
    { start: 15, end: 21 },
    { start: 22, end: lastDayOfMonth }
  ];

  weekRanges.forEach(range => {
    const { start, end } = range;
    const { userAverageWords, botAverageWords } = getAverageWords(start, end);
    formattedData.push({
      name: `${hardcodedConstants.MONTH_NAMES[givenMonth]} ${start}-${end}`,
      Bot: botAverageWords.toFixed(0),
      User: userAverageWords.toFixed(0)
    });
  });
  return formattedData;
};

