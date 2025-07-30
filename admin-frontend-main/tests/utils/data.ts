import dayjs from 'dayjs'
import {
  AnsweredUnansweredData,
  MessageReactionsChartData,
  UserRatingData,
} from '../mswUtils/msw.type'
import chatMockData from './ss3.json' assert { type: 'json' }
import completedSessionMockData from './completedSession.json' assert { type: 'json' }
import { conversationDurationMockData, mockUserReturnData, topLinksClickedMockData, userPersonaSample } from '@/utils/mock'
import { generateGroupedData, getReducedValue, getReductionFactor, getValidatedDateRange, interpolateRange, randomBetween } from "./msw-date"

const generateMonthLabel = (monthsAgo: number): string => {
  const targetDate = generatePastTimestamp(monthsAgo)
  const monthKey = `${targetDate.getMonth()}-${targetDate.getFullYear()}`;
  return monthKey;
}

const generatePastTimestamp = (monthsAgo: number): Date => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  return date;
}

const generateDateLabelForWeek = (
  data: any[],
  monthsAgo: number,
  secondaryLabel?: string,
  label: string = 'name',
) => {
  const targetDate = generatePastTimestamp(monthsAgo)
  const monthName = targetDate.toLocaleString('en-US', { month: 'short' });

  const lastDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth() + 1,
    0
  ).getDate();

  const weekRanges = ['1-7', '8-14', '15-21', `22-${lastDay}`];

  return data.map((week, index) => {
    const baseObject = {
      ...week,
      [label]: `${monthName} ${weekRanges[index]}`
    };

    if (secondaryLabel) {
      baseObject[secondaryLabel] = `${monthName} ${weekRanges[index]}`;
    }

    return baseObject;
  });
}
const answeredAndUnansweredData: AnsweredUnansweredData = {
  [generateMonthLabel(0)]: generateDateLabelForWeek([
    {
      name: '',
      'Answered Questions': 580,
      'Unanswered Questions': 25,
    },
    {
      name: '',
      'Answered Questions': 610,
      'Unanswered Questions': 30,
    },
    {
      name: '',
      'Answered Questions': 595,
      'Unanswered Questions': 28,
    },
    {
      name: '',
      'Answered Questions': 620,
      'Unanswered Questions': 32,
    },
  ], 0),
  [generateMonthLabel(1)]: generateDateLabelForWeek([
    {
      name: '',
      'Answered Questions': 528,
      'Unanswered Questions': 20,
    },
    {
      name: '',
      'Answered Questions': 563,
      'Unanswered Questions': 24,
    },
    {
      name: '',
      'Answered Questions': 25,
      'Unanswered Questions': 1,
    },
    {
      name: '',
      'Answered Questions': 20,
      'Unanswered Questions': 1,
    },
  ], 1),
  [generateMonthLabel(2)]: generateDateLabelForWeek([
    {
      name: '',
      'Answered Questions': 495,
      'Unanswered Questions': 18,
    },
    {
      name: '',
      'Answered Questions': 520,
      'Unanswered Questions': 22,
    },
    {
      name: '',
      'Answered Questions': 505,
      'Unanswered Questions': 19,
    },
    {
      name: '',
      'Answered Questions': 530,
      'Unanswered Questions': 23,
    },
  ], 2),
  [generateMonthLabel(3)]: generateDateLabelForWeek([
    {
      name: '',
      'Answered Questions': 480,
      'Unanswered Questions': 15,
    },
    {
      name: '',
      'Answered Questions': 510,
      'Unanswered Questions': 18,
    },
    {
      name: '',
      'Answered Questions': 495,
      'Unanswered Questions': 16,
    },
    {
      name: '',
      'Answered Questions': 525,
      'Unanswered Questions': 20,
    },
  ], 3),
  [generateMonthLabel(4)]: generateDateLabelForWeek([
    {
      name: '',
      'Answered Questions': 450,
      'Unanswered Questions': 12,
    },
    {
      name: '',
      'Answered Questions': 475,
      'Unanswered Questions': 14,
    },
    {
      name: '',
      'Answered Questions': 460,
      'Unanswered Questions': 13,
    },
    {
      name: '',
      'Answered Questions': 490,
      'Unanswered Questions': 15,
    },
  ], 4),
  [generateMonthLabel(5)]: generateDateLabelForWeek([
    {
      name: '',
      'Answered Questions': 420,
      'Unanswered Questions': 10,
    },
    {
      name: '',
      'Answered Questions': 445,
      'Unanswered Questions': 12,
    },
    {
      name: '',
      'Answered Questions': 430,
      'Unanswered Questions': 11,
    },
    {
      name: '',
      'Answered Questions': 455,
      'Unanswered Questions': 13,
    },
  ], 5),
  [generateMonthLabel(6)]: generateDateLabelForWeek([
    {
      name: '',
      'Answered Questions': 0,
      'Unanswered Questions': 0,
    },
    {
      name: '',
      'Answered Questions': 1,
      'Unanswered Questions': 0,
    },
    {
      name: '',
      'Answered Questions': 46,
      'Unanswered Questions': 0,
    },
    {
      name: '',
      'Answered Questions': 102,
      'Unanswered Questions': 20,
    },
  ], 6),
}


const userRatingData: UserRatingData = {
  [generateMonthLabel(0)]: { '5': 4, '4': 1, },
  [generateMonthLabel(1)]: { '5': 4, '4': 3, '3': 1 },
  [generateMonthLabel(2)]: { '5': 3, '4': 1, '3': 1 },
  [generateMonthLabel(3)]: { '5': 2, '4': 1, },
  [generateMonthLabel(4)]: { '5': 3, '4': 5, '3': 1 },
  [generateMonthLabel(5)]: { '5': 3, '4': 1, },
  [generateMonthLabel(6)]: { '5': 2, '4': 2, '2': 1 },
}

const messageReactionsChartData: MessageReactionsChartData = {
  [generateMonthLabel(0)]: generateDateLabelForWeek([
    {
      name: 'Nov 1-7',
      Likes: 0,
      Dislikes: 1,
    },
    {
      name: 'Nov 8-14',
      Likes: 1,
      Dislikes: 3,
    },
    {
      name: 'Nov 15-21',
      Likes: 1,
      Dislikes: 0,
    },
    {
      name: 'Nov 22-29',
      Likes: 0,
      Dislikes: 0,
    },
  ], 0),
  [generateMonthLabel(1)]: generateDateLabelForWeek([
    {
      name: 'Oct 1-7',
      Likes: 2,
      Dislikes: 1,
    },
    {
      name: 'Oct 8-14',
      Likes: 3,
      Dislikes: 2,
    },
    {
      name: 'Oct 15-21',
      Likes: 1,
      Dislikes: 4,
    },
    {
      name: 'Oct 22-30',
      Likes: 0,
      Dislikes: 3,
    },
  ], 1),
  [generateMonthLabel(2)]: generateDateLabelForWeek([
    {
      name: 'Sep 1-7',
      Likes: 4,
      Dislikes: 0,
    },
    {
      name: 'Sep 8-14',
      Likes: 2,
      Dislikes: 2,
    },
    {
      name: 'Sep 15-21',
      Likes: 3,
      Dislikes: 1,
    },
    {
      name: 'Sep 22-30',
      Likes: 1,
      Dislikes: 3,
    },
  ], 2),
  [generateMonthLabel(3)]: generateDateLabelForWeek([
    {
      name: 'Aug 1-7',
      Likes: 1,
      Dislikes: 2,
    },
    {
      name: 'Aug 8-14',
      Likes: 2,
      Dislikes: 1,
    },
    {
      name: 'Aug 15-21',
      Likes: 3,
      Dislikes: 0,
    },
    {
      name: 'Aug 22-31',
      Likes: 0,
      Dislikes: 4,
    },
  ], 3),
  [generateMonthLabel(4)]: generateDateLabelForWeek([
    {
      name: 'Jul 1-7',
      Likes: 2,
      Dislikes: 3,
    },
    {
      name: 'Jul 8-14',
      Likes: 1,
      Dislikes: 1,
    },
    {
      name: 'Jul 15-21',
      Likes: 3,
      Dislikes: 2,
    },
    {
      name: 'Jul 22-31',
      Likes: 0,
      Dislikes: 0,
    },
  ], 4),
  [generateMonthLabel(5)]: generateDateLabelForWeek([
    {
      name: 'Jun 1-7',
      Likes: 4,
      Dislikes: 1,
    },
    {
      name: 'Jun 8-14',
      Likes: 2,
      Dislikes: 2,
    },
    {
      name: 'Jun 15-21',
      Likes: 1,
      Dislikes: 3,
    },
    {
      name: 'Jun 22-30',
      Likes: 3,
      Dislikes: 0,
    },
  ], 5),
  [generateMonthLabel(6)]: generateDateLabelForWeek([
    {
      name: 'May 1-7',
      Likes: 1,
      Dislikes: 4,
    },
    {
      name: 'May 8-14',
      Likes: 2,
      Dislikes: 1,
    },
    {
      name: 'May 15-21',
      Likes: 3,
      Dislikes: 2,
    },
    {
      name: 'May 22-31',
      Likes: 0,
      Dislikes: 3,
    },
  ], 6),
}

const userExposureData = {
  "data": [
    473,
    500,
    700
  ],
  "categories": [
    "Messaged Agent",
    "Saw Agent's Initial Message",
    "Saw Agent Button"
  ]
}


export const earliestInteractionTimestampMock = generatePastTimestamp(4).toISOString();

export const generateAdvancedAnalyticsData = (monthYear: string | null) => {
  if (!monthYear) return {}
  const [month, year] = monthYear.split('-')
  return {
    earliestInteractionTimestamp: earliestInteractionTimestampMock,
    sentimentDonutData: {},
    userPersonaData: {},
    conversationDepthBarData: [],
    userReturnData: mockUserReturnData?.filter(
      (item) => item.year === +year && item.month === +month
    ),
  }
}

export const mockUnansweredQuestions = [
  {
    unansweredQId: '68712e16-581c-43b1-b256-97a8a2078d2a',
    conversationId: '742676925',
    question: 'what happens next after providing job description',
    answer:
      "Now that we have your job description, we'll match your request with skilled individuals who specialize in wall removals in your area. They will review your job details and, if it fits their expertise and schedule, they will reach out to you directly with quotes or to gather more information if needed. You can expect to hear from them soon, typically within a few hours to a couple of days, depending on the availability of service providers in Bowral.",
    reason: 'Criteria 1',
    createdAt: '2024-05-29 08:11:39.918342',
    archive: false,
  },
  {
    unansweredQId: '4a239a1c-e7d8-4b67-9dc5-a6a45d053dcf',
    conversationId: '580626373',
    question: 'average cost for dog walking service',
    answer:
      "I'm sorry, but I don't have the specific information on the average cost for dog walking services at the moment. Costs can vary widely depending on factors such as the duration of the walks, the number of dogs, and the specific services provided. It might be helpful to post your job on our platform, so you can receive quotes directly from service providers. This way, you can get a better idea of the current market rates for dog walking in Alice Springs. Would you like to proceed without specifying a budget, or do you have a budget range in mind based on this information?",
    reason: 'Criteria 1',
    createdAt: '2024-05-31 06:30:04.873135',
    archive: false,
  },
  {
    unansweredQId: '55406de7-f26f-423e-a277-f57249e1e23e',
    conversationId: '288363053',
    question: 'how can you resume a job?',
    answer:
      "I'm sorry, but it seems I don't have the specific information on how to resume a job directly. For detailed assistance on managing your job postings, including resuming a paused or stopped job, I recommend visiting the Service Seeking website or contacting our support team directly. They will be able to provide you with step-by-step guidance.\n\nIs there anything else I can assist you with related to finding a service provider?",
    reason: 'Criteria 1',
    createdAt: '2024-06-04 04:30:10.165707',
    archive: false,
  },
  {
    unansweredQId: 'dc1d700c-c96b-4016-8bf2-45564a7eb9f4',
    conversationId: '677224686',
    question: 'Thornlie roof tiling australia owner name',
    answer:
      "I'm sorry, but I don't have the specific information about the owner of a roof tiling business in Thornlie, Australia. If you're looking to get in touch with roof tiling services in Thornlie or need assistance with a related service, I can certainly help you find the right service provider. Could you please tell me more about the service you need?",
    reason: 'Criteria 1',
    createdAt: '2024-06-04 13:30:13.306841',
    archive: false,
  },
  {
    unansweredQId: '72ac5abf-c03b-495b-9ff8-fe959259d190',
    conversationId: '86206158',
    question: 'what time do you close',
    answer:
      "It seems I don't have the specific information you're looking for regarding our closing time. However, you can upload the fresh photo at any time that's convenient for you tonight, and we'll process it as soon as possible. Is there anything else you'd like to know or add about the job?",
    reason: 'Criteria 1',
    createdAt: '2024-06-05 08:30:09.195265',
    archive: false,
  },
  {
    unansweredQId: '41f6fd0a-dc96-4b90-a66a-6422bef88a58',
    conversationId: '793146532',
    question: 'What is the mobile number of the local minister?',
    answer:
      "I'm sorry, but I don't have the information regarding the mobile number of the local minister. For specific contacts like these, it might be best to check official government websites or local council contacts. \n\nIs there anything else related to finding services or posting a job on Service Seeking that I can assist you with?",
    reason: 'Criteria 1',
    createdAt: '2024-06-07 14:30:10.276250',
    archive: false,
  },
  {
    unansweredQId: '064b14bf-6931-413d-82d0-3bcd7b1fc5ac',
    conversationId: '326296072',
    question: 'are a bot or live person',
    answer:
      "I'm here to assist you efficiently with your service needs. Could you please tell me the name of the suburb you live in? This information will help us find the right mechanic in your area.",
    reason: 'Criteria 1',
    createdAt: '2024-06-06 12:38:30.962740',
    archive: true,
  },
  {
    unansweredQId: 'bc165144-db06-4180-8c10-c2160d3526a2',
    conversationId: '180237735',
    question:
      'How do I make a Complaint against a businessif they do a bad job\n',
    answer:
      "If you're not satisfied with the work done by a business, you can leave them a negative rating and review on our platform. Just log in to your account, select the business you hired, and follow the prompts to leave your feedback. For serious complaints, please email us at support@serviceseeking.com.au with the details. We'll do our best to address the issue and may refer you to the relevant consumer authority if needed. \n\nNow, could you please provide your phone number so we can finalize your job posting?",
    reason: 'Criteria 2',
    createdAt: '2024-06-17 15:30:10.897790',
    archive: false,
  },
  {
    unansweredQId: 'e1bb3ab8-f01b-41c9-a01d-37ef024cfd8a',
    conversationId: '784679723',
    question: 'Hi, are you a human?',
    answer:
      "I'm here to assist you with finding the right service provider for your needs. Could you please tell me what kind of service you are looking for?",
    reason: 'Criteria 1',
    createdAt: '2024-06-18 03:30:11.123580',
    archive: false,
  },
  {
    unansweredQId: '13356058-1582-480f-b532-4523f98884c6',
    conversationId: '238282210',
    question: 'are you a person or bot',
    answer:
      "I'm here to assist you with finding the right service for your needs. How can I help you today? Are you looking to hire a specific type of service?",
    reason: 'Criteria 1',
    createdAt: '2024-06-21 01:31:22.930857',
    archive: false,
  },
  {
    unansweredQId: '1979bc60-4038-4620-a3a7-7c762ad51099',
    conversationId: '238282210',
    question: 'what does award mean?',
    answer:
      "I'm sorry, but the information provided doesn't directly answer your question about what \"award\" means in the context you're asking. Could you please clarify if you're referring to how awards work within the Service Seeking platform or something else related to job postings? This will help me assist you better.",
    reason: 'Criteria 1',
    createdAt: '2024-06-21 01:31:22.930891',
    archive: false,
  },
  {
    unansweredQId: '5e23a50f-19ab-4da9-90da-19b97ef92c11',
    conversationId: '475299844',
    question:
      'I’ve confirmed one job. How should I stop the quotes and update the status?',
    answer:
      'To stop receiving quotes and update the status after confirming a job, please log in to ServiceSeeking.com.au with your email and password. Then, navigate to the Job page for the relevant job and click "Update Status". You can indicate who you hired or leave a rating if the job has been completed. Submitting this information will close your job, and you won\'t receive any new contacts.\n\nIf you have any more questions or need further assistance, feel free to ask!',
    reason: 'Criteria 2',
    createdAt: '2024-06-21 12:30:48.136941',
    archive: false,
  },
  {
    unansweredQId: '79487b83-a989-47d5-b956-c7b74d372459',
    conversationId: '600580930',
    question: 'can you tell me about UBC?',
    answer:
      "I'm sorry, but I don't have information about UBC. If you have any questions related to finding service providers for specific jobs or need assistance with posting a job on Service Seeking, I'd be happy to help. What service are you looking for?",
    reason: 'Criteria 1',
    createdAt: '2024-06-22 01:31:27.299970',
    archive: false,
  },
  {
    unansweredQId: 'd8459818-dc99-4601-ac83-6d5f2d9473ce',
    conversationId: '204718824',
    question: 'i cant get access to my account and i have quotes there',
    answer:
      "It sounds like you're having trouble accessing your account to view your quotes. To reset your password, please go to our login page, enter your email address, and follow the prompts. If you've already tried resetting your password and still can't access your account, it might be a browser cache issue. Try clearing your browser's cache and stored passwords. This can usually be done in the History section of your browser, under \"Clear browsing data.\"\n\nIf you continue to have issues, please let me know so I can assist you further. Meanwhile, could you tell me what service you're looking for? This way, I can help you get the quotes you need.",
    reason: 'Criteria 2',
    createdAt: '2024-06-23 01:31:51.923680',
    archive: false,
  },
  {
    unansweredQId: '9dd2ae02-ebde-4524-ad2d-049556257af6',
    conversationId: '532300139',
    question: 'How can I put reviews?',
    answer:
      "To leave a review, please log in to your account on ServiceSeeking.com.au. Ensure you've selected the business you hired for your job, then follow the prompts to leave a star rating and review. It's important to adhere to our [Review Guidelines](link) to ensure your review will be published. For more serious concerns, you can email support@serviceseeking.com.au with the details of your issue. Our team will do their best to assist you.\n\nIf you're looking to post a new job or need assistance with another service, feel free to let me know how I can help!",
    reason: 'Criteria 2',
    createdAt: '2024-06-23 07:32:14.393799',
    archive: false,
  },
  {
    unansweredQId: 'f677ea2a-58aa-48f8-87d2-6716cb440563',
    conversationId: '363787098',
    question: 'how can i leave a review for a business ',
    answer:
      "To leave a review for a business on Service Seeking, please log in to your account, ensure you've selected the business you hired for your job, and then follow the prompts to leave a star rating and review. Make sure your review adheres to our Review Guidelines for it to be published. For more serious complaints, you can contact support@serviceseeking.com.au with the details. \n\nIf you're looking to hire a service or need assistance with another matter, feel free to let me know how I can assist you further!",
    reason: 'Criteria 2',
    createdAt: '2024-06-23 11:31:59.716020',
    archive: false,
  },
  {
    unansweredQId: '39e4c3be-918a-419d-a9a3-090be7a8a036',
    conversationId: '500030421',
    question: 'How do I leave a review ',
    answer:
      "To leave a review, please log in to your account, select the business you hired for your job, and then follow the prompts to leave a star rating and review. Make sure your review adheres to our [Review Guidelines](link) to ensure it will be published. For more serious complaints, contact support@serviceseeking.com.au with the details.\n\nIf there's a specific job you need help with or if you're looking to post a job, please let me know how I can assist you further.",
    reason: 'Criteria 2',
    createdAt: '2024-06-24 05:34:00.406976',
    archive: false,
  },
  {
    unansweredQId: 'ca186c75-0f22-4e8a-bac2-5d4a3324e3fc',
    conversationId: '682968008',
    question: 'where to file complain',
    answer:
      "If you need to file a complaint against a business you've had a bad experience with on ServiceSeeking.com.au, you can leave them a negative rating and review by logging into your account, selecting the business, and following the prompts. For more serious complaints, please contact support@serviceseeking.com.au with the details of your issue. Our team will do their best to assist you. \n\nNow, let's focus on getting the details of the architecture services you need. Could you please describe the specific project or service you're looking for?",
    reason: 'Criteria 2',
    createdAt: '2024-06-24 11:33:34.565054',
    archive: false,
  },
]

export const generateMockChartData = (
  chartType: string,
  monthYear: string | null,
  startDate: string | null,
  endDate: string | null
): any => {
  const currentMonthYear = monthYear || dayjs().format('M-YYYY')

  switch (chartType) {
    case 'totalMessageCount':
    case 'totalConversations':
    case 'avgBotResponseTime':
    case 'chatCompletion':
      return generateDateBasedMetricsData(chartType, startDate, endDate);

    case 'successfulConversation':
      return generateSuccessfulConversationData(startDate, endDate)
    case 'successfulPercentage':
      return generateSuccessfulPercentageData(startDate, endDate)
    case 'answeredAndUnanswered':
      return answeredAndUnansweredData[currentMonthYear] || []

    case 'userMessagesPerConversation':
      return userMessagesPerConversationData

    case 'persona':
      return userPersonaSample

    case 'peakInteractionTime':
      return mockPeakTimeData

    case 'userInteraction':
      return userInteractionData

    case 'userResponseTime':
      return generateUserResponseTimeData()

    case 'interactionDuration':
      return '835'

    case 'sentiment':
      return sentimentData

    case 'userRating':
      return userRatingData[currentMonthYear] || {}

    case 'messageReactionsChart':
      return messageReactionsChartData[currentMonthYear] || {}

    case 'userExposureWithTime':
      return userExposureData

    case 'nodes':
      return generateNodeDate()

    case 'topLinks':
      return topLinksClickedMockData

    case 'conversationDuration':
      return conversationDurationMockData

    default:
      return {}
  }
}

const userMessagesPerConversationData = [
  {
    name: '1',
    value: 2144,
  },
  {
    name: '2-7',
    value: 3842,
  },
  {
    name: '8-15',
    value: 966,
  },
  {
    name: '16+',
    value: 397,
  },
]

const userInteractionData = {
  lastWeekData: [
    {
      name: '8/10',
      value: 102,
    },
    {
      name: '9/10',
      value: 101,
    },
    {
      name: '10/10',
      value: 81,
    },
    {
      name: '11/10',
      value: 69,
    },
    {
      name: '12/10',
      value: 50,
    },
    {
      name: '13/10',
      value: 54,
    },
    {
      name: '14/10',
      value: 59,
    },
  ],
  lastMonthData: generateDateLabelForWeek([
    {
      name: 'Sep 22-28',
      value: 234,
    },
    {
      name: 'Sep 29-Oct 5',
      value: 348,
    },
    {
      name: 'Oct 6-12',
      value: 718,
    },
    {
      name: 'Oct 13-19',
      value: 129,
    },
  ], 1),
}

const generateUserResponseTimeData = () => ([
  {
    name: '0-10 sec',
    value: randomBetween(1470, 2000),
  },
  {
    name: '10-30 sec',
    value: randomBetween(2045, 2500)
  },
  {
    name: '30-60 sec',
    value: randomBetween(60, 730)
  },
  {
    name: '1-5 min',
    value: randomBetween(50, 530)
  },
  {
    name: '5 min +',
    value: randomBetween(0, 121)
  },
])

const generateNodeDate = () => ([
  {
    nodeName: "FAQ Loop",
    instances: 151,
    wasLast: 151,
    wasLastPercentage: 100
  },
  {
    nodeName: "Asking For Program Name",
    instances: 84,
    wasLast: 84,
    wasLastPercentage: 100
  },
  {
    nodeName: "EOC Loop",
    instances: 11,
    wasLast: 11,
    wasLastPercentage: 100
  },
  {
    nodeName: "Start",
    instances: 411,
    wasLast: 31,
    wasLastPercentage: 8
  },
  {
    nodeName: "Root",
    instances: 408,
    wasLast: 12,
    wasLastPercentage: 3
  }
])

const sentimentData = {
  data: [11, 38, 51],
  label: ['Negative', 'Neutral', 'Positive'],
}

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

export const chatSessionData = (
  page: number,
  limit: number,
  order: string | null = 'desc',
  orderBy: string,
  botSuccess: boolean,
  search?: string
) => {
  const data = botSuccess ? completedSessionMockData.data : chatMockData.data
  let filteredData = [...data]

  if (search) {
    const searchLower = search.toLowerCase()
    filteredData = filteredData.filter(
      (session) =>
        session.chatId.toLowerCase().includes(searchLower) ||
        session.user.name.toLowerCase().includes(searchLower) ||
        session.product.title.toLowerCase().includes(searchLower)
    )
  }

  // Sort the data
  filteredData.sort((a, b) => {
    if (orderBy === '') return 0

    const aValue = getNestedValue(a, orderBy)
    const bValue = getNestedValue(b, orderBy)

    if (aValue < bValue) return order === 'asc' ? -1 : 1
    if (aValue > bValue) return order === 'asc' ? 1 : -1
    return 0
  })

  const totalRecords = filteredData.length
  const totalPages = Math.ceil(totalRecords / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  const paginatedData = filteredData.slice(startIndex, endIndex)

  return {
    data: paginatedData,
    pagination: {
      totalRecords,
      totalPages,
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    },
  }
}

export const knowledgeBaseTableMock = [
  {
    id: 1,
    question: "I've already reset my password but it's still not working.",
    answer:
      "This could be an issue with your browser's cache which can store passwords for you. Sometimes, when your password changes, it still logs you in with the old onGo to the Tools or Options menu of your browser (it's different depending on whether you're using Internet Explorer, Firefox, Chrome or Safari) and find the area to clear your cache and stored passwords. On Chrome, it can be done in the History section via Clear browsing data.",
  },

  {
    id: 2,
    question: 'How do I unsubscribe.',
    answer:
      "It's really easy to unsubscribe from emails or SMS messages. Every email has an unsubscribe link in the footer. You can click on those links and follow the prompts to opt out of future emails. For SMS messages, please reply STOP to an SMS and you will be opted out of future SMS. You can also opt out of specific emails or SMS messages from your account. Click here in your Account Settings and select which emails (or all emails and notifications) you don't want to receive. Look under the heading 'Communication'.",
  },

  {
    id: 3,
    question: 'Where can I see negative feedback.',
    answer:
      'On all Business Profiles, reviews are shown in order of when they were submitted. The most recent reviews are shown first.',
  },

  {
    id: 4,
    question: ' How do I reset my password.',
    answer:
      "Enter your email address on our log in page and hit Next. If you haven't created a password yet, you'll be prompted to create it via a code sent to your email address or the phone number you used when you posted a job. If you have a password but it's slipped your mind, you'll see a link to reset your password. For security reasons our customer support team cannot reset your password for you.",
  },
  {
    id: 5,
    question: 'Guidelines for Reviews',
    answer:
      "Reviews and star ratings are an important way to help other customers decide who to hire for their own job. To leave a review for a ServiceSeeking.com.au business, you should: have experienced their service or product as part of the job you're reviewing, or have paid a deposit give your honest opinion of their work. If you've had a bad experience with a business, a review helps to make your voice heard and to hold the business accountablePlease note that the overall star rating of every business counts all reviews, good and bad.",
  },

  {
    id: 6,
    question: 'How do I close my account?',
    answer:
      "Sick of emails? Go to Settings and go to the Communication section. Turn off all your email alerts and we'll stop sending you emails. If you need to remove an open job, go to your job page and update the status to Cancelled.",
  },

  {
    id: 7,
    question: 'How do I stop getting contacted by businesses?',
    answer:
      "Most jobs get contact from businesses on our site. If you haven't received any emails or calls from businesses, it could be because the job description is too short or lacks info businesses need to be interested. The other possible reason is that there aren't many businesses in your area who do that type of work. This can happen in rural areas or for unusual jobs. ",
  },

  {
    id: 8,
    question: "Why haven't I been contacted by businesses?",
    answer:
      "Most jobs get contact from businesses on our site. If you haven't received any emails or calls from businesses, it could be because the job description is too short or lacks info businesses need to be interested. The other possible reason is that there aren't many businesses in your area who do that type of work. This can happen in rural areas or for unusual jobs. ",
  },

  {
    id: 9,
    question: 'How do I close a job when it is completed?',
    answer:
      "Login to ServiceSeeking.com.au with your email and password, or follow the link to your job page from any email we've sent about the job. On the Job page for the relevant job click Update Status. You can let us know who you hired or leave them a rating out of 5 stars if they have done the job. Submit this information and your job is now closed. You won't receive any new contacts.",
  },

  {
    id: 10,
    question: 'It says I posted a duplicate job. What should I do?',
    answer:
      "We noticed you tried to post a new job, but you already have an open job that's almost identical. Please go to your existing job and on that page you can See businesses that are interested in doing your job and contact them to discuss Click on the Job Details button to edit your job description Click on the My Account menu, then go to Account Settings and Contact Details to edit your name, email address or phone number Click on Update Status to let us know who you hired for this job or if you'd like to cancel it",
  },

  {
    id: 11,
    question: 'What does it cost to get quotes?',
    answer:
      "Nothing. It's 100% free to post your job on ServiceSeeking.com.au and get contacted by matching local businesses. You're not obligated to hire any business who contacts you about your job through our site. You are not obligated to pay for work done through our site - you can work that out with the business you hire at the relevant time. ",
  },

  {
    id: 12,
    question: 'How do I make a Complaint against a business?',
    answer:
      "If you have had a bad experience with a ServiceSeeking.com.au business member, you can leave them a negative rating and review. To do this, login to your account, make sure you've selected that business as the one hired for your job, and then follow the prompts to leave a star rating and review. Check out our Review Guidelines to ensure your review will be published. For more serious complaints, please contact support@serviceseeking.com.au with the details of your problems. Our team will try our best to fix the issue, though may also refer you to the relevant consumer authority.",
  },
]


const mockPeakTimeData = [
  {
    name: 'Sun',
    data: [
      {
        x: '12 AM',
        y: 7,
      },
      {
        x: '3 AM',
        y: 11,
      },
      {
        x: '6 AM',
        y: 18,
      },
      {
        x: '9 AM',
        y: 33,
      },
      {
        x: '12 PM',
        y: 35,
      },
      {
        x: '3 PM',
        y: 22,
      },
      {
        x: '6 PM',
        y: 16,
      },
      {
        x: '9 PM',
        y: 5,
      },
    ],
  },
  {
    name: 'Sat',
    data: [
      {
        x: '12 AM',
        y: 6,
      },
      {
        x: '3 AM',
        y: 9,
      },
      {
        x: '6 AM',
        y: 19,
      },
      {
        x: '9 AM',
        y: 31,
      },
      {
        x: '12 PM',
        y: 31,
      },
      {
        x: '3 PM',
        y: 26,
      },
      {
        x: '6 PM',
        y: 9,
      },
      {
        x: '9 PM',
        y: 4,
      },
    ],
  },
  {
    name: 'Fri',
    data: [
      {
        x: '12 AM',
        y: 4,
      },
      {
        x: '3 AM',
        y: 16,
      },
      {
        x: '6 AM',
        y: 32,
      },
      {
        x: '9 AM',
        y: 23,
      },
      {
        x: '12 PM',
        y: 43,
      },
      {
        x: '3 PM',
        y: 17,
      },
      {
        x: '6 PM',
        y: 18,
      },
      {
        x: '9 PM',
        y: 2,
      },
    ],
  },
  {
    name: 'Thu',
    data: [
      {
        x: '12 AM',
        y: 1,
      },
      {
        x: '3 AM',
        y: 12,
      },
      {
        x: '6 AM',
        y: 23,
      },
      {
        x: '9 AM',
        y: 35,
      },
      {
        x: '12 PM',
        y: 33,
      },
      {
        x: '3 PM',
        y: 24,
      },
      {
        x: '6 PM',
        y: 15,
      },
      {
        x: '9 PM',
        y: 6,
      },
    ],
  },

  {
    name: 'Wed',
    data: [
      {
        x: '12 AM',
        y: 1,
      },
      {
        x: '3 AM',
        y: 13,
      },
      {
        x: '6 AM',
        y: 15,
      },
      {
        x: '9 AM',
        y: 30,
      },
      {
        x: '12 PM',
        y: 29,
      },
      {
        x: '3 PM',
        y: 20,
      },
      {
        x: '6 PM',
        y: 9,
      },
      {
        x: '9 PM',
        y: 2,
      },
    ],
  },
  {
    name: 'Tue',
    data: [
      {
        x: '12 AM',
        y: 7,
      },
      {
        x: '3 AM',
        y: 11,
      },
      {
        x: '6 AM',
        y: 19,
      },
      {
        x: '9 AM',
        y: 40,
      },
      {
        x: '12 PM',
        y: 31,
      },
      {
        x: '3 PM',
        y: 21,
      },
      {
        x: '6 PM',
        y: 11,
      },
      {
        x: '9 PM',
        y: 6,
      },
    ],
  },
  {
    name: 'Mon',
    data: [
      {
        x: '12 AM',
        y: 3,
      },
      {
        x: '3 AM',
        y: 9,
      },
      {
        x: '6 AM',
        y: 21,
      },
      {
        x: '9 AM',
        y: 31,
      },
      {
        x: '12 PM',
        y: 36,
      },
      {
        x: '3 PM',
        y: 30,
      },
      {
        x: '6 PM',
        y: 15,
      },
      {
        x: '9 PM',
        y: 4,
      },
    ],
  },
]

const generateDateBasedMetricsData = (chartType: string, startDate: string | null, endDate: string | null) => {

  const defaultResponses: { [key: string]: any } = {
    'totalMessageCount': '15,614',
    'totalConversations': '1,841',
    'avgBotResponseTime': '5.1s',
    'chatCompletion': '81%'
  }

  if (!startDate || !endDate || startDate === 'null' || endDate === 'null') {
    return defaultResponses[chartType];
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return defaultResponses[chartType];
  }

  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  const reductionFactor = getReductionFactor(daysDiff)

  switch (chartType) {
    case 'totalMessageCount':
    case 'totalConversations':
      return getReducedValue(defaultResponses[chartType], reductionFactor)

    case 'avgBotResponseTime':
      const timeSeconds = interpolateRange(0.9 - reductionFactor, 5.0, 5.9)
      return `${timeSeconds.toFixed(1)}s`

    case 'chatCompletion':
      const pct = interpolateRange(reductionFactor, 80, 95)
      return `${Math.round(pct)}%`
    default:
      return defaultResponses[chartType]
  }
}


export function generateSuccessfulConversationData(startDate: string | null, endDate: string | null) {

  const [start, end] = getValidatedDateRange(startDate, endDate)

  return generateGroupedData(start, end, () => {
    return { Successful: randomBetween(20, 600) }
  })
}
export function generateSuccessfulPercentageData(startDate: string | null, endDate: string | null) {

  const [start, end] = getValidatedDateRange(startDate, endDate)

  return generateGroupedData(start, end, () => {
    return { Successful: randomBetween(50, 90) }
  })
}


export const generateAnsweredUnansweredData = (startDate: string | null, endDate: string | null) => {

  const [start, end] = getValidatedDateRange(startDate, endDate)

  return generateGroupedData(start, end, () => {
    const answered = Math.floor(Math.random() * 600)
    const unanswered = Math.floor(Math.random() * 50)
    return {
      'Answered Questions': answered,
      'Unanswered Questions': unanswered,
    }
  })
}

export const agentConfigurationMock = {
  "data": {
    "editable": {
      "bot": {
        "ui": {
          'bot_name': "Mock Agent",
          'page_title': "Insait Agent℠",
          'button_text': "How can we help?",
          'disclaimer_text': "Disclaimer!",
          'bot_image': "http://test-company.insait.com:5173/src/assets/images/logo.svg",
          'color1': "#3498db",
          'color2': "#2ecc71",
          'language': 'english',
          'skin_name': 'default',
          'streaming_enabled': true,
          'ab_test_percentage': 100,
          'default_open_enabled': true,
          'preview_enabled': false,
          'disclaimer_enabled': false,
        },
        "api": {
          'whitelisted_urls': [
            {
              url: 'https://example.com',
              variant: 'default'
            },
            {
              url: 'https://another.example.com',
              variant: 'default'
            }
          ],
          'blacklisted_urls': [
            {
              url: 'https://example.com/bad-url',
              variant: 'default'
            },
            {
              url: 'https://another-example.com/bad-url',
              variant: 'default'
            }
          ],
          'first_message': "Hello! How can I assist you today?",
          'first_prompt': "## Task: Answer the query below using only the context that follows.  - **Always answer in English.** - Use newlines and bold for clarity. - The answer should be formatted in a clear and easy to read format for a AI chatbot on a website. short clear sentences with proper newlines and must focus on the user's main goal or question. - **Use the context exactly as provided, word for word, without additions or paraphrasing.** - If multiple scenarios or options apply, cover them all.  ### Query: {query}  ### Context: {context}  ### Query: {query}  **Only reference sections that precisely match all query details.** **Do not infer missing details or assume general rules.** **Do not use references.** **Be Proactive and engaging**  ---  ## Response:",
          'second_prompt': "",
          'use_naive_history': true,
          'use_parse_question': false,
          'use_second': false,
          'r2r_wrapper_params': {
            system_prompt: "You are a helpful agent.",
            number_of_chunks: 10
          },
          r2r_query_params: {
            temperature: 0.5,
            top_p: 1.0,
            model: "None",
            use_fulltext_search: true,
            search_strategy: "vanilla",
            number_of_chunks: 5,
            search_mode: "basic",
            include_title_if_available: true 
          }
        }
      },
      "admin": {
        "ui": {
          "language": "en"
        }
      }
    }
  }
}