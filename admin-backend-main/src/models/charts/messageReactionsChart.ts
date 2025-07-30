import { JsonValue } from "@prisma/client/runtime/library";
import { prisma } from "../../libs/prisma";
import { getDateRange, useOptionalFlowId } from "../../utils/charts";
import constants from "../../constants";

export const fetchMessageReactionsChart = async (month: string, flowId?: string | null) => {
  const { startDate, endDate } = getDateRange(month);

    const allConversations: {messages: any, startedTime: Date}[] = await prisma.interaction.findMany({
      where: {
        startedTime: {
          gte: startDate,
          lte: endDate,
        },
        messageCount: {
          gt: 1,
        },
        ...useOptionalFlowId(flowId),
      },
      select: {
        messages: true,
        startedTime: true
      },
    });
  
    let firstWeekPositive = 0
    let firstWeekNegative = 0
    let secondWeekpositive = 0
    let secondWeeknegative = 0
    let thirdWeekPositive = 0
    let thirdWeekNegative = 0
    let fourthWeekPositive = 0
    let fourthWeekNegative = 0
  
    const givenMonth = parseInt(month.split('-')[0]);
    const givenYear = parseInt(month.split('-')[1]);
    const startOfTargetMonth = (new Date(givenYear, givenMonth, 1));
    const startOfNextMonth = givenMonth === 11 ? new Date(givenYear + 1, 0, 1) : (new Date(givenYear, givenMonth + 1, 1));  
  
    if(allConversations.length) {
      
      allConversations.forEach((conversation) => {
        const date = new Date(conversation.startedTime) 
        const dayOfMonth = date.getDate();
  
        const isFirstSevenDaysOfMonth = dayOfMonth <= 7;
        const isSecondWeekOfMonth = dayOfMonth >= 7 && dayOfMonth <= 14;
        const isThirdWeekOfMonth = dayOfMonth >= 14 && dayOfMonth <= 21;
        const isLastWeekOfMonth = dayOfMonth >= 21 && dayOfMonth < 32;
    
      
      if (isFirstSevenDaysOfMonth && conversation.messages?.length) {
        conversation.messages.forEach((message: any) => {
          if(message.pov && message.pov === 'bot') {
            if (message.rating === "positive") {
              firstWeekPositive += 1
            } else if (message.rating === "negative") {
              firstWeekNegative += 1
            }
          }
        })
      }
      if (isSecondWeekOfMonth && conversation.messages?.length) {
        conversation.messages.forEach((message: any) => {
          if(message.pov && message.pov === 'bot') {
            if (message.rating === "positive") {
              secondWeekpositive += 1
            } else if (message.rating === "negative") {
              secondWeeknegative += 1
            }
          }
        })
      }
      if (isThirdWeekOfMonth && conversation.messages?.length) {
        conversation.messages.forEach((message: any) => {
          if(message.pov && message.pov === 'bot') {
            if (message.rating === "positive") {
              thirdWeekPositive += 1
            } else if (message.rating === "negative") {
              thirdWeekNegative += 1
            }
          }
        })
      }
      if (isLastWeekOfMonth && conversation.messages?.length) {
        conversation.messages.forEach((message: any) => {
          if(message.pov && message.pov === 'bot') {
            if (message.rating === "positive") {
              fourthWeekPositive += 1
            } else if (message.rating === "negative") {
              fourthWeekNegative += 1
            }
          }
        })
      }
    });
    }
  
    const date = startOfTargetMonth 
    const currentMonth = date.getMonth()
  
    const nextMonth = new Date();
    nextMonth.setMonth(currentMonth + 1, 1);
    nextMonth.setDate(0);
    const lastDayOfMonth = nextMonth.getDate(); 
    
    const formattedData = [
      {
        name: `${constants.MONTH_NAMES[currentMonth]} 1-7`,
        Likes: firstWeekPositive,
        Dislikes: firstWeekNegative,
      },
      {
        name: `${constants.MONTH_NAMES[currentMonth]} 8-14`,
        Likes: secondWeekpositive,
        Dislikes: secondWeeknegative,
      },
      {
        name: `${constants.MONTH_NAMES[currentMonth]} 15-21`,
        Likes: thirdWeekPositive,
        Dislikes: thirdWeekNegative,
      },
      {
        name: `${constants.MONTH_NAMES[currentMonth]} 22 - ${lastDayOfMonth}`,
        Likes: fourthWeekPositive,
        Dislikes: fourthWeekNegative,
      },
    ]
    
    return formattedData;
  };