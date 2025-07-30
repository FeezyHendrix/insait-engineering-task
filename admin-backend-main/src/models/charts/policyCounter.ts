import hardcodedConstants from '../../constants'
import { prisma } from '../../libs/prisma';
import { useOptionalFlowId } from '../../utils/charts';

export const fetchPolicyCounter = async (month: string, flowId?: string | null) => {
  const allConversations: {startedTime: Date, securityViolations: number | null}[] = await prisma.interaction.findMany({
    where: {
      messageCount: {
        gt: 1
      },
      ...useOptionalFlowId(flowId),
    },
    select: {
      startedTime: true,
      securityViolations: true
    }
  })
  let firstWeek = 0
  let secondWeek = 0
  let thirdWeek = 0
  let lastWeek = 0

  const givenMonth = parseInt(month.split('-')[0]);
  const givenYear = parseInt(month.split('-')[1]);
  const startOfTargetMonth = (new Date(givenYear, givenMonth, 1));
  const startOfNextMonth = givenMonth === 11 ? new Date(givenYear + 1, 0, 1) : (new Date(givenYear, givenMonth + 1, 1));

  const conversationsInChoosenDate: {startedTime: Date, securityViolations: number | null}[] = []

  allConversations.filter(conversation => {
    const conversationDate = new Date(conversation.startedTime);
    if(conversationDate >= startOfTargetMonth && conversationDate < startOfNextMonth) {
      conversationsInChoosenDate.push(conversation)
    }
  });

  if(conversationsInChoosenDate.length) {
    
    conversationsInChoosenDate.forEach((conversation) => {
      const date = new Date(conversation.startedTime) 
      const dayOfMonth = date.getDate();

      const isFirstSevenDaysOfMonth = dayOfMonth <= 7;
      const isSecondWeekOfMonth = dayOfMonth >= 7 && dayOfMonth <= 14;
      const isThirdWeekOfMonth = dayOfMonth >= 14 && dayOfMonth <= 21;
      const isLastWeekOfMonth = dayOfMonth >= 21 && dayOfMonth < 32;
  
  
      if(conversation.securityViolations) {
          if (isFirstSevenDaysOfMonth) {
              firstWeek += conversation.securityViolations
          }    
          if (isSecondWeekOfMonth) {
              secondWeek += conversation.securityViolations
          }
          if (isThirdWeekOfMonth) {
              thirdWeek += conversation.securityViolations
          }
          if (isLastWeekOfMonth) {
              lastWeek += conversation.securityViolations
          } 
      }        
    })
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
        value: firstWeek,
      },
      {
        name: `${hardcodedConstants.MONTH_NAMES[currentMonth]} 8-14`,
        value: secondWeek,
      },
      {
        name: `${hardcodedConstants.MONTH_NAMES[currentMonth]} 15-21`,
        value: thirdWeek,
      },
      {
        name: `${hardcodedConstants.MONTH_NAMES[currentMonth]} 22-${lastDayOfMonth}`,
        value: lastWeek,
      },
  ]

  return formattedData;
};
