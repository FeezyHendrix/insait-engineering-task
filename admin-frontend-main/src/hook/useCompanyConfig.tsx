import {
  setCharts,
  setCompany,
  setDateSettings,
  setPages,
  setTables,
  setLanguage,
  setMetrics,
  setBatchChannels,
  setMockData,
  setCountryInfo,
  setKnowledgeSource,
  setSpecialTerms,
  setAllDataFields,
} from '@/redux/companyConfig'
import { getCompanyConfig } from '@/redux/companyConfig/requests'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { isProduction } from '@/utils/constants'
import { toast } from 'react-toastify'
import constants from '@/utils/constants'

export const useCompanyConfig = async () => {
  const dispatch = useDispatch()
  const isInitialMount = useRef(true)
  const updateCompanyConfig = (configData: any, companyName: string) => {
    const { visible_pages: visiblePages, charts, tables, dateSettings, language, metrics, mock_data: mockData, batch_channels: batchChannels, country_info: countryInfo, knowledge_source: knowledgeSource, special_terms: specialTerms, all_data_fields: allDataFields } = configData
    visiblePages && dispatch(setPages(visiblePages))
    tables && dispatch(setTables(tables))
    charts && dispatch(setCharts(charts))
    dateSettings && dispatch(setDateSettings(dateSettings))
    companyName && dispatch(setCompany(companyName))
    language && dispatch(setLanguage(language))
    metrics && dispatch(setMetrics(metrics))
    batchChannels && dispatch(setBatchChannels(batchChannels))
    countryInfo && dispatch(setCountryInfo(countryInfo))
    specialTerms && dispatch(setSpecialTerms(specialTerms))
    allDataFields && dispatch(setAllDataFields(allDataFields))
    mockData && dispatch(setMockData(mockData === 1))
    knowledgeSource && dispatch(setKnowledgeSource(knowledgeSource))
  }
  const { TENANT } = constants

  const fetchCompanyConfigDev = async () => {
    const companyName = TENANT
    const companyConfigDefault = {
      visible_pages: {
          "internal":   [
              "/unanswered-questions",
              "/message-rating",
              "/admin",
              "/security-violation-messages",
              "/feedback",
              "/superset-analytics"
          ],
          "regularUsers" : [
              "/",
              "/dashboard",
              "/analytics",
              "/chats",
              "/support",
              "/batch",
              "/agent-builder",
              "/bot-builder",
              "/configuration",
              "/knowledge-base",
              "/knowledge",
              "/completed-sessions",
              "/feedback",
              "/scenario",
              "/unanswered-questions",
              "/login-preferences",
              "/knowledge-hub",
              "/superset-analytics",
          ]
      },
      charts: [
        'userInteractions',
        'interactionDuration',
        'userQueries',
        'completionRate',
        'productPopularity',
        'errorAnalysis',
        'peakInteractionTimes',
        'userAbandonment',
        'dropoffQuestions',
        'userFeedback',
        'userReturnRate',
        'topQuestionsAsked',
        'topFAQs',
        'dataCollectedInConversation',
        'topLinksClicked',
        'sentimentAnalysis',
        'conversationalDepth',
        'userPersonaClassification',
        'anomalyDetection',
        'successfulConversions',
        'userMessagesPerConversation',
        'averageLengthOfClientMessages',
        'averageLengthOfBotMessages',
        'thumbsUpAndDownCountMonthly',
        'queryKnowledgebase',
        'policyCounter',
        'securityModuleCost',
        'averageResponseTimeFromClient',
        'averageLengthOfUserAndBotMessages',
        'responseTimeFromAClient',
      ],
      metrics: [
        "totalMessageCount",
        "totalConversations",
        "avgBotResponseTime",
        // "chatCompletion"
      ],
      dateSettings: 'DD-MM-YYYY',
      tables: null,
      language: "en",
      // language: "he",
      batch_channels: [
        'SMS', 'EMAIL', 'WHATSAPP'
      ],
      country_info: {
        name: 'Australia',
        code: '61'
      },
      // special_terms: {
      //   conversion: "שיחות שהועברו לבכיר",
      //   completedSessions: "שיחות שהועברו לבכיר"
      // },
      // all_data_fields: ["documents_used"],
      knowledge_source: [
        // 'crawling',
        'file',
        // 'text',
        'qa'
      ]
      // mock_data: 1
    }
    updateCompanyConfig(companyConfigDefault, companyName)
  }

  const fetchCompanyConfigProd = async () => {
    const companyName = TENANT
    try {
      const configData = await getCompanyConfig(companyName)
      updateCompanyConfig(configData.data.data, companyName)
    } catch (e) {
      toast.error('Error while fetching company config')
      return fetchCompanyConfigDev()
    }
  }

  const fetchCompanyConfig =
    !isProduction ? fetchCompanyConfigDev : fetchCompanyConfigProd

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      fetchCompanyConfig()
    }
  }, [])
}
