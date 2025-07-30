import { HttpResponse, http } from 'msw'
import { mockData } from './mockData'
import constants from '@/utils/constants'
import {
  agentConfigurationMock,
  chatSessionData,
  earliestInteractionTimestampMock,
  generateAdvancedAnalyticsData,
  generateMockChartData,
  knowledgeBaseTableMock,
  mockUnansweredQuestions,
} from '../utils/data'

const { BACKEND_URL } = constants

const createHandler = (path: string, responseData: any) => {
  return http.get(path, () => HttpResponse.json(responseData))
}

export const handlers = [
  createHandler(
    '/conversations/allConversations',
    mockData['conversations/allConversations']
  ),
  createHandler(`${BACKEND_URL}/analytics/dashboard`, {
    earliestInteractionTimestamp: earliestInteractionTimestampMock,
  }),

  http.get(`${BACKEND_URL}/charts/:chartType`, ({ params, request }) => {
    const chartType = Array.isArray(params.chartType)
      ? params.chartType[0]
      : params.chartType

    const url = new URL(request.url)
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')
    const month = url.searchParams.get('month')
    const chartData = generateMockChartData(chartType, month, startDate, endDate)
    return HttpResponse.json(chartData)
  }),

  http.get(`${BACKEND_URL}/analytics/advancedAnalytics`, ({ request }) => {
    const url = new URL(request.url)
    const monthYear = url.searchParams.get('userReturnRateMonth')

    const mockData = generateAdvancedAnalyticsData(monthYear)
    return HttpResponse.json(mockData)

  }),

  http.get(`${BACKEND_URL}/conversations/conversationPages/:page`, ({ params, request }) => {
    const pageParam = params.page;
    const page = Array.isArray(pageParam) ? pageParam[0] : pageParam;

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const order = url.searchParams.get('order');
    const orderBy = url.searchParams.get('orderBy') || 'updatedAt';
    const search = url.searchParams.get('search') || undefined;
    const botSuccess = url.searchParams.get('botSuccessOnly') === 'true';

    const result = chatSessionData(parseInt(page, 10), limit, order, orderBy, botSuccess, search);

    return HttpResponse.json(result);
  }),

  http.get(`${BACKEND_URL}/unansweredQs/getUnansweredQs`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const totalRecords = mockUnansweredQuestions.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
  
    const paginatedData = mockUnansweredQuestions.slice(startIndex, endIndex)

    return HttpResponse.json({data: paginatedData, total: totalRecords })
  }),

  http.get(`${BACKEND_URL}/knowledge/getKnowledges`, () => {
    return HttpResponse.json(knowledgeBaseTableMock)
  }),

  http.put(`${BACKEND_URL}/knowledge/toggleKnowledgeActiveness`, async () => {
    return HttpResponse.json({ success: true })
  }),

  http.get(`${BACKEND_URL}/agentConfigurations`, () => {
    return HttpResponse.json(agentConfigurationMock)
  }),

  http.put(`${BACKEND_URL}/agentConfigurations`, () => {
    return HttpResponse.json({message: 'Configuration updated succesfully'})
  }),

  http.post(`${BACKEND_URL}/agentConfigurations/uploadAvatar`, () => {
    return HttpResponse.json({message: 'Uploaded image succesfully', data: {url: 'https://my.new.url'}})
  }),
]