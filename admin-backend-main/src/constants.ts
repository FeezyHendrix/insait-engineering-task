import dotenv from 'dotenv'
import { ChatbotConversationType, CompanyData, LoginProviderOptionType, TicketPriority, TicketStatus } from './types/interfaces'
import { faker } from '@faker-js/faker'
dotenv.config()

const hardcodedConstants = {
    INTERACTIONS_END_STATUS: {
        COMPLETION: {
            NAME: 'completion' ,
            LABEL: 'Completion'
        },
        CUSTOMER_SERVICE: {
            NAME: 'customerService' ,
            LABEL: 'Customer Service'
        },
        DROP_OFF: {
            NAME: 'dropOff' ,
            LABEL: 'Drop Off'
        },
    },
    INTERACTION_SENTIMENT_LABELS: {
        POSITIVE: 'Positive',
        NEUTRAL: 'Neutral',
        NEGATIVE: 'Negative'
    },
    MONTH_NAMES :["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    DAYS_NAMES: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    SEEDING_PARAMS_OBJECT: {
        customerCount : 1000,
        interactionCount : 500,
        percentOfConversationsEnded : 100,
        maxChatLength: 20,
        averageSpeed: 20,
        commentPercent: 50,
        yearsBack: 2,
        maxInteractionDurationMinutes: 30,
        maxCustomerSatisfactionRating: 5,
        maxTokenUsage: 2000,
        unansweredQsCount: 15,
        maxUnansweredQsPerConversation: 5,
        ticketCount: 20,
        kbDocumentCount: 10,
        clusterCount: 5,
        questionsPerCluster: 3
    },
    MONTHS_TO_DISPLAY: 3,
    INTERACTION_COMPLEXITY_SCORES: {
        simple: 33,
        moderate: 66,
        complex: 100
    },
    ContactType : {
        SMS: 'SMS',
        EMAIL: 'EMAIL',
        WHATSAPP: 'WHATSAPP',
    },
    AB_CHART_DURATION: 7,
    GPT_INPUT_DOLLARS_PER_TOKEN: 30 / 1_000_000,
    GPT_OUTPUT_DOLLARS_PER_TOKEN: 60 / 1_000_000,
    USER_MESSAGE_COUNT_RANGES:
        [
            {
                "label": "1",
                "min": 1,
                "max": 1
            },
            {
                "label": "2-7",
                "min": 2,
                "max": 7
            },
            {
                "label": "8-15",
                "min": 8,
                "max": 15
            },
            {
                "label": "16+",
                "min": 16,
                "max": null
            }
    ],
    CONVERSATION_DURATION_RANGES: [
        {
            "label": "0-2",
            "min": 0,
            "max": 2
        },
        {
            "label": "2-5",
            "min": 2,
            "max": 5
        },
        {
            "label": "5-10",
            "min": 5,
            "max": 10
        },
        {
            "label": "10-30",
            "min": 10,
            "max": 30
        },
        {
            "label": "30+",
            "min": 30,
            "max": null
        }
    ],
    PAGINATION: {
        DEFAULT_PAGE: '1',
        DEFAULT_ORDER: 'des',
        DEFAULT_LIMIT: '50',
        DEFAULT_ORDER_BY: 'createdAt',
        DEFAULT_SEARCH: '',
        DEFAULT_HAS_FEEDBACK_ONLY: false,
        DEFAULT_BOT_SUCCESS_ONLY: 'false',
        VALID_COLUMN_NAMES: {
            conversations: [
                'updatedAt', 'createdAt', 'user.id', 'userId', 'dataObject.email', 'dataObject.country',
                'dataObject.name', 'messageCount', 'user.firstName', 'user.lastName',
                'subject', 'id', 'priority', 'status', 'commentCount'
            ],
            tickets: [
                'id', 'subject', 'sender', 'companyName', 'message', 'chatURL', 'ticketURL',
                'createdAt', 'notificationEmails', 'commentHistory', 'commentCount',
                'priority', 'status', 'updatedAt'
            ],
            testScenarios: [
                'testScenarioId', 'name', 'type', 'createdAt', 'questionCount', 'runCount', 'lastRunDate'
            ],
            knowledge: [
                'id', 'question', 'answer', 'url', 'createdAt', 'product', 'active'
            ],
        },
    },
    MISC: {
        MILLISECONDS_PER_MINUTE: 60_000,
        SECONDS_PER_MINUTE: 60,
        MINUTES_PER_HOUR: 60,
        DAYS_PER_WEEK: 7,
        END_OF_DAY: {
            HOUR: 23,
            MINUTE: 59,
            SECOND: 59,
            MILLISECOND: 999
        },
        DAYS_IN_MONTH: 31,
        WEEKS_PER_MONTH: 4.34524,
        MONTH_PER_YEAR: 12,
        HOURS_PER_DAY: 24,
    },
    USER_INTERACTION_CHART_WEEKS: 4,
    INSENSITIVE_MODE: 'insensitive' as const,
    RAW_KNOWLEDGE_BASE_FOLDER_NAME: "raw-knowledge-files",
    MAX_BAR_CHART_COLUMNS: 12,
    PREFECT_FLOW_TIMEOUT_SECONDS: 90,
    KB_UPLOAD_TIMEOUT_MINUTES: 20
}

const envConstants = {
    AGENT_PORT: process.env.AGENT_PORT || 5000,
    AGENT_URL: process.env.AGENT_URL || "http://agent-backend",
    BACKEND_PORT: process.env.BACKEND_PORT || 5050,
    BACKEND_URL: process.env.BACKEND_URL,
    RUN_MODE: process.env.RUN_MODE || "PRODUCTION",
    ENVIRONMENT: process.env.ENVIRONMENT,
    KEYCLOAK_PUB_KEY: process.env.KEYCLOAK_PUB_KEY,
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
    KEYCLOAK_USERNAME: process.env.KEYCLOAK_ADMIN_USERNAME,
    KEYCLOAK_PASSWORD: process.env.KEYCLOAK_ADMIN_PASSWORD,
    // BREVO_API_KEY: process.env.BREVO_API_KEY,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
    MESSAGE_SERVICES_ID: process.env.MESSAGE_SERVICES_ID || '',
    // BREVO_SENDER_EMAIL_ADDRESS: process.env.BREVO_SENDER_EMAIL_ADDRESS,
    INSAIT_SUPPORT_EMAILS: process.env.INSAIT_SUPPORT_EMAILS || "support@insait.io,dor@insait.io",
    INSAIT_DS_EMAIL: process.env.INSAIT_DS_EMAIL || "dor@insait.io",
    CLICKUP_LIST_ID: process.env.CLICKUP_LIST_ID,
    CLICKUP_API_KEY: process.env.CLICKUP_API_KEY,
    SEED_FAKE_DATA: process.env.SEED_FAKE_DATA || false,
    COMPANY_CONFIG_SECRET: process.env.COMPANY_CONFIG_SECRET,
    COMPANY_CONFIG_BASE_URL: process.env.COMPANY_CONFIG_BASE_URL,
    TENANT: process.env.TENANT,
    LOCALSTACK_ENDPOINT_URL: process.env.LOCALSTACK_ENDPOINT_URL || null,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    AWS_PUBLIC_S3_BUCKET_NAME: process.env.AWS_PUBLIC_S3_BUCKET_NAME || "insait-public-assets",
    AWS_PUBLIC_S3_BUCKET_REGION: process.env.AWS_PUBLIC_S3_BUCKET_REGION || "il-central-1",
    AWS_CDN_BASE_URL: process.env.AWS_CDN_BASE_URL || "https://cdn.insait.io",
    PREFECT_API_URL: process.env.PREFECT_API_URL || "http://dashboard-prefect-server:4200/api",
    S3_ENDPOINT_URL: process.env.S3_ENDPOINT_URL, //NEW ENV FOR NONE S3 STORAGE SERVICES (ie Localstack / Minio)
    DOCUMENT_PREFECT_FLOW_NAME: process.env.DOCUMENT_PREFECT_FLOW_NAME || "append_document_knowledge",
    SEND_QA_TO_R2R_PREFECT_FLOW_NAME: process.env.SEND_QA_TO_R2R_PREFECT_FLOW_NAME || "send_qa_to_r2r",
    RELEASE_VERSION: process.env.RELEASE_VERSION,
    SENTRY_DSN: process.env.SENTRY_DSN,
    AGENT_JWT_TOKEN: process.env.AGENT_JWT_TOKEN,
    URL_DISCOVERY_PREFECT_FLOW_NAME: process.env.URL_DISCOVERY_PREFECT_FLOW_NAME || "website_crawler",
    APPEND_URLS_PREFECT_FLOW_NAME: process.env.APPEND_URLS_PREFECT_FLOW_NAME || "load_md_from_s3_to_r2r",
    APPEND_SINGLE_URL_PREFECT_FLOW_NAME: process.env.APPEND_URLS_PREFECT_FLOW_NAME || "single_page_website_crawler",
    DELETE_LINK_PREFECT_FLOW_NAME: process.env.DELETE_LINK_PREFECT_FLOW_NAME || "delete_urls",

    DD_SERVICE:process.env.DD_SERVICE,
    DD_AGENT_HOST: process.env.DD_AGENT_HOST,
    DD_TRACE_AGENT_PORT: process.env.DD_TRACE_AGENT_PORT,
    STAND_ALONE: process.env.STAND_ALONE,
}

export const useDD = !!(
    envConstants.RUN_MODE === 'PRODUCTION' &&
    envConstants.DD_SERVICE &&
    envConstants.DD_AGENT_HOST &&
    envConstants.DD_TRACE_AGENT_PORT
  );

export const insaitTeamIdClickup = "9018132889"

export const extractedSupportEmails: string[] = envConstants.INSAIT_SUPPORT_EMAILS?.split(',') ?? []

const errorConstants = {
    CORRECT_KEYS: {
        COMPLETION_RATE_DATA_KEYS: ["data", "label"],
        COMPLETION_RATE_TABLE_KEYS: ["id", "user", "product", "createdAt", "chatId"],
        SENTIMENT_DONUT_KEYS: ["data", "label"],
        USER_PERSONA_KEYS: ["data", "label"],
        CONVERSATION_DEPTH_KEYS: ["name", "simple", "moderate", "complex", "month", "year"],
        INTERACTION_KEYS: ["customerId", "productId", "startedTime", "endTime", "avgResponseTimePerQuery", "endStatus", "positivenessScore", "complexityScore", "speed", "messages", "comment"],
        CHAT_KEYS: ["id", "user", "product", "createdAt", "chatId", "endStatus", "messageCount", "messages", "updatedAt"]
    },
    ZERO_OBJECTS: {
        COMPLETION_RATE_DATA_ZERO: {
            data: [ 0, 0, 0 ],
            label: [
                hardcodedConstants.INTERACTIONS_END_STATUS.COMPLETION.LABEL,
                hardcodedConstants.INTERACTIONS_END_STATUS.CUSTOMER_SERVICE.LABEL,
                hardcodedConstants.INTERACTIONS_END_STATUS.DROP_OFF.LABEL
            ]
        },
        USER_INTERACTIONS_ZERO: [
            {
                "name": "Mon",
                "value": 0
            },
            {
                "name": "Tue",
                "value": 0
            },
            {
                "name": "Wed",
                "value": 0
            },
            {
                "name": "Thu",
                "value": 0
            },
            {
                "name": "Fri",
                "value": 0
            },
            {
                "name": "Sat",
                "value": 0
            },
            {
                "name": "Sun",
                "value": 0
            }
        ],
        PEAK_TIME_ZERO:  [
            {
                "name": "Mon",
                "data": [
                    {
                        "x": "12 AM",
                        "y": 0
                    },
                    {
                        "x": "3 AM",
                        "y": 0
                    },
                    {
                        "x": "6 AM",
                        "y": 0
                    },
                    {
                        "x": "9 AM",
                        "y": 0
                    },
                    {
                        "x": "12 PM",
                        "y": 0
                    },
                    {
                        "x": "3 PM",
                        "y": 0
                    },
                    {
                        "x": "6 PM",
                        "y": 0
                    },
                    {
                        "x": "9 PM",
                        "y": 0
                    }
                ]
            },
            {
                "name": "Tue",
                "data": [
                    {
                        "x": "12 AM",
                        "y": 0
                    },
                    {
                        "x": "3 AM",
                        "y": 0
                    },
                    {
                        "x": "6 AM",
                        "y": 0
                    },
                    {
                        "x": "9 AM",
                        "y": 0
                    },
                    {
                        "x": "12 PM",
                        "y": 0
                    },
                    {
                        "x": "3 PM",
                        "y": 0
                    },
                    {
                        "x": "6 PM",
                        "y": 0
                    },
                    {
                        "x": "9 PM",
                        "y": 0
                    }
                ]
            },
            {
                "name": "Wed",
                "data": [
                    {
                        "x": "12 AM",
                        "y": 0
                    },
                    {
                        "x": "3 AM",
                        "y": 0
                    },
                    {
                        "x": "6 AM",
                        "y": 0
                    },
                    {
                        "x": "9 AM",
                        "y": 0
                    },
                    {
                        "x": "12 PM",
                        "y": 0
                    },
                    {
                        "x": "3 PM",
                        "y": 0
                    },
                    {
                        "x": "6 PM",
                        "y": 0
                    },
                    {
                        "x": "9 PM",
                        "y": 0
                    }
                ]
            },
            {
                "name": "Thu",
                "data": [
                    {
                        "x": "12 AM",
                        "y": 0
                    },
                    {
                        "x": "3 AM",
                        "y": 0
                    },
                    {
                        "x": "6 AM",
                        "y": 0
                    },
                    {
                        "x": "9 AM",
                        "y": 0
                    },
                    {
                        "x": "12 PM",
                        "y": 0
                    },
                    {
                        "x": "3 PM",
                        "y": 0
                    },
                    {
                        "x": "6 PM",
                        "y": 0
                    },
                    {
                        "x": "9 PM",
                        "y": 0
                    }
                ]
            },
            {
                "name": "Fri",
                "data": [
                    {
                        "x": "12 AM",
                        "y": 0
                    },
                    {
                        "x": "3 AM",
                        "y": 0
                    },
                    {
                        "x": "6 AM",
                        "y": 0
                    },
                    {
                        "x": "9 AM",
                        "y": 0
                    },
                    {
                        "x": "12 PM",
                        "y": 0
                    },
                    {
                        "x": "3 PM",
                        "y": 0
                    },
                    {
                        "x": "6 PM",
                        "y": 0
                    },
                    {
                        "x": "9 PM",
                        "y": 0
                    }
                ]
            },
            {
                "name": "Sat",
                "data": [
                    {
                        "x": "12 AM",
                        "y": 0
                    },
                    {
                        "x": "3 AM",
                        "y": 0
                    },
                    {
                        "x": "6 AM",
                        "y": 0
                    },
                    {
                        "x": "9 AM",
                        "y": 0
                    },
                    {
                        "x": "12 PM",
                        "y": 0
                    },
                    {
                        "x": "3 PM",
                        "y": 0
                    },
                    {
                        "x": "6 PM",
                        "y": 0
                    },
                    {
                        "x": "9 PM",
                        "y": 0
                    }
                ]
            },
            {
                "name": "Sun",
                "data": [
                    {
                        "x": "12 AM",
                        "y": 0
                    },
                    {
                        "x": "3 AM",
                        "y": 0
                    },
                    {
                        "x": "6 AM",
                        "y": 0
                    },
                    {
                        "x": "9 AM",
                        "y": 0
                    },
                    {
                        "x": "12 PM",
                        "y": 0
                    },
                    {
                        "x": "3 PM",
                        "y": 0
                    },
                    {
                        "x": "6 PM",
                        "y": 0
                    },
                    {
                        "x": "9 PM",
                        "y": 0
                    }
                ]
            }
        ],
        SENTIMENT_DONUT_ZERO: {
            "data": [
                0,0,0
            ],
            "label": []
        },
        USER_PERSONA_ZERO: {
            "data": [],
            "label": []
        },
        CONVERSATION_DEPTH_ZERO: [
            {
                "name": "01/01 - 01/07",
                "value": 0
            },
            {
                "name": "01/08 - 01/14",
                "value": 0
            },
            {
                "name": "01/15 - 01/21",
                "value": 0
            },
            {
                "name": "01/22 - 01/28",
                "value": 0
            },
            {
                "name": "01/29 - 02/04",
                "value": 0
            },
            {
                "name": "02/05 - 02/11",
                "value": 0
            },
            {
                "name": "02/12 - 02/18",
                "value": 0
            },
            {
                "name": "02/19 - 02/25",
                "value": 0
            },
            {
                "name": "02/26 - 03/04",
                "value": 0
            },
            {
                "name": "03/05 - 03/11",
                "value": 0
            },
            {
                "name": "03/12 - 03/18",
                "value": 0
            },
            {
                "name": "03/19 - 03/25",
                "value": 0
            },
            {
                "name": "03/26 - 04/01",
                "value": 0
            },
            {
                "name": "04/02 - 04/08",
                "value": 0
            },
            {
                "name": "04/09 - 04/15",
                "value": 0
            },
            {
                "name": "04/16 - 04/22",
                "value": 0
            },
            {
                "name": "04/23 - 04/29",
                "value": 0
            },
            {
                "name": "04/30 - 05/06",
                "value": 0
            },
            {
                "name": "05/07 - 05/13",
                "value": 0
            },
            {
                "name": "05/14 - 05/20",
                "value": 0
            },
            {
                "name": "05/21 - 05/27",
                "value": 0
            },
            {
                "name": "05/28 - 06/03",
                "value": 0
            },
            {
                "name": "06/04 - 06/10",
                "value": 0
            },
            {
                "name": "06/11 - 06/17",
                "value": 0
            },
            {
                "name": "06/18 - 06/24",
                "value": 0
            },
            {
                "name": "06/25 - 07/01",
                "value": 0
            },
            {
                "name": "07/02 - 07/08",
                "value": 0
            },
            {
                "name": "07/09 - 07/15",
                "value": 0
            },
            {
                "name": "07/16 - 07/22",
                "value": 0
            },
            {
                "name": "07/23 - 07/29",
                "value": 0
            },
            {
                "name": "07/30 - 08/05",
                "value": 0
            },
            {
                "name": "08/06 - 08/12",
                "value": 0
            },
            {
                "name": "08/13 - 08/19",
                "value": 0
            },
            {
                "name": "08/20 - 08/26",
                "value": 0
            },
            {
                "name": "08/27 - 09/02",
                "value": 0
            },
            {
                "name": "09/03 - 09/09",
                "value": 0
            },
            {
                "name": "09/10 - 09/16",
                "value": 0
            },
            {
                "name": "09/17 - 09/23",
                "value": 0
            },
            {
                "name": "09/24 - 09/30",
                "value": 0
            },
            {
                "name": "10/01 - 10/07",
                "value": 0
            },
            {
                "name": "10/08 - 10/14",
                "value": 0
            },
            {
                "name": "10/15 - 10/21",
                "value": 0
            },
            {
                "name": "10/22 - 10/28",
                "value": 0
            },
            {
                "name": "10/29 - 11/04",
                "value": 0
            },
            {
                "name": "11/05 - 11/11",
                "value": 0
            },
            {
                "name": "11/12 - 11/18",
                "value": 0
            },
            {
                "name": "11/19 - 11/25",
                "value": 0
            },
            {
                "name": "11/26 - 12/02",
                "value": 0
            },
            {
                "name": "12/03 - 12/09",
                "value": 0
            },
            {
                "name": "12/10 - 12/16",
                "value": 0
            },
            {
                "name": "12/17 - 12/23",
                "value": 0
            },
            {
                "name": "12/24 - 12/30",
                "value": 0
            },
            {
                "name": "12/31 - 01/06",
                "value": 0
            }
        ],
        ABANDONMENT_FUNNEL_ZERO: [
            {
                "value": 0,
                "name": "5k",
                "step": "Step 5",
                "fill": "url(#step-5)"
            },
            {
                "value": 0,
                "name": "4k",
                "step": "Step 4",
                "fill": "url(#step-4)"
            },
            {
                "value": 0,
                "name": "3k",
                "step": "Step 3",
                "fill": "url(#step-3)"
            },
            {
                "value": 0,
                "name": "2k",
                "step": "Step 2",
                "fill": "url(#step-2)"
            },
            {
                "value": 0,
                "name": "1k",
                "step": "Step 1",
                "fill": "url(#step-1)"
            }
        ],
        USER_RETURN_ZERO: [
            {
                "name": "01/01 - 01/07",
                "value": 0
            },
            {
                "name": "01/08 - 01/14",
                "value": 0
            },
            {
                "name": "01/15 - 01/21",
                "value": 0
            },
            {
                "name": "01/22 - 01/28",
                "value": 0
            },
            {
                "name": "01/29 - 02/04",
                "value": 0
            },
            {
                "name": "02/05 - 02/11",
                "value": 0
            },
            {
                "name": "02/12 - 02/18",
                "value": 0
            },
            {
                "name": "02/19 - 02/25",
                "value": 0
            },
            {
                "name": "02/26 - 03/04",
                "value": 0
            },
            {
                "name": "03/05 - 03/11",
                "value": 0
            },
            {
                "name": "03/12 - 03/18",
                "value": 0
            },
            {
                "name": "03/19 - 03/25",
                "value": 0
            },
            {
                "name": "03/26 - 04/01",
                "value": 0
            },
            {
                "name": "04/02 - 04/08",
                "value": 0
            },
            {
                "name": "04/09 - 04/15",
                "value": 0
            },
            {
                "name": "04/16 - 04/22",
                "value": 0
            },
            {
                "name": "04/23 - 04/29",
                "value": 0
            },
            {
                "name": "04/30 - 05/06",
                "value": 0
            },
            {
                "name": "05/07 - 05/13",
                "value": 0
            },
            {
                "name": "05/14 - 05/20",
                "value": 0
            },
            {
                "name": "05/21 - 05/27",
                "value": 0
            },
            {
                "name": "05/28 - 06/03",
                "value": 0
            },
            {
                "name": "06/04 - 06/10",
                "value": 0
            },
            {
                "name": "06/11 - 06/17",
                "value": 0
            },
            {
                "name": "06/18 - 06/24",
                "value": 0
            },
            {
                "name": "06/25 - 07/01",
                "value": 0
            },
            {
                "name": "07/02 - 07/08",
                "value": 0
            },
            {
                "name": "07/09 - 07/15",
                "value": 0
            },
            {
                "name": "07/16 - 07/22",
                "value": 0
            },
            {
                "name": "07/23 - 07/29",
                "value": 0
            },
            {
                "name": "07/30 - 08/05",
                "value": 0
            },
            {
                "name": "08/06 - 08/12",
                "value": 0
            },
            {
                "name": "08/13 - 08/19",
                "value": 0
            },
            {
                "name": "08/20 - 08/26",
                "value": 0
            },
            {
                "name": "08/27 - 09/02",
                "value": 0
            },
            {
                "name": "09/03 - 09/09",
                "value": 0
            },
            {
                "name": "09/10 - 09/16",
                "value": 0
            },
            {
                "name": "09/17 - 09/23",
                "value": 0
            },
            {
                "name": "09/24 - 09/30",
                "value": 0
            },
            {
                "name": "10/01 - 10/07",
                "value": 0
            },
            {
                "name": "10/08 - 10/14",
                "value": 0
            },
            {
                "name": "10/15 - 10/21",
                "value": 0
            },
            {
                "name": "10/22 - 10/28",
                "value": 0
            },
            {
                "name": "10/29 - 11/04",
                "value": 0
            },
            {
                "name": "11/05 - 11/11",
                "value": 0
            },
            {
                "name": "11/12 - 11/18",
                "value": 0
            },
            {
                "name": "11/19 - 11/25",
                "value": 0
            },
            {
                "name": "11/26 - 12/02",
                "value": 0
            },
            {
                "name": "12/03 - 12/09",
                "value": 0
            },
            {
                "name": "12/10 - 12/16",
                "value": 0
            },
            {
                "name": "12/17 - 12/23",
                "value": 0
            },
            {
                "name": "12/24 - 12/30",
                "value": 0
            },
            {
                "name": "12/31 - 01/06",
                "value": 0
            }
        ],
    }
}

export const companyData:{[key:string]: CompanyData} = {
    'glidepathcx': {
        clickupName: "glidepath",
        assignees: ['Marc Levinson', 'Ilan Flax'],
    },
    'bruntwork': {
        clickupName: "bruntwork",
        assignees: ['Marc Levinson', 'Ilan Flax'],
    },
    'etoro': {
        clickupName: "etoro",
        assignees: ['Marc Levinson', 'Ilan Flax'],
    },
    'service-seeking': {
        clickupName: "Service Seeking",
        assignees: ['Marc Levinson', 'Ilan Flax'],
    },
    'leumi-agent': {
        clickupName: "Leumi (Agent)",
        assignees: ['Dvir Ginzburg', 'dor marom'],
    },
    'ilending': {
        clickupName: "ilending",
        assignees: ['Yonatan Abrams', 'Marc Levinson'],
    },
    'onDeck': {
        clickupName: "ondeck",
        assignees: ['Marc Levinson', 'Ilan Flax'],
    },
    'wobi': {
        clickupName: "wobi",
        assignees: ['Yonatan Abrams', 'Sigal Druker'],
    },
    'hyp': {
        clickupName: "hyp",
        assignees: ['dor marom'],
    },
    'phoenix': {
        clickupName: "phoenix",
        assignees: ['Idan Kepten', 'Sigal Druker'],
    },
    'mizrahi': {
        clickupName: "mizrahi",
        assignees: ['dor marom', 'Sigal Druker'],
    },
    'synsyg': {
        clickupName: "synsyg",
        assignees: ['dor marom', 'Ilan Flax'],
    },
    'agent': {
        clickupName: "agent",
        assignees: ['akiva buckman'],
    },
    'meir': {
        clickupName: "meir",
        assignees: ['dor marom', 'Ilan Flax'],
    },
    'meir-zero-km': {
        clickupName: "meir-zero-km",
        assignees: ['dor marom', 'Ilan Flax'],
    },
    'localhost': {
        clickupName: "",
        assignees: [],
    },
    'test-company': {
        clickupName: "",
        assignees: [],
    },
    'passport-card':{
        clickupName: "Passport Card",
        assignees: ['Marc Levinson', 'Tzachi Levy', 'Sigal Druker'],
    },
    'direct-insurance':{
        clickupName: "Direct Insurance",
        assignees: ['Marc Levinson', 'Tzachi Levy', 'Sigal Druker'],
    },
    "fbaa":{
        clickupName: "FBAA",
        assignees: ['Ilan Flax'],
    },
    "harel":{
        clickupName: "Harel",
        assignees: ['Nimrod Geller']
    },
    "leumit":{
        clickupName: "Leumit",
        assignees: ['Nimrod Geller']
    },
    "ness":{
        clickupName: "Ness",
        assignees: ['Nimrod Geller']
    },
    "wesure":{
        clickupName:"WeSure",
        assignees: ['Nimrod Geller']
    },
    "nesspro":{
        clickupName: "Ness",
        assignees: ['Nimrod Geller']
    },
};
export const defaultClickupTicketAssignees = ['dor marom', 'Ilan Flax'];
export const defaultAdminSSOAssignees = ['Ilan Flax', 'Marc Levinson', 'Akiva Buckman', 'Gilad Gershon'];

export const priorityMapping: Record<TicketPriority, number> = {
      urgent: 1,
      high: 2,
      normal: 3,
      low: 4,
    };
export const statusMapping : Record<TicketStatus, string> = {
    toDo: 'to do',
    onHold: 'backlog',
    inProgress: 'in progress',
    completed: 'deployed to prod',
    deprecated: 'rejected',
  };

const constants = {
    ...hardcodedConstants,
    ...envConstants,
    ...errorConstants
}

export default constants

export const ABConversations: ChatbotConversationType[] = [
    {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Wed, 20 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "Assistant: Hi, how are you? our experts have checked your account and found that now is a great time for you to open a certificate of deposit. would you like to hear more details about our cd programs?\nUser: Yes, please tell me more.\nAssistant: We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. how much do you think you'll want to deposit?\nUser: User - that sounds interesting. could you explain what benefits come with the longer-term cds compared to the shorter-term ones, and if there are any penalties for early withdrawal? also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 am\nAssistant: Longer-term cds typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. for early withdrawals, some of our cds come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nfor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. our programs offer interest rates ranging from 1.7% to 4.3%. if you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nwould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?\nUser: User - yes, i would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. also, if i decide to add more funds to the cd later on, is that possible, or is the initial deposit amount fixed for the term of the cd?\nAssistant: For a $5,000 deposit in our \"fixed interest 365 days\" program without early withdrawal, the calculation is as follows:\n\n- principal (p): $5,000\n- interest rate: 4.2% (without the new money bonus)\n- duration: 1 year\n\nthe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nregarding the addition of funds, the initial deposit amount is generally fixed for the term of the cd. however, we do offer flexible cds that allow additional deposits. would you like to explore those options, or shall we proceed with the current calculation for different terms?\nUser: User - thank you for the comprehensive explanation. let's proceed with the current calculations for different terms, please. i'd like to understand the potential returns on the short-term 60-day cd, a mid-term option, and the 13-month cd with the new money bonus applied. can you also include whether any of these options allow for additional deposits? and if i were to choose a cd without the possibility of additional funds, is there a way to open multiple cds at once if i decide to allocate more money later? 10:47 am\nAssistant: Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **short-term 60-day cd**: this option does not allow for additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **mid-term option (fixed interest 180-365 days)**: this program also does not allow for additional deposits. the interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month cd with new money bonus**: this program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nif you decide to allocate more money later and the cd does not allow for additional funds, you can indeed open multiple cds at once. each cd would be a separate contract with its own term and interest rate.\n\nwould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month cd?\nUser: Absolutely, a detailed calculation for each option would be very helpful. could you include the total amount i would expect to receive at maturity for each term, as well? additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? thank you for accommodating my inquiries.\nAssistant: The interest rates provided for each cd option are fixed for the duration of the term and are not subject to change based on market conditions. here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **short-term 60-day cd**:\n- interest rate: 2.02%\n- total amount at maturity: $5,016.46\n- total interest earned: $16.46\n\n2. **mid-term option (fixed interest 180-365 days)**:\n- interest rate: 2.62%\n- total amount at maturity: $5,065.50\n- total interest earned: $65.50\n\n3. **13-month cd with new money bonus**:\n- interest rate: 2.15% + 0.5% new money bonus = 2.65%\n- total amount at maturity: $5,132.50\n- total interest earned: $132.50\n\nplease note that these calculations are based on the assumption that the interest is compounded annually. if you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your cd account(s).\nUser: User - the 13-month cd option seems most appealing to me, especially with the new money bonus. i'd like to proceed with opening a 13-month cd with the $5,000 deposit. additionally, i'm considering opening a short-term cd with another amount. could you guide me through the process of opening multiple cds concurrently? do you need any additional information from me to start this process? thank you for your patience and detailed guidance through all of my questions. 10:49 am\nAssistant: I'm glad to hear that you've decided to proceed with opening a 13-month cd with the $5,000 deposit. to confirm, this cd will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. with your approval, we'll move forward with setting up this cd for you.\n\nregarding opening multiple cds concurrently, we can certainly guide you through the process. you can open as many cds as you like, each potentially with different terms and amounts. to open an additional short-term cd, i'll need to know the amount you wish to deposit into this cd.\n\nplease confirm if you'd like to proceed with the 13-month cd with early withdrawal, and let me know the deposit amount for the short-term cd so we can continue with the process.",
        "messages": [
            {
                "file": null,
                "id": "8a0e7b0c-c5bf-4c10-9add-fbe1f315a6d7",
                "pov": "bot",
                "response_time": null,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.554973 GMT"
            },
            {
                "file": null,
                "id": "dc292243-611b-4dfb-b6f0-e592832b66e7",
                "pov": "bot",
                "response_time": 0.04,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.700750 GMT"
            },
            {
                "file": "",
                "id": "762729600",
                "pov": "user",
                "response_time": null,
                "text": "Yes, please tell me more.",
                "time": "Thu, 21 Mar 2024 08:42:43.054072 GMT"
            },
            {
                "file": null,
                "id": "dff07bc5-4631-4f0b-940c-051545f667c5",
                "pov": "bot",
                "response_time": 12.42,
                "text": "We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. How much do you think you'll want to deposit?",
                "time": "Thu, 21 Mar 2024 08:42:55.598501 GMT"
            },
            {
                "file": "",
                "id": "240663615",
                "pov": "user",
                "response_time": null,
                "text": "user - That sounds interesting. Could you explain what benefits come with the longer-term CDs compared to the shorter-term ones, and if there are any penalties for early withdrawal? Also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 AM",
                "time": "Thu, 21 Mar 2024 08:43:10.865284 GMT"
            },
            {
                "file": null,
                "id": "9bb6526f-ca75-44b0-9d25-c0f1d3ba97be",
                "pov": "bot",
                "response_time": 60.69,
                "text": "Longer-term CDs typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. For early withdrawals, some of our CDs come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nFor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. Our programs offer interest rates ranging from 1.7% to 4.3%. If you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nWould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?",
                "time": "Thu, 21 Mar 2024 08:44:11.631189 GMT"
            },
            {
                "file": "",
                "id": "888348593",
                "pov": "user",
                "response_time": null,
                "text": "user - Yes, I would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. Also, if I decide to add more funds to the CD later on, is that possible, or is the initial deposit amount fixed for the term of the CD?",
                "time": "Thu, 21 Mar 2024 08:44:19.436990 GMT"
            },
            {
                "file": null,
                "id": "203f43f9-ade5-4afd-8ba3-b7768540df98",
                "pov": "bot",
                "response_time": 57.72,
                "text": "For a $5,000 deposit in our \"Fixed Interest 365 Days\" program without early withdrawal, the calculation is as follows:\n\n- Principal (P): $5,000\n- Interest Rate: 4.2% (without the new money bonus)\n- Duration: 1 year\n\nThe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nRegarding the addition of funds, the initial deposit amount is generally fixed for the term of the CD. However, we do offer flexible CDs that allow additional deposits. Would you like to explore those options, or shall we proceed with the current calculation for different terms?",
                "time": "Thu, 21 Mar 2024 08:45:17.230831 GMT"
            },
            {
                "file": "",
                "id": "149960276",
                "pov": "user",
                "response_time": null,
                "text": "user - Thank you for the comprehensive explanation. Let's proceed with the current calculations for different terms, please. I'd like to understand the potential returns on the short-term 60-day CD, a mid-term option, and the 13-month CD with the new money bonus applied. Can you also include whether any of these options allow for additional deposits? And if I were to choose a CD without the possibility of additional funds, is there a way to open multiple CDs at once if I decide to allocate more money later? 10:47 AM",
                "time": "Thu, 21 Mar 2024 08:45:39.005738 GMT"
            },
            {
                "file": null,
                "id": "9abb712e-7997-4f46-86e4-92b6034706a4",
                "pov": "bot",
                "response_time": 70.31,
                "text": "Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **Short-term 60-day CD**: This option does not allow for additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**: This program also does not allow for additional deposits. The interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month CD with New Money Bonus**: This program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nIf you decide to allocate more money later and the CD does not allow for additional funds, you can indeed open multiple CDs at once. Each CD would be a separate contract with its own term and interest rate.\n\nWould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month CD?",
                "time": "Thu, 21 Mar 2024 08:46:49.514318 GMT"
            },
            {
                "file": "",
                "id": "491313305",
                "pov": "user",
                "response_time": null,
                "text": "Absolutely, a detailed calculation for each option would be very helpful. Could you include the total amount I would expect to receive at maturity for each term, as well? Additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? Thank you for accommodating my inquiries.",
                "time": "Thu, 21 Mar 2024 08:47:04.791002 GMT"
            },
            {
                "file": null,
                "id": "4f761f7a-48ba-4df7-9cfe-02fc27c63eb6",
                "pov": "bot",
                "response_time": 73.89,
                "text": "The interest rates provided for each CD option are fixed for the duration of the term and are not subject to change based on market conditions. Here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **Short-term 60-day CD**:\n- Interest Rate: 2.02%\n- Total Amount at Maturity: $5,016.46\n- Total Interest Earned: $16.46\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**:\n- Interest Rate: 2.62%\n- Total Amount at Maturity: $5,065.50\n- Total Interest Earned: $65.50\n\n3. **13-month CD with New Money Bonus**:\n- Interest Rate: 2.15% + 0.5% New Money Bonus = 2.65%\n- Total Amount at Maturity: $5,132.50\n- Total Interest Earned: $132.50\n\nPlease note that these calculations are based on the assumption that the interest is compounded annually. If you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your CD account(s).",
                "time": "Thu, 21 Mar 2024 08:48:18.787691 GMT"
            },
            {
                "file": "",
                "id": "889107670",
                "pov": "user",
                "response_time": null,
                "text": "user - The 13-month CD option seems most appealing to me, especially with the new money bonus. I'd like to proceed with opening a 13-month CD with the $5,000 deposit. Additionally, I'm considering opening a short-term CD with another amount. Could you guide me through the process of opening multiple CDs concurrently? Do you need any additional information from me to start this process? Thank you for your patience and detailed guidance through all of my questions. 10:49 AM",
                "time": "Thu, 21 Mar 2024 08:48:35.326384 GMT"
            },
            {
                "file": null,
                "id": "a41e47cd-ac1c-4c68-90df-10b352b93cf1",
                "pov": "bot",
                "response_time": 25.95,
                "text": "I'm glad to hear that you've decided to proceed with opening a 13-month CD with the $5,000 deposit. To confirm, this CD will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. With your approval, we'll move forward with setting up this CD for you.\n\nRegarding opening multiple CDs concurrently, we can certainly guide you through the process. You can open as many CDs as you like, each potentially with different terms and amounts. To open an additional short-term CD, I'll need to know the amount you wish to deposit into this CD.\n\nPlease confirm if you'd like to proceed with the 13-month CD with early withdrawal, and let me know the deposit amount for the short-term CD so we can continue with the process.",
                "time": "Thu, 21 Mar 2024 08:49:01.427571 GMT"
            }
        ],
        "total_completion_tokens_used": 1222,
        "total_prompt_tokens_used": 31174,
        "updated_at": "Thu, 21 Mar 2024 08:49:01 GMT",
        "user_id": "868569208",

    },
    {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Tues, 19 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "Assistant: Hi, how are you? our experts have checked your account and found that now is a great time for you to open a certificate of deposit. would you like to hear more details about our cd programs?\nUser: Yes, please tell me more.\nAssistant: We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. how much do you think you'll want to deposit?\nUser: User - that sounds interesting. could you explain what benefits come with the longer-term cds compared to the shorter-term ones, and if there are any penalties for early withdrawal? also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 am\nAssistant: Longer-term cds typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. for early withdrawals, some of our cds come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nfor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. our programs offer interest rates ranging from 1.7% to 4.3%. if you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nwould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?\nUser: User - yes, i would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. also, if i decide to add more funds to the cd later on, is that possible, or is the initial deposit amount fixed for the term of the cd?\nAssistant: For a $5,000 deposit in our \"fixed interest 365 days\" program without early withdrawal, the calculation is as follows:\n\n- principal (p): $5,000\n- interest rate: 4.2% (without the new money bonus)\n- duration: 1 year\n\nthe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nregarding the addition of funds, the initial deposit amount is generally fixed for the term of the cd. however, we do offer flexible cds that allow additional deposits. would you like to explore those options, or shall we proceed with the current calculation for different terms?\nUser: User - thank you for the comprehensive explanation. let's proceed with the current calculations for different terms, please. i'd like to understand the potential returns on the short-term 60-day cd, a mid-term option, and the 13-month cd with the new money bonus applied. can you also include whether any of these options allow for additional deposits? and if i were to choose a cd without the possibility of additional funds, is there a way to open multiple cds at once if i decide to allocate more money later? 10:47 am\nAssistant: Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **short-term 60-day cd**: this option does not allow for additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **mid-term option (fixed interest 180-365 days)**: this program also does not allow for additional deposits. the interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month cd with new money bonus**: this program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nif you decide to allocate more money later and the cd does not allow for additional funds, you can indeed open multiple cds at once. each cd would be a separate contract with its own term and interest rate.\n\nwould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month cd?\nUser: Absolutely, a detailed calculation for each option would be very helpful. could you include the total amount i would expect to receive at maturity for each term, as well? additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? thank you for accommodating my inquiries.\nAssistant: The interest rates provided for each cd option are fixed for the duration of the term and are not subject to change based on market conditions. here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **short-term 60-day cd**:\n- interest rate: 2.02%\n- total amount at maturity: $5,016.46\n- total interest earned: $16.46\n\n2. **mid-term option (fixed interest 180-365 days)**:\n- interest rate: 2.62%\n- total amount at maturity: $5,065.50\n- total interest earned: $65.50\n\n3. **13-month cd with new money bonus**:\n- interest rate: 2.15% + 0.5% new money bonus = 2.65%\n- total amount at maturity: $5,132.50\n- total interest earned: $132.50\n\nplease note that these calculations are based on the assumption that the interest is compounded annually. if you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your cd account(s).\nUser: User - the 13-month cd option seems most appealing to me, especially with the new money bonus. i'd like to proceed with opening a 13-month cd with the $5,000 deposit. additionally, i'm considering opening a short-term cd with another amount. could you guide me through the process of opening multiple cds concurrently? do you need any additional information from me to start this process? thank you for your patience and detailed guidance through all of my questions. 10:49 am\nAssistant: I'm glad to hear that you've decided to proceed with opening a 13-month cd with the $5,000 deposit. to confirm, this cd will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. with your approval, we'll move forward with setting up this cd for you.\n\nregarding opening multiple cds concurrently, we can certainly guide you through the process. you can open as many cds as you like, each potentially with different terms and amounts. to open an additional short-term cd, i'll need to know the amount you wish to deposit into this cd.\n\nplease confirm if you'd like to proceed with the 13-month cd with early withdrawal, and let me know the deposit amount for the short-term cd so we can continue with the process.",
        "messages": [
            {
                "file": null,
                "id": "8a0e7b0c-c5bf-4c10-9add-fbe1f315a6d7",
                "pov": "bot",
                "response_time": null,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.554973 GMT"
            },
            {
                "file": null,
                "id": "dc292243-611b-4dfb-b6f0-e592832b66e7",
                "pov": "bot",
                "response_time": 0.04,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.700750 GMT"
            },
            {
                "file": "",
                "id": "762729600",
                "pov": "user",
                "response_time": null,
                "text": "Yes, please tell me more.",
                "time": "Thu, 21 Mar 2024 08:42:43.054072 GMT"
            },
            {
                "file": null,
                "id": "dff07bc5-4631-4f0b-940c-051545f667c5",
                "pov": "bot",
                "response_time": 12.42,
                "text": "We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. How much do you think you'll want to deposit?",
                "time": "Thu, 21 Mar 2024 08:42:55.598501 GMT"
            },
            {
                "file": "",
                "id": "240663615",
                "pov": "user",
                "response_time": null,
                "text": "user - That sounds interesting. Could you explain what benefits come with the longer-term CDs compared to the shorter-term ones, and if there are any penalties for early withdrawal? Also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 AM",
                "time": "Thu, 21 Mar 2024 08:43:10.865284 GMT"
            },
            {
                "file": null,
                "id": "9bb6526f-ca75-44b0-9d25-c0f1d3ba97be",
                "pov": "bot",
                "response_time": 60.69,
                "text": "Longer-term CDs typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. For early withdrawals, some of our CDs come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nFor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. Our programs offer interest rates ranging from 1.7% to 4.3%. If you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nWould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?",
                "time": "Thu, 21 Mar 2024 08:44:11.631189 GMT"
            },
            {
                "file": "",
                "id": "888348593",
                "pov": "user",
                "response_time": null,
                "text": "user - Yes, I would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. Also, if I decide to add more funds to the CD later on, is that possible, or is the initial deposit amount fixed for the term of the CD?",
                "time": "Thu, 21 Mar 2024 08:44:19.436990 GMT"
            },
            {
                "file": null,
                "id": "203f43f9-ade5-4afd-8ba3-b7768540df98",
                "pov": "bot",
                "response_time": 57.72,
                "text": "For a $5,000 deposit in our \"Fixed Interest 365 Days\" program without early withdrawal, the calculation is as follows:\n\n- Principal (P): $5,000\n- Interest Rate: 4.2% (without the new money bonus)\n- Duration: 1 year\n\nThe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nRegarding the addition of funds, the initial deposit amount is generally fixed for the term of the CD. However, we do offer flexible CDs that allow additional deposits. Would you like to explore those options, or shall we proceed with the current calculation for different terms?",
                "time": "Thu, 21 Mar 2024 08:45:17.230831 GMT"
            },
            {
                "file": "",
                "id": "149960276",
                "pov": "user",
                "response_time": null,
                "text": "user - Thank you for the comprehensive explanation. Let's proceed with the current calculations for different terms, please. I'd like to understand the potential returns on the short-term 60-day CD, a mid-term option, and the 13-month CD with the new money bonus applied. Can you also include whether any of these options allow for additional deposits? And if I were to choose a CD without the possibility of additional funds, is there a way to open multiple CDs at once if I decide to allocate more money later? 10:47 AM",
                "time": "Thu, 21 Mar 2024 08:45:39.005738 GMT"
            },
            {
                "file": null,
                "id": "9abb712e-7997-4f46-86e4-92b6034706a4",
                "pov": "bot",
                "response_time": 70.31,
                "text": "Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **Short-term 60-day CD**: This option does not allow for additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**: This program also does not allow for additional deposits. The interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month CD with New Money Bonus**: This program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nIf you decide to allocate more money later and the CD does not allow for additional funds, you can indeed open multiple CDs at once. Each CD would be a separate contract with its own term and interest rate.\n\nWould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month CD?",
                "time": "Thu, 21 Mar 2024 08:46:49.514318 GMT"
            },
            {
                "file": "",
                "id": "491313305",
                "pov": "user",
                "response_time": null,
                "text": "Absolutely, a detailed calculation for each option would be very helpful. Could you include the total amount I would expect to receive at maturity for each term, as well? Additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? Thank you for accommodating my inquiries.",
                "time": "Thu, 21 Mar 2024 08:47:04.791002 GMT"
            },
            {
                "file": null,
                "id": "4f761f7a-48ba-4df7-9cfe-02fc27c63eb6",
                "pov": "bot",
                "response_time": 73.89,
                "text": "The interest rates provided for each CD option are fixed for the duration of the term and are not subject to change based on market conditions. Here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **Short-term 60-day CD**:\n- Interest Rate: 2.02%\n- Total Amount at Maturity: $5,016.46\n- Total Interest Earned: $16.46\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**:\n- Interest Rate: 2.62%\n- Total Amount at Maturity: $5,065.50\n- Total Interest Earned: $65.50\n\n3. **13-month CD with New Money Bonus**:\n- Interest Rate: 2.15% + 0.5% New Money Bonus = 2.65%\n- Total Amount at Maturity: $5,132.50\n- Total Interest Earned: $132.50\n\nPlease note that these calculations are based on the assumption that the interest is compounded annually. If you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your CD account(s).",
                "time": "Thu, 21 Mar 2024 08:48:18.787691 GMT"
            },
            {
                "file": "",
                "id": "889107670",
                "pov": "user",
                "response_time": null,
                "text": "user - The 13-month CD option seems most appealing to me, especially with the new money bonus. I'd like to proceed with opening a 13-month CD with the $5,000 deposit. Additionally, I'm considering opening a short-term CD with another amount. Could you guide me through the process of opening multiple CDs concurrently? Do you need any additional information from me to start this process? Thank you for your patience and detailed guidance through all of my questions. 10:49 AM",
                "time": "Thu, 21 Mar 2024 08:48:35.326384 GMT"
            },
            {
                "file": null,
                "id": "a41e47cd-ac1c-4c68-90df-10b352b93cf1",
                "pov": "bot",
                "response_time": 25.95,
                "text": "I'm glad to hear that you've decided to proceed with opening a 13-month CD with the $5,000 deposit. To confirm, this CD will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. With your approval, we'll move forward with setting up this CD for you.\n\nRegarding opening multiple CDs concurrently, we can certainly guide you through the process. You can open as many CDs as you like, each potentially with different terms and amounts. To open an additional short-term CD, I'll need to know the amount you wish to deposit into this CD.\n\nPlease confirm if you'd like to proceed with the 13-month CD with early withdrawal, and let me know the deposit amount for the short-term CD so we can continue with the process.",
                "time": "Thu, 21 Mar 2024 08:49:01.427571 GMT"
            }
        ],
        "total_completion_tokens_used": 1222,
        "total_prompt_tokens_used": 31174,
        "updated_at": "Thu, 21 Mar 2024 08:49:01 GMT",
        "user_id": "868569208",
    },
    {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": false,
        "created_at": "Tues, 19 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "Assistant: Hi, how are you? our experts have checked your account and found that now is a great time for you to open a certificate of deposit. would you like to hear more details about our cd programs?\nUser: Yes, please tell me more.\nAssistant: We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. how much do you think you'll want to deposit?\nUser: User - that sounds interesting. could you explain what benefits come with the longer-term cds compared to the shorter-term ones, and if there are any penalties for early withdrawal? also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 am\nAssistant: Longer-term cds typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. for early withdrawals, some of our cds come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nfor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. our programs offer interest rates ranging from 1.7% to 4.3%. if you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nwould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?\nUser: User - yes, i would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. also, if i decide to add more funds to the cd later on, is that possible, or is the initial deposit amount fixed for the term of the cd?\nAssistant: For a $5,000 deposit in our \"fixed interest 365 days\" program without early withdrawal, the calculation is as follows:\n\n- principal (p): $5,000\n- interest rate: 4.2% (without the new money bonus)\n- duration: 1 year\n\nthe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nregarding the addition of funds, the initial deposit amount is generally fixed for the term of the cd. however, we do offer flexible cds that allow additional deposits. would you like to explore those options, or shall we proceed with the current calculation for different terms?\nUser: User - thank you for the comprehensive explanation. let's proceed with the current calculations for different terms, please. i'd like to understand the potential returns on the short-term 60-day cd, a mid-term option, and the 13-month cd with the new money bonus applied. can you also include whether any of these options allow for additional deposits? and if i were to choose a cd without the possibility of additional funds, is there a way to open multiple cds at once if i decide to allocate more money later? 10:47 am\nAssistant: Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **short-term 60-day cd**: this option does not allow for additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **mid-term option (fixed interest 180-365 days)**: this program also does not allow for additional deposits. the interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month cd with new money bonus**: this program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nif you decide to allocate more money later and the cd does not allow for additional funds, you can indeed open multiple cds at once. each cd would be a separate contract with its own term and interest rate.\n\nwould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month cd?\nUser: Absolutely, a detailed calculation for each option would be very helpful. could you include the total amount i would expect to receive at maturity for each term, as well? additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? thank you for accommodating my inquiries.\nAssistant: The interest rates provided for each cd option are fixed for the duration of the term and are not subject to change based on market conditions. here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **short-term 60-day cd**:\n- interest rate: 2.02%\n- total amount at maturity: $5,016.46\n- total interest earned: $16.46\n\n2. **mid-term option (fixed interest 180-365 days)**:\n- interest rate: 2.62%\n- total amount at maturity: $5,065.50\n- total interest earned: $65.50\n\n3. **13-month cd with new money bonus**:\n- interest rate: 2.15% + 0.5% new money bonus = 2.65%\n- total amount at maturity: $5,132.50\n- total interest earned: $132.50\n\nplease note that these calculations are based on the assumption that the interest is compounded annually. if you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your cd account(s).\nUser: User - the 13-month cd option seems most appealing to me, especially with the new money bonus. i'd like to proceed with opening a 13-month cd with the $5,000 deposit. additionally, i'm considering opening a short-term cd with another amount. could you guide me through the process of opening multiple cds concurrently? do you need any additional information from me to start this process? thank you for your patience and detailed guidance through all of my questions. 10:49 am\nAssistant: I'm glad to hear that you've decided to proceed with opening a 13-month cd with the $5,000 deposit. to confirm, this cd will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. with your approval, we'll move forward with setting up this cd for you.\n\nregarding opening multiple cds concurrently, we can certainly guide you through the process. you can open as many cds as you like, each potentially with different terms and amounts. to open an additional short-term cd, i'll need to know the amount you wish to deposit into this cd.\n\nplease confirm if you'd like to proceed with the 13-month cd with early withdrawal, and let me know the deposit amount for the short-term cd so we can continue with the process.",
        "messages": [
            {
                "file": null,
                "id": "8a0e7b0c-c5bf-4c10-9add-fbe1f315a6d7",
                "pov": "bot",
                "response_time": null,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.554973 GMT"
            },
            {
                "file": null,
                "id": "dc292243-611b-4dfb-b6f0-e592832b66e7",
                "pov": "bot",
                "response_time": 0.04,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.700750 GMT"
            },
            {
                "file": "",
                "id": "762729600",
                "pov": "user",
                "response_time": null,
                "text": "Yes, please tell me more.",
                "time": "Thu, 21 Mar 2024 08:42:43.054072 GMT"
            },
            {
                "file": null,
                "id": "dff07bc5-4631-4f0b-940c-051545f667c5",
                "pov": "bot",
                "response_time": 12.42,
                "text": "We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. How much do you think you'll want to deposit?",
                "time": "Thu, 21 Mar 2024 08:42:55.598501 GMT"
            },
            {
                "file": "",
                "id": "240663615",
                "pov": "user",
                "response_time": null,
                "text": "user - That sounds interesting. Could you explain what benefits come with the longer-term CDs compared to the shorter-term ones, and if there are any penalties for early withdrawal? Also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 AM",
                "time": "Thu, 21 Mar 2024 08:43:10.865284 GMT"
            },
            {
                "file": null,
                "id": "9bb6526f-ca75-44b0-9d25-c0f1d3ba97be",
                "pov": "bot",
                "response_time": 60.69,
                "text": "Longer-term CDs typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. For early withdrawals, some of our CDs come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nFor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. Our programs offer interest rates ranging from 1.7% to 4.3%. If you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nWould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?",
                "time": "Thu, 21 Mar 2024 08:44:11.631189 GMT"
            },
            {
                "file": "",
                "id": "888348593",
                "pov": "user",
                "response_time": null,
                "text": "user - Yes, I would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. Also, if I decide to add more funds to the CD later on, is that possible, or is the initial deposit amount fixed for the term of the CD?",
                "time": "Thu, 21 Mar 2024 08:44:19.436990 GMT"
            },
            {
                "file": null,
                "id": "203f43f9-ade5-4afd-8ba3-b7768540df98",
                "pov": "bot",
                "response_time": 57.72,
                "text": "For a $5,000 deposit in our \"Fixed Interest 365 Days\" program without early withdrawal, the calculation is as follows:\n\n- Principal (P): $5,000\n- Interest Rate: 4.2% (without the new money bonus)\n- Duration: 1 year\n\nThe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nRegarding the addition of funds, the initial deposit amount is generally fixed for the term of the CD. However, we do offer flexible CDs that allow additional deposits. Would you like to explore those options, or shall we proceed with the current calculation for different terms?",
                "time": "Thu, 21 Mar 2024 08:45:17.230831 GMT"
            },
            {
                "file": "",
                "id": "149960276",
                "pov": "user",
                "response_time": null,
                "text": "user - Thank you for the comprehensive explanation. Let's proceed with the current calculations for different terms, please. I'd like to understand the potential returns on the short-term 60-day CD, a mid-term option, and the 13-month CD with the new money bonus applied. Can you also include whether any of these options allow for additional deposits? And if I were to choose a CD without the possibility of additional funds, is there a way to open multiple CDs at once if I decide to allocate more money later? 10:47 AM",
                "time": "Thu, 21 Mar 2024 08:45:39.005738 GMT"
            },
            {
                "file": null,
                "id": "9abb712e-7997-4f46-86e4-92b6034706a4",
                "pov": "bot",
                "response_time": 70.31,
                "text": "Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **Short-term 60-day CD**: This option does not allow for additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**: This program also does not allow for additional deposits. The interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month CD with New Money Bonus**: This program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nIf you decide to allocate more money later and the CD does not allow for additional funds, you can indeed open multiple CDs at once. Each CD would be a separate contract with its own term and interest rate.\n\nWould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month CD?",
                "time": "Thu, 21 Mar 2024 08:46:49.514318 GMT"
            },
            {
                "file": "",
                "id": "491313305",
                "pov": "user",
                "response_time": null,
                "text": "Absolutely, a detailed calculation for each option would be very helpful. Could you include the total amount I would expect to receive at maturity for each term, as well? Additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? Thank you for accommodating my inquiries.",
                "time": "Thu, 21 Mar 2024 08:47:04.791002 GMT"
            },
            {
                "file": null,
                "id": "4f761f7a-48ba-4df7-9cfe-02fc27c63eb6",
                "pov": "bot",
                "response_time": 73.89,
                "text": "The interest rates provided for each CD option are fixed for the duration of the term and are not subject to change based on market conditions. Here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **Short-term 60-day CD**:\n- Interest Rate: 2.02%\n- Total Amount at Maturity: $5,016.46\n- Total Interest Earned: $16.46\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**:\n- Interest Rate: 2.62%\n- Total Amount at Maturity: $5,065.50\n- Total Interest Earned: $65.50\n\n3. **13-month CD with New Money Bonus**:\n- Interest Rate: 2.15% + 0.5% New Money Bonus = 2.65%\n- Total Amount at Maturity: $5,132.50\n- Total Interest Earned: $132.50\n\nPlease note that these calculations are based on the assumption that the interest is compounded annually. If you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your CD account(s).",
                "time": "Thu, 21 Mar 2024 08:48:18.787691 GMT"
            },
            {
                "file": "",
                "id": "889107670",
                "pov": "user",
                "response_time": null,
                "text": "user - The 13-month CD option seems most appealing to me, especially with the new money bonus. I'd like to proceed with opening a 13-month CD with the $5,000 deposit. Additionally, I'm considering opening a short-term CD with another amount. Could you guide me through the process of opening multiple CDs concurrently? Do you need any additional information from me to start this process? Thank you for your patience and detailed guidance through all of my questions. 10:49 AM",
                "time": "Thu, 21 Mar 2024 08:48:35.326384 GMT"
            },
            {
                "file": null,
                "id": "a41e47cd-ac1c-4c68-90df-10b352b93cf1",
                "pov": "bot",
                "response_time": 25.95,
                "text": "I'm glad to hear that you've decided to proceed with opening a 13-month CD with the $5,000 deposit. To confirm, this CD will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. With your approval, we'll move forward with setting up this CD for you.\n\nRegarding opening multiple CDs concurrently, we can certainly guide you through the process. You can open as many CDs as you like, each potentially with different terms and amounts. To open an additional short-term CD, I'll need to know the amount you wish to deposit into this CD.\n\nPlease confirm if you'd like to proceed with the 13-month CD with early withdrawal, and let me know the deposit amount for the short-term CD so we can continue with the process.",
                "time": "Thu, 21 Mar 2024 08:49:01.427571 GMT"
            }
        ],
        "total_completion_tokens_used": 1222,
        "total_prompt_tokens_used": 31174,
        "updated_at": "Thu, 21 Mar 2024 08:49:01 GMT",
        "user_id": "868569208",
    },
    {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Mon, 18 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "Assistant: Hi, how are you? our experts have checked your account and found that now is a great time for you to open a certificate of deposit. would you like to hear more details about our cd programs?\nUser: Yes, please tell me more.\nAssistant: We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. how much do you think you'll want to deposit?\nUser: User - that sounds interesting. could you explain what benefits come with the longer-term cds compared to the shorter-term ones, and if there are any penalties for early withdrawal? also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 am\nAssistant: Longer-term cds typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. for early withdrawals, some of our cds come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nfor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. our programs offer interest rates ranging from 1.7% to 4.3%. if you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nwould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?\nUser: User - yes, i would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. also, if i decide to add more funds to the cd later on, is that possible, or is the initial deposit amount fixed for the term of the cd?\nAssistant: For a $5,000 deposit in our \"fixed interest 365 days\" program without early withdrawal, the calculation is as follows:\n\n- principal (p): $5,000\n- interest rate: 4.2% (without the new money bonus)\n- duration: 1 year\n\nthe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nregarding the addition of funds, the initial deposit amount is generally fixed for the term of the cd. however, we do offer flexible cds that allow additional deposits. would you like to explore those options, or shall we proceed with the current calculation for different terms?\nUser: User - thank you for the comprehensive explanation. let's proceed with the current calculations for different terms, please. i'd like to understand the potential returns on the short-term 60-day cd, a mid-term option, and the 13-month cd with the new money bonus applied. can you also include whether any of these options allow for additional deposits? and if i were to choose a cd without the possibility of additional funds, is there a way to open multiple cds at once if i decide to allocate more money later? 10:47 am\nAssistant: Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **short-term 60-day cd**: this option does not allow for additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **mid-term option (fixed interest 180-365 days)**: this program also does not allow for additional deposits. the interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month cd with new money bonus**: this program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nif you decide to allocate more money later and the cd does not allow for additional funds, you can indeed open multiple cds at once. each cd would be a separate contract with its own term and interest rate.\n\nwould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month cd?\nUser: Absolutely, a detailed calculation for each option would be very helpful. could you include the total amount i would expect to receive at maturity for each term, as well? additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? thank you for accommodating my inquiries.\nAssistant: The interest rates provided for each cd option are fixed for the duration of the term and are not subject to change based on market conditions. here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **short-term 60-day cd**:\n- interest rate: 2.02%\n- total amount at maturity: $5,016.46\n- total interest earned: $16.46\n\n2. **mid-term option (fixed interest 180-365 days)**:\n- interest rate: 2.62%\n- total amount at maturity: $5,065.50\n- total interest earned: $65.50\n\n3. **13-month cd with new money bonus**:\n- interest rate: 2.15% + 0.5% new money bonus = 2.65%\n- total amount at maturity: $5,132.50\n- total interest earned: $132.50\n\nplease note that these calculations are based on the assumption that the interest is compounded annually. if you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your cd account(s).\nUser: User - the 13-month cd option seems most appealing to me, especially with the new money bonus. i'd like to proceed with opening a 13-month cd with the $5,000 deposit. additionally, i'm considering opening a short-term cd with another amount. could you guide me through the process of opening multiple cds concurrently? do you need any additional information from me to start this process? thank you for your patience and detailed guidance through all of my questions. 10:49 am\nAssistant: I'm glad to hear that you've decided to proceed with opening a 13-month cd with the $5,000 deposit. to confirm, this cd will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. with your approval, we'll move forward with setting up this cd for you.\n\nregarding opening multiple cds concurrently, we can certainly guide you through the process. you can open as many cds as you like, each potentially with different terms and amounts. to open an additional short-term cd, i'll need to know the amount you wish to deposit into this cd.\n\nplease confirm if you'd like to proceed with the 13-month cd with early withdrawal, and let me know the deposit amount for the short-term cd so we can continue with the process.",
        "messages": [
            {
                "file": null,
                "id": "8a0e7b0c-c5bf-4c10-9add-fbe1f315a6d7",
                "pov": "bot",
                "response_time": null,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.554973 GMT"
            },
            {
                "file": null,
                "id": "dc292243-611b-4dfb-b6f0-e592832b66e7",
                "pov": "bot",
                "response_time": 0.04,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.700750 GMT"
            },
            {
                "file": "",
                "id": "762729600",
                "pov": "user",
                "response_time": null,
                "text": "Yes, please tell me more.",
                "time": "Thu, 21 Mar 2024 08:42:43.054072 GMT"
            },
            {
                "file": null,
                "id": "dff07bc5-4631-4f0b-940c-051545f667c5",
                "pov": "bot",
                "response_time": 12.42,
                "text": "We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. How much do you think you'll want to deposit?",
                "time": "Thu, 21 Mar 2024 08:42:55.598501 GMT"
            },
            {
                "file": "",
                "id": "240663615",
                "pov": "user",
                "response_time": null,
                "text": "user - That sounds interesting. Could you explain what benefits come with the longer-term CDs compared to the shorter-term ones, and if there are any penalties for early withdrawal? Also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 AM",
                "time": "Thu, 21 Mar 2024 08:43:10.865284 GMT"
            },
            {
                "file": null,
                "id": "9bb6526f-ca75-44b0-9d25-c0f1d3ba97be",
                "pov": "bot",
                "response_time": 60.69,
                "text": "Longer-term CDs typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. For early withdrawals, some of our CDs come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nFor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. Our programs offer interest rates ranging from 1.7% to 4.3%. If you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nWould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?",
                "time": "Thu, 21 Mar 2024 08:44:11.631189 GMT"
            },
            {
                "file": "",
                "id": "888348593",
                "pov": "user",
                "response_time": null,
                "text": "user - Yes, I would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. Also, if I decide to add more funds to the CD later on, is that possible, or is the initial deposit amount fixed for the term of the CD?",
                "time": "Thu, 21 Mar 2024 08:44:19.436990 GMT"
            },
            {
                "file": null,
                "id": "203f43f9-ade5-4afd-8ba3-b7768540df98",
                "pov": "bot",
                "response_time": 57.72,
                "text": "For a $5,000 deposit in our \"Fixed Interest 365 Days\" program without early withdrawal, the calculation is as follows:\n\n- Principal (P): $5,000\n- Interest Rate: 4.2% (without the new money bonus)\n- Duration: 1 year\n\nThe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nRegarding the addition of funds, the initial deposit amount is generally fixed for the term of the CD. However, we do offer flexible CDs that allow additional deposits. Would you like to explore those options, or shall we proceed with the current calculation for different terms?",
                "time": "Thu, 21 Mar 2024 08:45:17.230831 GMT"
            },
            {
                "file": "",
                "id": "149960276",
                "pov": "user",
                "response_time": null,
                "text": "user - Thank you for the comprehensive explanation. Let's proceed with the current calculations for different terms, please. I'd like to understand the potential returns on the short-term 60-day CD, a mid-term option, and the 13-month CD with the new money bonus applied. Can you also include whether any of these options allow for additional deposits? And if I were to choose a CD without the possibility of additional funds, is there a way to open multiple CDs at once if I decide to allocate more money later? 10:47 AM",
                "time": "Thu, 21 Mar 2024 08:45:39.005738 GMT"
            },
            {
                "file": null,
                "id": "9abb712e-7997-4f46-86e4-92b6034706a4",
                "pov": "bot",
                "response_time": 70.31,
                "text": "Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **Short-term 60-day CD**: This option does not allow for additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**: This program also does not allow for additional deposits. The interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month CD with New Money Bonus**: This program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nIf you decide to allocate more money later and the CD does not allow for additional funds, you can indeed open multiple CDs at once. Each CD would be a separate contract with its own term and interest rate.\n\nWould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month CD?",
                "time": "Thu, 21 Mar 2024 08:46:49.514318 GMT"
            },
            {
                "file": "",
                "id": "491313305",
                "pov": "user",
                "response_time": null,
                "text": "Absolutely, a detailed calculation for each option would be very helpful. Could you include the total amount I would expect to receive at maturity for each term, as well? Additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? Thank you for accommodating my inquiries.",
                "time": "Thu, 21 Mar 2024 08:47:04.791002 GMT"
            },
            {
                "file": null,
                "id": "4f761f7a-48ba-4df7-9cfe-02fc27c63eb6",
                "pov": "bot",
                "response_time": 73.89,
                "text": "The interest rates provided for each CD option are fixed for the duration of the term and are not subject to change based on market conditions. Here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **Short-term 60-day CD**:\n- Interest Rate: 2.02%\n- Total Amount at Maturity: $5,016.46\n- Total Interest Earned: $16.46\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**:\n- Interest Rate: 2.62%\n- Total Amount at Maturity: $5,065.50\n- Total Interest Earned: $65.50\n\n3. **13-month CD with New Money Bonus**:\n- Interest Rate: 2.15% + 0.5% New Money Bonus = 2.65%\n- Total Amount at Maturity: $5,132.50\n- Total Interest Earned: $132.50\n\nPlease note that these calculations are based on the assumption that the interest is compounded annually. If you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your CD account(s).",
                "time": "Thu, 21 Mar 2024 08:48:18.787691 GMT"
            },
            {
                "file": "",
                "id": "889107670",
                "pov": "user",
                "response_time": null,
                "text": "user - The 13-month CD option seems most appealing to me, especially with the new money bonus. I'd like to proceed with opening a 13-month CD with the $5,000 deposit. Additionally, I'm considering opening a short-term CD with another amount. Could you guide me through the process of opening multiple CDs concurrently? Do you need any additional information from me to start this process? Thank you for your patience and detailed guidance through all of my questions. 10:49 AM",
                "time": "Thu, 21 Mar 2024 08:48:35.326384 GMT"
            },
            {
                "file": null,
                "id": "a41e47cd-ac1c-4c68-90df-10b352b93cf1",
                "pov": "bot",
                "response_time": 25.95,
                "text": "I'm glad to hear that you've decided to proceed with opening a 13-month CD with the $5,000 deposit. To confirm, this CD will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. With your approval, we'll move forward with setting up this CD for you.\n\nRegarding opening multiple CDs concurrently, we can certainly guide you through the process. You can open as many CDs as you like, each potentially with different terms and amounts. To open an additional short-term CD, I'll need to know the amount you wish to deposit into this CD.\n\nPlease confirm if you'd like to proceed with the 13-month CD with early withdrawal, and let me know the deposit amount for the short-term CD so we can continue with the process.",
                "time": "Thu, 21 Mar 2024 08:49:01.427571 GMT"
            }
        ],
        "total_completion_tokens_used": 1222,
        "total_prompt_tokens_used": 31174,
        "updated_at": "Thu, 21 Mar 2024 08:49:01 GMT",
        "user_id": "868569208",
    },
    {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": false,
        "created_at": "Sat, 23 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "Assistant: Hi, how are you? our experts have checked your account and found that now is a great time for you to open a certificate of deposit. would you like to hear more details about our cd programs?\nUser: Yes, please tell me more.\nAssistant: We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. how much do you think you'll want to deposit?\nUser: User - that sounds interesting. could you explain what benefits come with the longer-term cds compared to the shorter-term ones, and if there are any penalties for early withdrawal? also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 am\nAssistant: Longer-term cds typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. for early withdrawals, some of our cds come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nfor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. our programs offer interest rates ranging from 1.7% to 4.3%. if you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nwould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?\nUser: User - yes, i would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. also, if i decide to add more funds to the cd later on, is that possible, or is the initial deposit amount fixed for the term of the cd?\nAssistant: For a $5,000 deposit in our \"fixed interest 365 days\" program without early withdrawal, the calculation is as follows:\n\n- principal (p): $5,000\n- interest rate: 4.2% (without the new money bonus)\n- duration: 1 year\n\nthe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nregarding the addition of funds, the initial deposit amount is generally fixed for the term of the cd. however, we do offer flexible cds that allow additional deposits. would you like to explore those options, or shall we proceed with the current calculation for different terms?\nUser: User - thank you for the comprehensive explanation. let's proceed with the current calculations for different terms, please. i'd like to understand the potential returns on the short-term 60-day cd, a mid-term option, and the 13-month cd with the new money bonus applied. can you also include whether any of these options allow for additional deposits? and if i were to choose a cd without the possibility of additional funds, is there a way to open multiple cds at once if i decide to allocate more money later? 10:47 am\nAssistant: Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **short-term 60-day cd**: this option does not allow for additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **mid-term option (fixed interest 180-365 days)**: this program also does not allow for additional deposits. the interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month cd with new money bonus**: this program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nif you decide to allocate more money later and the cd does not allow for additional funds, you can indeed open multiple cds at once. each cd would be a separate contract with its own term and interest rate.\n\nwould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month cd?\nUser: Absolutely, a detailed calculation for each option would be very helpful. could you include the total amount i would expect to receive at maturity for each term, as well? additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? thank you for accommodating my inquiries.\nAssistant: The interest rates provided for each cd option are fixed for the duration of the term and are not subject to change based on market conditions. here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **short-term 60-day cd**:\n- interest rate: 2.02%\n- total amount at maturity: $5,016.46\n- total interest earned: $16.46\n\n2. **mid-term option (fixed interest 180-365 days)**:\n- interest rate: 2.62%\n- total amount at maturity: $5,065.50\n- total interest earned: $65.50\n\n3. **13-month cd with new money bonus**:\n- interest rate: 2.15% + 0.5% new money bonus = 2.65%\n- total amount at maturity: $5,132.50\n- total interest earned: $132.50\n\nplease note that these calculations are based on the assumption that the interest is compounded annually. if you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your cd account(s).\nUser: User - the 13-month cd option seems most appealing to me, especially with the new money bonus. i'd like to proceed with opening a 13-month cd with the $5,000 deposit. additionally, i'm considering opening a short-term cd with another amount. could you guide me through the process of opening multiple cds concurrently? do you need any additional information from me to start this process? thank you for your patience and detailed guidance through all of my questions. 10:49 am\nAssistant: I'm glad to hear that you've decided to proceed with opening a 13-month cd with the $5,000 deposit. to confirm, this cd will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. with your approval, we'll move forward with setting up this cd for you.\n\nregarding opening multiple cds concurrently, we can certainly guide you through the process. you can open as many cds as you like, each potentially with different terms and amounts. to open an additional short-term cd, i'll need to know the amount you wish to deposit into this cd.\n\nplease confirm if you'd like to proceed with the 13-month cd with early withdrawal, and let me know the deposit amount for the short-term cd so we can continue with the process.",
        "messages": [
            {
                "file": null,
                "id": "8a0e7b0c-c5bf-4c10-9add-fbe1f315a6d7",
                "pov": "bot",
                "response_time": null,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.554973 GMT"
            },
            {
                "file": null,
                "id": "dc292243-611b-4dfb-b6f0-e592832b66e7",
                "pov": "bot",
                "response_time": 0.04,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.700750 GMT"
            },
            {
                "file": "",
                "id": "762729600",
                "pov": "user",
                "response_time": null,
                "text": "Yes, please tell me more.",
                "time": "Thu, 21 Mar 2024 08:42:43.054072 GMT"
            },
            {
                "file": null,
                "id": "dff07bc5-4631-4f0b-940c-051545f667c5",
                "pov": "bot",
                "response_time": 12.42,
                "text": "We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. How much do you think you'll want to deposit?",
                "time": "Thu, 21 Mar 2024 08:42:55.598501 GMT"
            },
            {
                "file": "",
                "id": "240663615",
                "pov": "user",
                "response_time": null,
                "text": "user - That sounds interesting. Could you explain what benefits come with the longer-term CDs compared to the shorter-term ones, and if there are any penalties for early withdrawal? Also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 AM",
                "time": "Thu, 21 Mar 2024 08:43:10.865284 GMT"
            },
            {
                "file": null,
                "id": "9bb6526f-ca75-44b0-9d25-c0f1d3ba97be",
                "pov": "bot",
                "response_time": 60.69,
                "text": "Longer-term CDs typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. For early withdrawals, some of our CDs come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nFor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. Our programs offer interest rates ranging from 1.7% to 4.3%. If you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nWould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?",
                "time": "Thu, 21 Mar 2024 08:44:11.631189 GMT"
            },
            {
                "file": "",
                "id": "888348593",
                "pov": "user",
                "response_time": null,
                "text": "user - Yes, I would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. Also, if I decide to add more funds to the CD later on, is that possible, or is the initial deposit amount fixed for the term of the CD?",
                "time": "Thu, 21 Mar 2024 08:44:19.436990 GMT"
            },
            {
                "file": null,
                "id": "203f43f9-ade5-4afd-8ba3-b7768540df98",
                "pov": "bot",
                "response_time": 57.72,
                "text": "For a $5,000 deposit in our \"Fixed Interest 365 Days\" program without early withdrawal, the calculation is as follows:\n\n- Principal (P): $5,000\n- Interest Rate: 4.2% (without the new money bonus)\n- Duration: 1 year\n\nThe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nRegarding the addition of funds, the initial deposit amount is generally fixed for the term of the CD. However, we do offer flexible CDs that allow additional deposits. Would you like to explore those options, or shall we proceed with the current calculation for different terms?",
                "time": "Thu, 21 Mar 2024 08:45:17.230831 GMT"
            },
            {
                "file": "",
                "id": "149960276",
                "pov": "user",
                "response_time": null,
                "text": "user - Thank you for the comprehensive explanation. Let's proceed with the current calculations for different terms, please. I'd like to understand the potential returns on the short-term 60-day CD, a mid-term option, and the 13-month CD with the new money bonus applied. Can you also include whether any of these options allow for additional deposits? And if I were to choose a CD without the possibility of additional funds, is there a way to open multiple CDs at once if I decide to allocate more money later? 10:47 AM",
                "time": "Thu, 21 Mar 2024 08:45:39.005738 GMT"
            },
            {
                "file": null,
                "id": "9abb712e-7997-4f46-86e4-92b6034706a4",
                "pov": "bot",
                "response_time": 70.31,
                "text": "Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **Short-term 60-day CD**: This option does not allow for additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**: This program also does not allow for additional deposits. The interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month CD with New Money Bonus**: This program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nIf you decide to allocate more money later and the CD does not allow for additional funds, you can indeed open multiple CDs at once. Each CD would be a separate contract with its own term and interest rate.\n\nWould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month CD?",
                "time": "Thu, 21 Mar 2024 08:46:49.514318 GMT"
            },
            {
                "file": "",
                "id": "491313305",
                "pov": "user",
                "response_time": null,
                "text": "Absolutely, a detailed calculation for each option would be very helpful. Could you include the total amount I would expect to receive at maturity for each term, as well? Additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? Thank you for accommodating my inquiries.",
                "time": "Thu, 21 Mar 2024 08:47:04.791002 GMT"
            },
            {
                "file": null,
                "id": "4f761f7a-48ba-4df7-9cfe-02fc27c63eb6",
                "pov": "bot",
                "response_time": 73.89,
                "text": "The interest rates provided for each CD option are fixed for the duration of the term and are not subject to change based on market conditions. Here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **Short-term 60-day CD**:\n- Interest Rate: 2.02%\n- Total Amount at Maturity: $5,016.46\n- Total Interest Earned: $16.46\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**:\n- Interest Rate: 2.62%\n- Total Amount at Maturity: $5,065.50\n- Total Interest Earned: $65.50\n\n3. **13-month CD with New Money Bonus**:\n- Interest Rate: 2.15% + 0.5% New Money Bonus = 2.65%\n- Total Amount at Maturity: $5,132.50\n- Total Interest Earned: $132.50\n\nPlease note that these calculations are based on the assumption that the interest is compounded annually. If you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your CD account(s).",
                "time": "Thu, 21 Mar 2024 08:48:18.787691 GMT"
            },
            {
                "file": "",
                "id": "889107670",
                "pov": "user",
                "response_time": null,
                "text": "user - The 13-month CD option seems most appealing to me, especially with the new money bonus. I'd like to proceed with opening a 13-month CD with the $5,000 deposit. Additionally, I'm considering opening a short-term CD with another amount. Could you guide me through the process of opening multiple CDs concurrently? Do you need any additional information from me to start this process? Thank you for your patience and detailed guidance through all of my questions. 10:49 AM",
                "time": "Thu, 21 Mar 2024 08:48:35.326384 GMT"
            },
            {
                "file": null,
                "id": "a41e47cd-ac1c-4c68-90df-10b352b93cf1",
                "pov": "bot",
                "response_time": 25.95,
                "text": "I'm glad to hear that you've decided to proceed with opening a 13-month CD with the $5,000 deposit. To confirm, this CD will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. With your approval, we'll move forward with setting up this CD for you.\n\nRegarding opening multiple CDs concurrently, we can certainly guide you through the process. You can open as many CDs as you like, each potentially with different terms and amounts. To open an additional short-term CD, I'll need to know the amount you wish to deposit into this CD.\n\nPlease confirm if you'd like to proceed with the 13-month CD with early withdrawal, and let me know the deposit amount for the short-term CD so we can continue with the process.",
                "time": "Thu, 21 Mar 2024 08:49:01.427571 GMT"
            }
        ],
        "total_completion_tokens_used": 1222,
        "total_prompt_tokens_used": 31174,
        "updated_at": "Thu, 21 Mar 2024 08:49:01 GMT",
        "user_id": "868569208",
    },
    {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Fri, 22 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "Assistant: Hi, how are you? our experts have checked your account and found that now is a great time for you to open a certificate of deposit. would you like to hear more details about our cd programs?\nUser: Yes, please tell me more.\nAssistant: We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. how much do you think you'll want to deposit?\nUser: User - that sounds interesting. could you explain what benefits come with the longer-term cds compared to the shorter-term ones, and if there are any penalties for early withdrawal? also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 am\nAssistant: Longer-term cds typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. for early withdrawals, some of our cds come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nfor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. our programs offer interest rates ranging from 1.7% to 4.3%. if you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nwould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?\nUser: User - yes, i would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. also, if i decide to add more funds to the cd later on, is that possible, or is the initial deposit amount fixed for the term of the cd?\nAssistant: For a $5,000 deposit in our \"fixed interest 365 days\" program without early withdrawal, the calculation is as follows:\n\n- principal (p): $5,000\n- interest rate: 4.2% (without the new money bonus)\n- duration: 1 year\n\nthe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nregarding the addition of funds, the initial deposit amount is generally fixed for the term of the cd. however, we do offer flexible cds that allow additional deposits. would you like to explore those options, or shall we proceed with the current calculation for different terms?\nUser: User - thank you for the comprehensive explanation. let's proceed with the current calculations for different terms, please. i'd like to understand the potential returns on the short-term 60-day cd, a mid-term option, and the 13-month cd with the new money bonus applied. can you also include whether any of these options allow for additional deposits? and if i were to choose a cd without the possibility of additional funds, is there a way to open multiple cds at once if i decide to allocate more money later? 10:47 am\nAssistant: Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **short-term 60-day cd**: this option does not allow for additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **mid-term option (fixed interest 180-365 days)**: this program also does not allow for additional deposits. the interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month cd with new money bonus**: this program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nif you decide to allocate more money later and the cd does not allow for additional funds, you can indeed open multiple cds at once. each cd would be a separate contract with its own term and interest rate.\n\nwould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month cd?\nUser: Absolutely, a detailed calculation for each option would be very helpful. could you include the total amount i would expect to receive at maturity for each term, as well? additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? thank you for accommodating my inquiries.\nAssistant: The interest rates provided for each cd option are fixed for the duration of the term and are not subject to change based on market conditions. here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **short-term 60-day cd**:\n- interest rate: 2.02%\n- total amount at maturity: $5,016.46\n- total interest earned: $16.46\n\n2. **mid-term option (fixed interest 180-365 days)**:\n- interest rate: 2.62%\n- total amount at maturity: $5,065.50\n- total interest earned: $65.50\n\n3. **13-month cd with new money bonus**:\n- interest rate: 2.15% + 0.5% new money bonus = 2.65%\n- total amount at maturity: $5,132.50\n- total interest earned: $132.50\n\nplease note that these calculations are based on the assumption that the interest is compounded annually. if you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your cd account(s).\nUser: User - the 13-month cd option seems most appealing to me, especially with the new money bonus. i'd like to proceed with opening a 13-month cd with the $5,000 deposit. additionally, i'm considering opening a short-term cd with another amount. could you guide me through the process of opening multiple cds concurrently? do you need any additional information from me to start this process? thank you for your patience and detailed guidance through all of my questions. 10:49 am\nAssistant: I'm glad to hear that you've decided to proceed with opening a 13-month cd with the $5,000 deposit. to confirm, this cd will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. with your approval, we'll move forward with setting up this cd for you.\n\nregarding opening multiple cds concurrently, we can certainly guide you through the process. you can open as many cds as you like, each potentially with different terms and amounts. to open an additional short-term cd, i'll need to know the amount you wish to deposit into this cd.\n\nplease confirm if you'd like to proceed with the 13-month cd with early withdrawal, and let me know the deposit amount for the short-term cd so we can continue with the process.",
        "messages": [
            {
                "file": null,
                "id": "8a0e7b0c-c5bf-4c10-9add-fbe1f315a6d7",
                "pov": "bot",
                "response_time": null,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.554973 GMT"
            },
            {
                "file": null,
                "id": "dc292243-611b-4dfb-b6f0-e592832b66e7",
                "pov": "bot",
                "response_time": 0.04,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.700750 GMT"
            },
            {
                "file": "",
                "id": "762729600",
                "pov": "user",
                "response_time": null,
                "text": "Yes, please tell me more.",
                "time": "Thu, 21 Mar 2024 08:42:43.054072 GMT"
            },
            {
                "file": null,
                "id": "dff07bc5-4631-4f0b-940c-051545f667c5",
                "pov": "bot",
                "response_time": 12.42,
                "text": "We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. How much do you think you'll want to deposit?",
                "time": "Thu, 21 Mar 2024 08:42:55.598501 GMT"
            },
            {
                "file": "",
                "id": "240663615",
                "pov": "user",
                "response_time": null,
                "text": "user - That sounds interesting. Could you explain what benefits come with the longer-term CDs compared to the shorter-term ones, and if there are any penalties for early withdrawal? Also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 AM",
                "time": "Thu, 21 Mar 2024 08:43:10.865284 GMT"
            },
            {
                "file": null,
                "id": "9bb6526f-ca75-44b0-9d25-c0f1d3ba97be",
                "pov": "bot",
                "response_time": 60.69,
                "text": "Longer-term CDs typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. For early withdrawals, some of our CDs come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nFor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. Our programs offer interest rates ranging from 1.7% to 4.3%. If you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nWould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?",
                "time": "Thu, 21 Mar 2024 08:44:11.631189 GMT"
            },
            {
                "file": "",
                "id": "888348593",
                "pov": "user",
                "response_time": null,
                "text": "user - Yes, I would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. Also, if I decide to add more funds to the CD later on, is that possible, or is the initial deposit amount fixed for the term of the CD?",
                "time": "Thu, 21 Mar 2024 08:44:19.436990 GMT"
            },
            {
                "file": null,
                "id": "203f43f9-ade5-4afd-8ba3-b7768540df98",
                "pov": "bot",
                "response_time": 57.72,
                "text": "For a $5,000 deposit in our \"Fixed Interest 365 Days\" program without early withdrawal, the calculation is as follows:\n\n- Principal (P): $5,000\n- Interest Rate: 4.2% (without the new money bonus)\n- Duration: 1 year\n\nThe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nRegarding the addition of funds, the initial deposit amount is generally fixed for the term of the CD. However, we do offer flexible CDs that allow additional deposits. Would you like to explore those options, or shall we proceed with the current calculation for different terms?",
                "time": "Thu, 21 Mar 2024 08:45:17.230831 GMT"
            },
            {
                "file": "",
                "id": "149960276",
                "pov": "user",
                "response_time": null,
                "text": "user - Thank you for the comprehensive explanation. Let's proceed with the current calculations for different terms, please. I'd like to understand the potential returns on the short-term 60-day CD, a mid-term option, and the 13-month CD with the new money bonus applied. Can you also include whether any of these options allow for additional deposits? And if I were to choose a CD without the possibility of additional funds, is there a way to open multiple CDs at once if I decide to allocate more money later? 10:47 AM",
                "time": "Thu, 21 Mar 2024 08:45:39.005738 GMT"
            },
            {
                "file": null,
                "id": "9abb712e-7997-4f46-86e4-92b6034706a4",
                "pov": "bot",
                "response_time": 70.31,
                "text": "Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **Short-term 60-day CD**: This option does not allow for additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**: This program also does not allow for additional deposits. The interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month CD with New Money Bonus**: This program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nIf you decide to allocate more money later and the CD does not allow for additional funds, you can indeed open multiple CDs at once. Each CD would be a separate contract with its own term and interest rate.\n\nWould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month CD?",
                "time": "Thu, 21 Mar 2024 08:46:49.514318 GMT"
            },
            {
                "file": "",
                "id": "491313305",
                "pov": "user",
                "response_time": null,
                "text": "Absolutely, a detailed calculation for each option would be very helpful. Could you include the total amount I would expect to receive at maturity for each term, as well? Additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? Thank you for accommodating my inquiries.",
                "time": "Thu, 21 Mar 2024 08:47:04.791002 GMT"
            },
            {
                "file": null,
                "id": "4f761f7a-48ba-4df7-9cfe-02fc27c63eb6",
                "pov": "bot",
                "response_time": 73.89,
                "text": "The interest rates provided for each CD option are fixed for the duration of the term and are not subject to change based on market conditions. Here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **Short-term 60-day CD**:\n- Interest Rate: 2.02%\n- Total Amount at Maturity: $5,016.46\n- Total Interest Earned: $16.46\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**:\n- Interest Rate: 2.62%\n- Total Amount at Maturity: $5,065.50\n- Total Interest Earned: $65.50\n\n3. **13-month CD with New Money Bonus**:\n- Interest Rate: 2.15% + 0.5% New Money Bonus = 2.65%\n- Total Amount at Maturity: $5,132.50\n- Total Interest Earned: $132.50\n\nPlease note that these calculations are based on the assumption that the interest is compounded annually. If you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your CD account(s).",
                "time": "Thu, 21 Mar 2024 08:48:18.787691 GMT"
            },
            {
                "file": "",
                "id": "889107670",
                "pov": "user",
                "response_time": null,
                "text": "user - The 13-month CD option seems most appealing to me, especially with the new money bonus. I'd like to proceed with opening a 13-month CD with the $5,000 deposit. Additionally, I'm considering opening a short-term CD with another amount. Could you guide me through the process of opening multiple CDs concurrently? Do you need any additional information from me to start this process? Thank you for your patience and detailed guidance through all of my questions. 10:49 AM",
                "time": "Thu, 21 Mar 2024 08:48:35.326384 GMT"
            },
            {
                "file": null,
                "id": "a41e47cd-ac1c-4c68-90df-10b352b93cf1",
                "pov": "bot",
                "response_time": 25.95,
                "text": "I'm glad to hear that you've decided to proceed with opening a 13-month CD with the $5,000 deposit. To confirm, this CD will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. With your approval, we'll move forward with setting up this CD for you.\n\nRegarding opening multiple CDs concurrently, we can certainly guide you through the process. You can open as many CDs as you like, each potentially with different terms and amounts. To open an additional short-term CD, I'll need to know the amount you wish to deposit into this CD.\n\nPlease confirm if you'd like to proceed with the 13-month CD with early withdrawal, and let me know the deposit amount for the short-term CD so we can continue with the process.",
                "time": "Thu, 21 Mar 2024 08:49:01.427571 GMT"
            }
        ],
        "total_completion_tokens_used": 1222,
        "total_prompt_tokens_used": 31174,
        "updated_at": "Thu, 21 Mar 2024 08:49:01 GMT",
        "user_id": "868569208",
    },
    {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Fri, 22 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "Assistant: Hi, how are you? our experts have checked your account and found that now is a great time for you to open a certificate of deposit. would you like to hear more details about our cd programs?\nUser: Yes, please tell me more.\nAssistant: We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. how much do you think you'll want to deposit?\nUser: User - that sounds interesting. could you explain what benefits come with the longer-term cds compared to the shorter-term ones, and if there are any penalties for early withdrawal? also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 am\nAssistant: Longer-term cds typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. for early withdrawals, some of our cds come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nfor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. our programs offer interest rates ranging from 1.7% to 4.3%. if you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nwould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?\nUser: User - yes, i would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. also, if i decide to add more funds to the cd later on, is that possible, or is the initial deposit amount fixed for the term of the cd?\nAssistant: For a $5,000 deposit in our \"fixed interest 365 days\" program without early withdrawal, the calculation is as follows:\n\n- principal (p): $5,000\n- interest rate: 4.2% (without the new money bonus)\n- duration: 1 year\n\nthe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nregarding the addition of funds, the initial deposit amount is generally fixed for the term of the cd. however, we do offer flexible cds that allow additional deposits. would you like to explore those options, or shall we proceed with the current calculation for different terms?\nUser: User - thank you for the comprehensive explanation. let's proceed with the current calculations for different terms, please. i'd like to understand the potential returns on the short-term 60-day cd, a mid-term option, and the 13-month cd with the new money bonus applied. can you also include whether any of these options allow for additional deposits? and if i were to choose a cd without the possibility of additional funds, is there a way to open multiple cds at once if i decide to allocate more money later? 10:47 am\nAssistant: Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **short-term 60-day cd**: this option does not allow for additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **mid-term option (fixed interest 180-365 days)**: this program also does not allow for additional deposits. the interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month cd with new money bonus**: this program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nif you decide to allocate more money later and the cd does not allow for additional funds, you can indeed open multiple cds at once. each cd would be a separate contract with its own term and interest rate.\n\nwould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month cd?\nUser: Absolutely, a detailed calculation for each option would be very helpful. could you include the total amount i would expect to receive at maturity for each term, as well? additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? thank you for accommodating my inquiries.\nAssistant: The interest rates provided for each cd option are fixed for the duration of the term and are not subject to change based on market conditions. here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **short-term 60-day cd**:\n- interest rate: 2.02%\n- total amount at maturity: $5,016.46\n- total interest earned: $16.46\n\n2. **mid-term option (fixed interest 180-365 days)**:\n- interest rate: 2.62%\n- total amount at maturity: $5,065.50\n- total interest earned: $65.50\n\n3. **13-month cd with new money bonus**:\n- interest rate: 2.15% + 0.5% new money bonus = 2.65%\n- total amount at maturity: $5,132.50\n- total interest earned: $132.50\n\nplease note that these calculations are based on the assumption that the interest is compounded annually. if you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your cd account(s).\nUser: User - the 13-month cd option seems most appealing to me, especially with the new money bonus. i'd like to proceed with opening a 13-month cd with the $5,000 deposit. additionally, i'm considering opening a short-term cd with another amount. could you guide me through the process of opening multiple cds concurrently? do you need any additional information from me to start this process? thank you for your patience and detailed guidance through all of my questions. 10:49 am\nAssistant: I'm glad to hear that you've decided to proceed with opening a 13-month cd with the $5,000 deposit. to confirm, this cd will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. with your approval, we'll move forward with setting up this cd for you.\n\nregarding opening multiple cds concurrently, we can certainly guide you through the process. you can open as many cds as you like, each potentially with different terms and amounts. to open an additional short-term cd, i'll need to know the amount you wish to deposit into this cd.\n\nplease confirm if you'd like to proceed with the 13-month cd with early withdrawal, and let me know the deposit amount for the short-term cd so we can continue with the process.",
        "messages": [
            {
                "file": null,
                "id": "8a0e7b0c-c5bf-4c10-9add-fbe1f315a6d7",
                "pov": "bot",
                "response_time": null,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.554973 GMT"
            },
            {
                "file": null,
                "id": "dc292243-611b-4dfb-b6f0-e592832b66e7",
                "pov": "bot",
                "response_time": 0.04,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.700750 GMT"
            },
            {
                "file": "",
                "id": "762729600",
                "pov": "user",
                "response_time": null,
                "text": "Yes, please tell me more.",
                "time": "Thu, 21 Mar 2024 08:42:43.054072 GMT"
            },
            {
                "file": null,
                "id": "dff07bc5-4631-4f0b-940c-051545f667c5",
                "pov": "bot",
                "response_time": 12.42,
                "text": "We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. How much do you think you'll want to deposit?",
                "time": "Thu, 21 Mar 2024 08:42:55.598501 GMT"
            },
            {
                "file": "",
                "id": "240663615",
                "pov": "user",
                "response_time": null,
                "text": "user - That sounds interesting. Could you explain what benefits come with the longer-term CDs compared to the shorter-term ones, and if there are any penalties for early withdrawal? Also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 AM",
                "time": "Thu, 21 Mar 2024 08:43:10.865284 GMT"
            },
            {
                "file": null,
                "id": "9bb6526f-ca75-44b0-9d25-c0f1d3ba97be",
                "pov": "bot",
                "response_time": 60.69,
                "text": "Longer-term CDs typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. For early withdrawals, some of our CDs come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nFor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. Our programs offer interest rates ranging from 1.7% to 4.3%. If you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nWould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?",
                "time": "Thu, 21 Mar 2024 08:44:11.631189 GMT"
            },
            {
                "file": "",
                "id": "888348593",
                "pov": "user",
                "response_time": null,
                "text": "user - Yes, I would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. Also, if I decide to add more funds to the CD later on, is that possible, or is the initial deposit amount fixed for the term of the CD?",
                "time": "Thu, 21 Mar 2024 08:44:19.436990 GMT"
            },
            {
                "file": null,
                "id": "203f43f9-ade5-4afd-8ba3-b7768540df98",
                "pov": "bot",
                "response_time": 57.72,
                "text": "For a $5,000 deposit in our \"Fixed Interest 365 Days\" program without early withdrawal, the calculation is as follows:\n\n- Principal (P): $5,000\n- Interest Rate: 4.2% (without the new money bonus)\n- Duration: 1 year\n\nThe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nRegarding the addition of funds, the initial deposit amount is generally fixed for the term of the CD. However, we do offer flexible CDs that allow additional deposits. Would you like to explore those options, or shall we proceed with the current calculation for different terms?",
                "time": "Thu, 21 Mar 2024 08:45:17.230831 GMT"
            },
            {
                "file": "",
                "id": "149960276",
                "pov": "user",
                "response_time": null,
                "text": "user - Thank you for the comprehensive explanation. Let's proceed with the current calculations for different terms, please. I'd like to understand the potential returns on the short-term 60-day CD, a mid-term option, and the 13-month CD with the new money bonus applied. Can you also include whether any of these options allow for additional deposits? And if I were to choose a CD without the possibility of additional funds, is there a way to open multiple CDs at once if I decide to allocate more money later? 10:47 AM",
                "time": "Thu, 21 Mar 2024 08:45:39.005738 GMT"
            },
            {
                "file": null,
                "id": "9abb712e-7997-4f46-86e4-92b6034706a4",
                "pov": "bot",
                "response_time": 70.31,
                "text": "Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **Short-term 60-day CD**: This option does not allow for additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**: This program also does not allow for additional deposits. The interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month CD with New Money Bonus**: This program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nIf you decide to allocate more money later and the CD does not allow for additional funds, you can indeed open multiple CDs at once. Each CD would be a separate contract with its own term and interest rate.\n\nWould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month CD?",
                "time": "Thu, 21 Mar 2024 08:46:49.514318 GMT"
            },
            {
                "file": "",
                "id": "491313305",
                "pov": "user",
                "response_time": null,
                "text": "Absolutely, a detailed calculation for each option would be very helpful. Could you include the total amount I would expect to receive at maturity for each term, as well? Additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? Thank you for accommodating my inquiries.",
                "time": "Thu, 21 Mar 2024 08:47:04.791002 GMT"
            },
            {
                "file": null,
                "id": "4f761f7a-48ba-4df7-9cfe-02fc27c63eb6",
                "pov": "bot",
                "response_time": 73.89,
                "text": "The interest rates provided for each CD option are fixed for the duration of the term and are not subject to change based on market conditions. Here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **Short-term 60-day CD**:\n- Interest Rate: 2.02%\n- Total Amount at Maturity: $5,016.46\n- Total Interest Earned: $16.46\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**:\n- Interest Rate: 2.62%\n- Total Amount at Maturity: $5,065.50\n- Total Interest Earned: $65.50\n\n3. **13-month CD with New Money Bonus**:\n- Interest Rate: 2.15% + 0.5% New Money Bonus = 2.65%\n- Total Amount at Maturity: $5,132.50\n- Total Interest Earned: $132.50\n\nPlease note that these calculations are based on the assumption that the interest is compounded annually. If you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your CD account(s).",
                "time": "Thu, 21 Mar 2024 08:48:18.787691 GMT"
            },
            {
                "file": "",
                "id": "889107670",
                "pov": "user",
                "response_time": null,
                "text": "user - The 13-month CD option seems most appealing to me, especially with the new money bonus. I'd like to proceed with opening a 13-month CD with the $5,000 deposit. Additionally, I'm considering opening a short-term CD with another amount. Could you guide me through the process of opening multiple CDs concurrently? Do you need any additional information from me to start this process? Thank you for your patience and detailed guidance through all of my questions. 10:49 AM",
                "time": "Thu, 21 Mar 2024 08:48:35.326384 GMT"
            },
            {
                "file": null,
                "id": "a41e47cd-ac1c-4c68-90df-10b352b93cf1",
                "pov": "bot",
                "response_time": 25.95,
                "text": "I'm glad to hear that you've decided to proceed with opening a 13-month CD with the $5,000 deposit. To confirm, this CD will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. With your approval, we'll move forward with setting up this CD for you.\n\nRegarding opening multiple CDs concurrently, we can certainly guide you through the process. You can open as many CDs as you like, each potentially with different terms and amounts. To open an additional short-term CD, I'll need to know the amount you wish to deposit into this CD.\n\nPlease confirm if you'd like to proceed with the 13-month CD with early withdrawal, and let me know the deposit amount for the short-term CD so we can continue with the process.",
                "time": "Thu, 21 Mar 2024 08:49:01.427571 GMT"
            }
        ],
        "total_completion_tokens_used": 1222,
        "total_prompt_tokens_used": 31174,
        "updated_at": "Thu, 21 Mar 2024 08:49:01 GMT",
        "user_id": "868569208",
    },
    {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Thu, 22 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "Assistant: Hi, how are you? our experts have checked your account and found that now is a great time for you to open a certificate of deposit. would you like to hear more details about our cd programs?\nUser: Yes, please tell me more.\nAssistant: We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. how much do you think you'll want to deposit?\nUser: User - that sounds interesting. could you explain what benefits come with the longer-term cds compared to the shorter-term ones, and if there are any penalties for early withdrawal? also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 am\nAssistant: Longer-term cds typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. for early withdrawals, some of our cds come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nfor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. our programs offer interest rates ranging from 1.7% to 4.3%. if you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nwould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?\nUser: User - yes, i would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. also, if i decide to add more funds to the cd later on, is that possible, or is the initial deposit amount fixed for the term of the cd?\nAssistant: For a $5,000 deposit in our \"fixed interest 365 days\" program without early withdrawal, the calculation is as follows:\n\n- principal (p): $5,000\n- interest rate: 4.2% (without the new money bonus)\n- duration: 1 year\n\nthe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nregarding the addition of funds, the initial deposit amount is generally fixed for the term of the cd. however, we do offer flexible cds that allow additional deposits. would you like to explore those options, or shall we proceed with the current calculation for different terms?\nUser: User - thank you for the comprehensive explanation. let's proceed with the current calculations for different terms, please. i'd like to understand the potential returns on the short-term 60-day cd, a mid-term option, and the 13-month cd with the new money bonus applied. can you also include whether any of these options allow for additional deposits? and if i were to choose a cd without the possibility of additional funds, is there a way to open multiple cds at once if i decide to allocate more money later? 10:47 am\nAssistant: Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **short-term 60-day cd**: this option does not allow for additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **mid-term option (fixed interest 180-365 days)**: this program also does not allow for additional deposits. the interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month cd with new money bonus**: this program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nif you decide to allocate more money later and the cd does not allow for additional funds, you can indeed open multiple cds at once. each cd would be a separate contract with its own term and interest rate.\n\nwould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month cd?\nUser: Absolutely, a detailed calculation for each option would be very helpful. could you include the total amount i would expect to receive at maturity for each term, as well? additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? thank you for accommodating my inquiries.\nAssistant: The interest rates provided for each cd option are fixed for the duration of the term and are not subject to change based on market conditions. here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **short-term 60-day cd**:\n- interest rate: 2.02%\n- total amount at maturity: $5,016.46\n- total interest earned: $16.46\n\n2. **mid-term option (fixed interest 180-365 days)**:\n- interest rate: 2.62%\n- total amount at maturity: $5,065.50\n- total interest earned: $65.50\n\n3. **13-month cd with new money bonus**:\n- interest rate: 2.15% + 0.5% new money bonus = 2.65%\n- total amount at maturity: $5,132.50\n- total interest earned: $132.50\n\nplease note that these calculations are based on the assumption that the interest is compounded annually. if you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your cd account(s).\nUser: User - the 13-month cd option seems most appealing to me, especially with the new money bonus. i'd like to proceed with opening a 13-month cd with the $5,000 deposit. additionally, i'm considering opening a short-term cd with another amount. could you guide me through the process of opening multiple cds concurrently? do you need any additional information from me to start this process? thank you for your patience and detailed guidance through all of my questions. 10:49 am\nAssistant: I'm glad to hear that you've decided to proceed with opening a 13-month cd with the $5,000 deposit. to confirm, this cd will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. with your approval, we'll move forward with setting up this cd for you.\n\nregarding opening multiple cds concurrently, we can certainly guide you through the process. you can open as many cds as you like, each potentially with different terms and amounts. to open an additional short-term cd, i'll need to know the amount you wish to deposit into this cd.\n\nplease confirm if you'd like to proceed with the 13-month cd with early withdrawal, and let me know the deposit amount for the short-term cd so we can continue with the process.",
        "messages": [
            {
                "file": null,
                "id": "8a0e7b0c-c5bf-4c10-9add-fbe1f315a6d7",
                "pov": "bot",
                "response_time": null,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.554973 GMT"
            },
            {
                "file": null,
                "id": "dc292243-611b-4dfb-b6f0-e592832b66e7",
                "pov": "bot",
                "response_time": 0.04,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.700750 GMT"
            },
            {
                "file": "",
                "id": "762729600",
                "pov": "user",
                "response_time": null,
                "text": "Yes, please tell me more.",
                "time": "Thu, 21 Mar 2024 08:42:43.054072 GMT"
            },
            {
                "file": null,
                "id": "dff07bc5-4631-4f0b-940c-051545f667c5",
                "pov": "bot",
                "response_time": 12.42,
                "text": "We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. How much do you think you'll want to deposit?",
                "time": "Thu, 21 Mar 2024 08:42:55.598501 GMT"
            },
            {
                "file": "",
                "id": "240663615",
                "pov": "user",
                "response_time": null,
                "text": "user - That sounds interesting. Could you explain what benefits come with the longer-term CDs compared to the shorter-term ones, and if there are any penalties for early withdrawal? Also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 AM",
                "time": "Thu, 21 Mar 2024 08:43:10.865284 GMT"
            },
            {
                "file": null,
                "id": "9bb6526f-ca75-44b0-9d25-c0f1d3ba97be",
                "pov": "bot",
                "response_time": 60.69,
                "text": "Longer-term CDs typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. For early withdrawals, some of our CDs come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nFor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. Our programs offer interest rates ranging from 1.7% to 4.3%. If you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nWould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?",
                "time": "Thu, 21 Mar 2024 08:44:11.631189 GMT"
            },
            {
                "file": "",
                "id": "888348593",
                "pov": "user",
                "response_time": null,
                "text": "user - Yes, I would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. Also, if I decide to add more funds to the CD later on, is that possible, or is the initial deposit amount fixed for the term of the CD?",
                "time": "Thu, 21 Mar 2024 08:44:19.436990 GMT"
            },
            {
                "file": null,
                "id": "203f43f9-ade5-4afd-8ba3-b7768540df98",
                "pov": "bot",
                "response_time": 57.72,
                "text": "For a $5,000 deposit in our \"Fixed Interest 365 Days\" program without early withdrawal, the calculation is as follows:\n\n- Principal (P): $5,000\n- Interest Rate: 4.2% (without the new money bonus)\n- Duration: 1 year\n\nThe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nRegarding the addition of funds, the initial deposit amount is generally fixed for the term of the CD. However, we do offer flexible CDs that allow additional deposits. Would you like to explore those options, or shall we proceed with the current calculation for different terms?",
                "time": "Thu, 21 Mar 2024 08:45:17.230831 GMT"
            },
            {
                "file": "",
                "id": "149960276",
                "pov": "user",
                "response_time": null,
                "text": "user - Thank you for the comprehensive explanation. Let's proceed with the current calculations for different terms, please. I'd like to understand the potential returns on the short-term 60-day CD, a mid-term option, and the 13-month CD with the new money bonus applied. Can you also include whether any of these options allow for additional deposits? And if I were to choose a CD without the possibility of additional funds, is there a way to open multiple CDs at once if I decide to allocate more money later? 10:47 AM",
                "time": "Thu, 21 Mar 2024 08:45:39.005738 GMT"
            },
            {
                "file": null,
                "id": "9abb712e-7997-4f46-86e4-92b6034706a4",
                "pov": "bot",
                "response_time": 70.31,
                "text": "Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **Short-term 60-day CD**: This option does not allow for additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**: This program also does not allow for additional deposits. The interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month CD with New Money Bonus**: This program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nIf you decide to allocate more money later and the CD does not allow for additional funds, you can indeed open multiple CDs at once. Each CD would be a separate contract with its own term and interest rate.\n\nWould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month CD?",
                "time": "Thu, 21 Mar 2024 08:46:49.514318 GMT"
            },
            {
                "file": "",
                "id": "491313305",
                "pov": "user",
                "response_time": null,
                "text": "Absolutely, a detailed calculation for each option would be very helpful. Could you include the total amount I would expect to receive at maturity for each term, as well? Additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? Thank you for accommodating my inquiries.",
                "time": "Thu, 21 Mar 2024 08:47:04.791002 GMT"
            },
            {
                "file": null,
                "id": "4f761f7a-48ba-4df7-9cfe-02fc27c63eb6",
                "pov": "bot",
                "response_time": 73.89,
                "text": "The interest rates provided for each CD option are fixed for the duration of the term and are not subject to change based on market conditions. Here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **Short-term 60-day CD**:\n- Interest Rate: 2.02%\n- Total Amount at Maturity: $5,016.46\n- Total Interest Earned: $16.46\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**:\n- Interest Rate: 2.62%\n- Total Amount at Maturity: $5,065.50\n- Total Interest Earned: $65.50\n\n3. **13-month CD with New Money Bonus**:\n- Interest Rate: 2.15% + 0.5% New Money Bonus = 2.65%\n- Total Amount at Maturity: $5,132.50\n- Total Interest Earned: $132.50\n\nPlease note that these calculations are based on the assumption that the interest is compounded annually. If you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your CD account(s).",
                "time": "Thu, 21 Mar 2024 08:48:18.787691 GMT"
            },
            {
                "file": "",
                "id": "889107670",
                "pov": "user",
                "response_time": null,
                "text": "user - The 13-month CD option seems most appealing to me, especially with the new money bonus. I'd like to proceed with opening a 13-month CD with the $5,000 deposit. Additionally, I'm considering opening a short-term CD with another amount. Could you guide me through the process of opening multiple CDs concurrently? Do you need any additional information from me to start this process? Thank you for your patience and detailed guidance through all of my questions. 10:49 AM",
                "time": "Thu, 21 Mar 2024 08:48:35.326384 GMT"
            },
            {
                "file": null,
                "id": "a41e47cd-ac1c-4c68-90df-10b352b93cf1",
                "pov": "bot",
                "response_time": 25.95,
                "text": "I'm glad to hear that you've decided to proceed with opening a 13-month CD with the $5,000 deposit. To confirm, this CD will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. With your approval, we'll move forward with setting up this CD for you.\n\nRegarding opening multiple CDs concurrently, we can certainly guide you through the process. You can open as many CDs as you like, each potentially with different terms and amounts. To open an additional short-term CD, I'll need to know the amount you wish to deposit into this CD.\n\nPlease confirm if you'd like to proceed with the 13-month CD with early withdrawal, and let me know the deposit amount for the short-term CD so we can continue with the process.",
                "time": "Thu, 21 Mar 2024 08:49:01.427571 GMT"
            }
        ],
        "total_completion_tokens_used": 1222,
        "total_prompt_tokens_used": 31174,
        "updated_at": "Thu, 21 Mar 2024 08:49:01 GMT",
        "user_id": "868569208",
    },
    {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Thu, 21 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "Assistant: Hi, how are you? our experts have checked your account and found that now is a great time for you to open a certificate of deposit. would you like to hear more details about our cd programs?\nUser: Yes, please tell me more.\nAssistant: We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. how much do you think you'll want to deposit?\nUser: User - that sounds interesting. could you explain what benefits come with the longer-term cds compared to the shorter-term ones, and if there are any penalties for early withdrawal? also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 am\nAssistant: Longer-term cds typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. for early withdrawals, some of our cds come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nfor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. our programs offer interest rates ranging from 1.7% to 4.3%. if you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nwould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?\nUser: User - yes, i would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. also, if i decide to add more funds to the cd later on, is that possible, or is the initial deposit amount fixed for the term of the cd?\nAssistant: For a $5,000 deposit in our \"fixed interest 365 days\" program without early withdrawal, the calculation is as follows:\n\n- principal (p): $5,000\n- interest rate: 4.2% (without the new money bonus)\n- duration: 1 year\n\nthe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nregarding the addition of funds, the initial deposit amount is generally fixed for the term of the cd. however, we do offer flexible cds that allow additional deposits. would you like to explore those options, or shall we proceed with the current calculation for different terms?\nUser: User - thank you for the comprehensive explanation. let's proceed with the current calculations for different terms, please. i'd like to understand the potential returns on the short-term 60-day cd, a mid-term option, and the 13-month cd with the new money bonus applied. can you also include whether any of these options allow for additional deposits? and if i were to choose a cd without the possibility of additional funds, is there a way to open multiple cds at once if i decide to allocate more money later? 10:47 am\nAssistant: Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **short-term 60-day cd**: this option does not allow for additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **mid-term option (fixed interest 180-365 days)**: this program also does not allow for additional deposits. the interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month cd with new money bonus**: this program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nif you decide to allocate more money later and the cd does not allow for additional funds, you can indeed open multiple cds at once. each cd would be a separate contract with its own term and interest rate.\n\nwould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month cd?\nUser: Absolutely, a detailed calculation for each option would be very helpful. could you include the total amount i would expect to receive at maturity for each term, as well? additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? thank you for accommodating my inquiries.\nAssistant: The interest rates provided for each cd option are fixed for the duration of the term and are not subject to change based on market conditions. here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **short-term 60-day cd**:\n- interest rate: 2.02%\n- total amount at maturity: $5,016.46\n- total interest earned: $16.46\n\n2. **mid-term option (fixed interest 180-365 days)**:\n- interest rate: 2.62%\n- total amount at maturity: $5,065.50\n- total interest earned: $65.50\n\n3. **13-month cd with new money bonus**:\n- interest rate: 2.15% + 0.5% new money bonus = 2.65%\n- total amount at maturity: $5,132.50\n- total interest earned: $132.50\n\nplease note that these calculations are based on the assumption that the interest is compounded annually. if you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your cd account(s).\nUser: User - the 13-month cd option seems most appealing to me, especially with the new money bonus. i'd like to proceed with opening a 13-month cd with the $5,000 deposit. additionally, i'm considering opening a short-term cd with another amount. could you guide me through the process of opening multiple cds concurrently? do you need any additional information from me to start this process? thank you for your patience and detailed guidance through all of my questions. 10:49 am\nAssistant: I'm glad to hear that you've decided to proceed with opening a 13-month cd with the $5,000 deposit. to confirm, this cd will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. with your approval, we'll move forward with setting up this cd for you.\n\nregarding opening multiple cds concurrently, we can certainly guide you through the process. you can open as many cds as you like, each potentially with different terms and amounts. to open an additional short-term cd, i'll need to know the amount you wish to deposit into this cd.\n\nplease confirm if you'd like to proceed with the 13-month cd with early withdrawal, and let me know the deposit amount for the short-term cd so we can continue with the process.",
        "messages": [
            {
                "file": null,
                "id": "8a0e7b0c-c5bf-4c10-9add-fbe1f315a6d7",
                "pov": "bot",
                "response_time": null,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.554973 GMT"
            },
            {
                "file": null,
                "id": "dc292243-611b-4dfb-b6f0-e592832b66e7",
                "pov": "bot",
                "response_time": 0.04,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.700750 GMT"
            },
            {
                "file": "",
                "id": "762729600",
                "pov": "user",
                "response_time": null,
                "text": "Yes, please tell me more.",
                "time": "Thu, 21 Mar 2024 08:42:43.054072 GMT"
            },
            {
                "file": null,
                "id": "dff07bc5-4631-4f0b-940c-051545f667c5",
                "pov": "bot",
                "response_time": 12.42,
                "text": "We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. How much do you think you'll want to deposit?",
                "time": "Thu, 21 Mar 2024 08:42:55.598501 GMT"
            },
            {
                "file": "",
                "id": "240663615",
                "pov": "user",
                "response_time": null,
                "text": "user - That sounds interesting. Could you explain what benefits come with the longer-term CDs compared to the shorter-term ones, and if there are any penalties for early withdrawal? Also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 AM",
                "time": "Thu, 21 Mar 2024 08:43:10.865284 GMT"
            },
            {
                "file": null,
                "id": "9bb6526f-ca75-44b0-9d25-c0f1d3ba97be",
                "pov": "bot",
                "response_time": 60.69,
                "text": "Longer-term CDs typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. For early withdrawals, some of our CDs come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nFor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. Our programs offer interest rates ranging from 1.7% to 4.3%. If you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nWould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?",
                "time": "Thu, 21 Mar 2024 08:44:11.631189 GMT"
            },
            {
                "file": "",
                "id": "888348593",
                "pov": "user",
                "response_time": null,
                "text": "user - Yes, I would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. Also, if I decide to add more funds to the CD later on, is that possible, or is the initial deposit amount fixed for the term of the CD?",
                "time": "Thu, 21 Mar 2024 08:44:19.436990 GMT"
            },
            {
                "file": null,
                "id": "203f43f9-ade5-4afd-8ba3-b7768540df98",
                "pov": "bot",
                "response_time": 57.72,
                "text": "For a $5,000 deposit in our \"Fixed Interest 365 Days\" program without early withdrawal, the calculation is as follows:\n\n- Principal (P): $5,000\n- Interest Rate: 4.2% (without the new money bonus)\n- Duration: 1 year\n\nThe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nRegarding the addition of funds, the initial deposit amount is generally fixed for the term of the CD. However, we do offer flexible CDs that allow additional deposits. Would you like to explore those options, or shall we proceed with the current calculation for different terms?",
                "time": "Thu, 21 Mar 2024 08:45:17.230831 GMT"
            },
            {
                "file": "",
                "id": "149960276",
                "pov": "user",
                "response_time": null,
                "text": "user - Thank you for the comprehensive explanation. Let's proceed with the current calculations for different terms, please. I'd like to understand the potential returns on the short-term 60-day CD, a mid-term option, and the 13-month CD with the new money bonus applied. Can you also include whether any of these options allow for additional deposits? And if I were to choose a CD without the possibility of additional funds, is there a way to open multiple CDs at once if I decide to allocate more money later? 10:47 AM",
                "time": "Thu, 21 Mar 2024 08:45:39.005738 GMT"
            },
            {
                "file": null,
                "id": "9abb712e-7997-4f46-86e4-92b6034706a4",
                "pov": "bot",
                "response_time": 70.31,
                "text": "Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **Short-term 60-day CD**: This option does not allow for additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**: This program also does not allow for additional deposits. The interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month CD with New Money Bonus**: This program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nIf you decide to allocate more money later and the CD does not allow for additional funds, you can indeed open multiple CDs at once. Each CD would be a separate contract with its own term and interest rate.\n\nWould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month CD?",
                "time": "Thu, 21 Mar 2024 08:46:49.514318 GMT"
            },
            {
                "file": "",
                "id": "491313305",
                "pov": "user",
                "response_time": null,
                "text": "Absolutely, a detailed calculation for each option would be very helpful. Could you include the total amount I would expect to receive at maturity for each term, as well? Additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? Thank you for accommodating my inquiries.",
                "time": "Thu, 21 Mar 2024 08:47:04.791002 GMT"
            },
            {
                "file": null,
                "id": "4f761f7a-48ba-4df7-9cfe-02fc27c63eb6",
                "pov": "bot",
                "response_time": 73.89,
                "text": "The interest rates provided for each CD option are fixed for the duration of the term and are not subject to change based on market conditions. Here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **Short-term 60-day CD**:\n- Interest Rate: 2.02%\n- Total Amount at Maturity: $5,016.46\n- Total Interest Earned: $16.46\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**:\n- Interest Rate: 2.62%\n- Total Amount at Maturity: $5,065.50\n- Total Interest Earned: $65.50\n\n3. **13-month CD with New Money Bonus**:\n- Interest Rate: 2.15% + 0.5% New Money Bonus = 2.65%\n- Total Amount at Maturity: $5,132.50\n- Total Interest Earned: $132.50\n\nPlease note that these calculations are based on the assumption that the interest is compounded annually. If you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your CD account(s).",
                "time": "Thu, 21 Mar 2024 08:48:18.787691 GMT"
            },
            {
                "file": "",
                "id": "889107670",
                "pov": "user",
                "response_time": null,
                "text": "user - The 13-month CD option seems most appealing to me, especially with the new money bonus. I'd like to proceed with opening a 13-month CD with the $5,000 deposit. Additionally, I'm considering opening a short-term CD with another amount. Could you guide me through the process of opening multiple CDs concurrently? Do you need any additional information from me to start this process? Thank you for your patience and detailed guidance through all of my questions. 10:49 AM",
                "time": "Thu, 21 Mar 2024 08:48:35.326384 GMT"
            },
            {
                "file": null,
                "id": "a41e47cd-ac1c-4c68-90df-10b352b93cf1",
                "pov": "bot",
                "response_time": 25.95,
                "text": "I'm glad to hear that you've decided to proceed with opening a 13-month CD with the $5,000 deposit. To confirm, this CD will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. With your approval, we'll move forward with setting up this CD for you.\n\nRegarding opening multiple CDs concurrently, we can certainly guide you through the process. You can open as many CDs as you like, each potentially with different terms and amounts. To open an additional short-term CD, I'll need to know the amount you wish to deposit into this CD.\n\nPlease confirm if you'd like to proceed with the 13-month CD with early withdrawal, and let me know the deposit amount for the short-term CD so we can continue with the process.",
                "time": "Thu, 21 Mar 2024 08:49:01.427571 GMT"
            }
        ],
        "total_completion_tokens_used": 1222,
        "total_prompt_tokens_used": 31174,
        "updated_at": "Thu, 21 Mar 2024 08:49:01 GMT",
        "user_id": "868569208",
    },
    {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Mon, 25 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "Assistant: Hi, how are you? our experts have checked your account and found that now is a great time for you to open a certificate of deposit. would you like to hear more details about our cd programs?\nUser: Yes, please tell me more.\nAssistant: We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. how much do you think you'll want to deposit?\nUser: User - that sounds interesting. could you explain what benefits come with the longer-term cds compared to the shorter-term ones, and if there are any penalties for early withdrawal? also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 am\nAssistant: Longer-term cds typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. for early withdrawals, some of our cds come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nfor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. our programs offer interest rates ranging from 1.7% to 4.3%. if you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nwould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?\nUser: User - yes, i would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. also, if i decide to add more funds to the cd later on, is that possible, or is the initial deposit amount fixed for the term of the cd?\nAssistant: For a $5,000 deposit in our \"fixed interest 365 days\" program without early withdrawal, the calculation is as follows:\n\n- principal (p): $5,000\n- interest rate: 4.2% (without the new money bonus)\n- duration: 1 year\n\nthe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nregarding the addition of funds, the initial deposit amount is generally fixed for the term of the cd. however, we do offer flexible cds that allow additional deposits. would you like to explore those options, or shall we proceed with the current calculation for different terms?\nUser: User - thank you for the comprehensive explanation. let's proceed with the current calculations for different terms, please. i'd like to understand the potential returns on the short-term 60-day cd, a mid-term option, and the 13-month cd with the new money bonus applied. can you also include whether any of these options allow for additional deposits? and if i were to choose a cd without the possibility of additional funds, is there a way to open multiple cds at once if i decide to allocate more money later? 10:47 am\nAssistant: Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **short-term 60-day cd**: this option does not allow for additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **mid-term option (fixed interest 180-365 days)**: this program also does not allow for additional deposits. the interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month cd with new money bonus**: this program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. the interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nif you decide to allocate more money later and the cd does not allow for additional funds, you can indeed open multiple cds at once. each cd would be a separate contract with its own term and interest rate.\n\nwould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month cd?\nUser: Absolutely, a detailed calculation for each option would be very helpful. could you include the total amount i would expect to receive at maturity for each term, as well? additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? thank you for accommodating my inquiries.\nAssistant: The interest rates provided for each cd option are fixed for the duration of the term and are not subject to change based on market conditions. here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **short-term 60-day cd**:\n- interest rate: 2.02%\n- total amount at maturity: $5,016.46\n- total interest earned: $16.46\n\n2. **mid-term option (fixed interest 180-365 days)**:\n- interest rate: 2.62%\n- total amount at maturity: $5,065.50\n- total interest earned: $65.50\n\n3. **13-month cd with new money bonus**:\n- interest rate: 2.15% + 0.5% new money bonus = 2.65%\n- total amount at maturity: $5,132.50\n- total interest earned: $132.50\n\nplease note that these calculations are based on the assumption that the interest is compounded annually. if you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your cd account(s).\nUser: User - the 13-month cd option seems most appealing to me, especially with the new money bonus. i'd like to proceed with opening a 13-month cd with the $5,000 deposit. additionally, i'm considering opening a short-term cd with another amount. could you guide me through the process of opening multiple cds concurrently? do you need any additional information from me to start this process? thank you for your patience and detailed guidance through all of my questions. 10:49 am\nAssistant: I'm glad to hear that you've decided to proceed with opening a 13-month cd with the $5,000 deposit. to confirm, this cd will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. with your approval, we'll move forward with setting up this cd for you.\n\nregarding opening multiple cds concurrently, we can certainly guide you through the process. you can open as many cds as you like, each potentially with different terms and amounts. to open an additional short-term cd, i'll need to know the amount you wish to deposit into this cd.\n\nplease confirm if you'd like to proceed with the 13-month cd with early withdrawal, and let me know the deposit amount for the short-term cd so we can continue with the process.",
        "messages": [
            {
                "file": null,
                "id": "8a0e7b0c-c5bf-4c10-9add-fbe1f315a6d7",
                "pov": "bot",
                "response_time": null,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.554973 GMT"
            },
            {
                "file": null,
                "id": "dc292243-611b-4dfb-b6f0-e592832b66e7",
                "pov": "bot",
                "response_time": 0.04,
                "text": "Hi, how are you? Our experts have checked your account and found that now is a great time for you to open a Certificate of Deposit. Would you like to hear more details about our CD programs?",
                "time": "Thu, 21 Mar 2024 08:42:42.700750 GMT"
            },
            {
                "file": "",
                "id": "762729600",
                "pov": "user",
                "response_time": null,
                "text": "Yes, please tell me more.",
                "time": "Thu, 21 Mar 2024 08:42:43.054072 GMT"
            },
            {
                "file": null,
                "id": "dff07bc5-4631-4f0b-940c-051545f667c5",
                "pov": "bot",
                "response_time": 12.42,
                "text": "We offer a variety of options which range from 60 days to 13 months, some of which have early withdrawal options, and the interests rates can be from around 1.7% to 4.3%. How much do you think you'll want to deposit?",
                "time": "Thu, 21 Mar 2024 08:42:55.598501 GMT"
            },
            {
                "file": "",
                "id": "240663615",
                "pov": "user",
                "response_time": null,
                "text": "user - That sounds interesting. Could you explain what benefits come with the longer-term CDs compared to the shorter-term ones, and if there are any penalties for early withdrawal? Also, what would be the difference in interest earned for a deposit of, let's say, $5,000 for the different terms you offer?10:44 AM",
                "time": "Thu, 21 Mar 2024 08:43:10.865284 GMT"
            },
            {
                "file": null,
                "id": "9bb6526f-ca75-44b0-9d25-c0f1d3ba97be",
                "pov": "bot",
                "response_time": 60.69,
                "text": "Longer-term CDs typically offer higher interest rates compared to shorter-term ones, rewarding you for committing your funds for a longer period. For early withdrawals, some of our CDs come with the option to withdraw funds at predetermined points without penalties, while others may not offer this flexibility, resulting in higher interest rates.\n\nFor a deposit of $5,000, the interest earned would vary depending on the term and the specific program you choose. Our programs offer interest rates ranging from 1.7% to 4.3%. If you bring new money from outside the bank, you can enjoy an additional 0.5% interest rate bonus.\n\nWould you like to proceed with a specific term or get a calculation of the interest you could earn on a $5,000 deposit for different terms?",
                "time": "Thu, 21 Mar 2024 08:44:11.631189 GMT"
            },
            {
                "file": "",
                "id": "888348593",
                "pov": "user",
                "response_time": null,
                "text": "user - Yes, I would like to see a calculation of the potential interest for a $5,000 deposit across a few different terms, including your shortest and longest options. Also, if I decide to add more funds to the CD later on, is that possible, or is the initial deposit amount fixed for the term of the CD?",
                "time": "Thu, 21 Mar 2024 08:44:19.436990 GMT"
            },
            {
                "file": null,
                "id": "203f43f9-ade5-4afd-8ba3-b7768540df98",
                "pov": "bot",
                "response_time": 57.72,
                "text": "For a $5,000 deposit in our \"Fixed Interest 365 Days\" program without early withdrawal, the calculation is as follows:\n\n- Principal (P): $5,000\n- Interest Rate: 4.2% (without the new money bonus)\n- Duration: 1 year\n\nThe total amount after interest would be approximately $5,210, which means you would earn $210 in interest over the course of a year.\n\nRegarding the addition of funds, the initial deposit amount is generally fixed for the term of the CD. However, we do offer flexible CDs that allow additional deposits. Would you like to explore those options, or shall we proceed with the current calculation for different terms?",
                "time": "Thu, 21 Mar 2024 08:45:17.230831 GMT"
            },
            {
                "file": "",
                "id": "149960276",
                "pov": "user",
                "response_time": null,
                "text": "user - Thank you for the comprehensive explanation. Let's proceed with the current calculations for different terms, please. I'd like to understand the potential returns on the short-term 60-day CD, a mid-term option, and the 13-month CD with the new money bonus applied. Can you also include whether any of these options allow for additional deposits? And if I were to choose a CD without the possibility of additional funds, is there a way to open multiple CDs at once if I decide to allocate more money later? 10:47 AM",
                "time": "Thu, 21 Mar 2024 08:45:39.005738 GMT"
            },
            {
                "file": null,
                "id": "9abb712e-7997-4f46-86e4-92b6034706a4",
                "pov": "bot",
                "response_time": 70.31,
                "text": "Certainly, let's look at the potential returns for the different terms you're interested in:\n\n1. **Short-term 60-day CD**: This option does not allow for additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.02%.\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**: This program also does not allow for additional deposits. The interest rate for a deposit of $5,000 would be approximately 2.62%.\n\n3. **13-month CD with New Money Bonus**: This program allows for early withdrawal at specific points (3, 6, and 9 months) but does not support additional deposits after the initial funding. The interest rate for a deposit of $5,000 would be approximately 2.15%, plus a new money bonus of 0.5%, totaling 2.65%.\n\nIf you decide to allocate more money later and the CD does not allow for additional funds, you can indeed open multiple CDs at once. Each CD would be a separate contract with its own term and interest rate.\n\nWould you like me to calculate the exact interest for these options with the $5,000 deposit, including the new money bonus for the 13-month CD?",
                "time": "Thu, 21 Mar 2024 08:46:49.514318 GMT"
            },
            {
                "file": "",
                "id": "491313305",
                "pov": "user",
                "response_time": null,
                "text": "Absolutely, a detailed calculation for each option would be very helpful. Could you include the total amount I would expect to receive at maturity for each term, as well? Additionally, are the interest rates you've provided fixed for the duration of the term, or are they subject to change based on market conditions? Thank you for accommodating my inquiries.",
                "time": "Thu, 21 Mar 2024 08:47:04.791002 GMT"
            },
            {
                "file": null,
                "id": "4f761f7a-48ba-4df7-9cfe-02fc27c63eb6",
                "pov": "bot",
                "response_time": 73.89,
                "text": "The interest rates provided for each CD option are fixed for the duration of the term and are not subject to change based on market conditions. Here are the detailed calculations for each option with a $5,000 deposit:\n\n1. **Short-term 60-day CD**:\n- Interest Rate: 2.02%\n- Total Amount at Maturity: $5,016.46\n- Total Interest Earned: $16.46\n\n2. **Mid-term Option (Fixed Interest 180-365 Days)**:\n- Interest Rate: 2.62%\n- Total Amount at Maturity: $5,065.50\n- Total Interest Earned: $65.50\n\n3. **13-month CD with New Money Bonus**:\n- Interest Rate: 2.15% + 0.5% New Money Bonus = 2.65%\n- Total Amount at Maturity: $5,132.50\n- Total Interest Earned: $132.50\n\nPlease note that these calculations are based on the assumption that the interest is compounded annually. If you're satisfied with these rates and would like to proceed, please confirm, and we can move forward with opening your CD account(s).",
                "time": "Thu, 21 Mar 2024 08:48:18.787691 GMT"
            },
            {
                "file": "",
                "id": "889107670",
                "pov": "user",
                "response_time": null,
                "text": "user - The 13-month CD option seems most appealing to me, especially with the new money bonus. I'd like to proceed with opening a 13-month CD with the $5,000 deposit. Additionally, I'm considering opening a short-term CD with another amount. Could you guide me through the process of opening multiple CDs concurrently? Do you need any additional information from me to start this process? Thank you for your patience and detailed guidance through all of my questions. 10:49 AM",
                "time": "Thu, 21 Mar 2024 08:48:35.326384 GMT"
            },
            {
                "file": null,
                "id": "a41e47cd-ac1c-4c68-90df-10b352b93cf1",
                "pov": "bot",
                "response_time": 25.95,
                "text": "I'm glad to hear that you've decided to proceed with opening a 13-month CD with the $5,000 deposit. To confirm, this CD will include the option for early withdrawal, which provides flexibility but comes with a slightly lower interest rate. With your approval, we'll move forward with setting up this CD for you.\n\nRegarding opening multiple CDs concurrently, we can certainly guide you through the process. You can open as many CDs as you like, each potentially with different terms and amounts. To open an additional short-term CD, I'll need to know the amount you wish to deposit into this CD.\n\nPlease confirm if you'd like to proceed with the 13-month CD with early withdrawal, and let me know the deposit amount for the short-term CD so we can continue with the process.",
                "time": "Thu, 21 Mar 2024 08:49:01.427571 GMT"
            }
        ],
        "total_completion_tokens_used": 1222,
        "total_prompt_tokens_used": 31174,
        "updated_at": "Thu, 21 Mar 2024 08:49:01 GMT",
        "user_id": "868569208",
    },
    {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Sun, 24 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Sun, 24 Mar 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": false,
        "created_at": "Mon, 18 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Mon, 18 Mar 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Tue, 19 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Tue, 19 Mar 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": false,
        "created_at": "Wed, 20 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Wed, 20 Mar 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Thu, 21 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Thu, 21 Mar 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": false,
        "created_at": "Fri, 22 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Fri, 22 Mar 2024 08:42:41 GMT",
        "user_id": "868569208",
    },
    {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Sat, 23 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Sat, 23 Mar 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": false,
        "created_at": "Sun, 24 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Sun, 24 Mar 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Sun, 31 Mar 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Sun, 31 Mar 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": false,
        "created_at": "Mon, 01 Apr 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Mon, 01 Apr 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Tue, 02 Apr 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Tue, 02 Apr 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": false,
        "created_at": "Wed, 03 Apr 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Wed, 03 Apr 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Thu, 04 Apr 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Thu, 04 Apr 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": false,
        "created_at": "Fri, 05 Apr 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Fri, 05 Apr 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Sat, 06 Apr 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Sat, 06 Apr 2024 08:42:41 GMT",
        "user_id": "868569208"
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": false,
        "created_at": "Sun, 07 Apr 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Sun, 07 Apr 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": false,
        "created_at": "Thu, 11 Apr 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Thu, 11 Apr 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Fri, 12 Apr 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Fri, 12 Apr 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": false,
        "created_at": "Sat, 13 Apr 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Sat, 13 Apr 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Sun, 14 Apr 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Sun, 14 Apr 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": false,
        "created_at": "Mon, 15 Apr 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Mon, 15 Apr 2024 08:42:41 GMT",
        "user_id": "868569208"
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Tue, 16 Apr 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Tue, 16 Apr 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": false,
        "created_at": "Wed, 17 Apr 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Wed, 17 Apr 2024 08:42:41 GMT",
        "user_id": "868569208",
      },
      {
        "chat_language": "english",
        "chat_product": "savings_account",
        "chat_status": "ACTIVE",
        "company": "insait",
        "conversation_id": "99880249",
        "bot_success": true,
        "created_at": "Thu, 18 Apr 2024 08:42:41 GMT",
        "current_git_sha": "0a94f29e9dde85b01d37fe818ff3818273f0aed1",
        "history": "",
        "messages": [],
        "total_completion_tokens_used": 0,
        "total_prompt_tokens_used": 0,
        "updated_at": "Thu, 18 Apr 2024 08:42:41 GMT",
        "user_id": "868569208",
      },

]

export interface UserType {
    data: {
        [key: string]: any;
    };
    user_found: boolean;
}

export const ABUsers: UserType[] = [
        {
          "data": {
            "chatbot_visible_to_user": true,
            "user_id": "868569208",
            "signed_up": true,
            "session_date": "Sun, 24 Mar 2024 16:49:14 GMT"
          },
          "user_found": true
        },
        {
          "data": {
            "chatbot_visible_to_user": true,
            "user_id": "868569208",
            "signed_up": false,
            "session_date": "Fri, 22 Mar 2024 08:39:13 GMT"
          },
          "user_found": true
        },
        {
          "data": {
            "chatbot_visible_to_user": true,
            "user_id": "868569208",
            "signed_up": true,
            "session_date": "Tue, 19 Mar 2024 03:27:48 GMT"
          },
          "user_found": true
        },
        {
          "data": {
            "chatbot_visible_to_user": true,
            "user_id": "868569208",
            "signed_up": true,
            "session_date": "Thu, 21 Mar 2024 04:24:21 GMT"
          },
          "user_found": true
        },
        {
          "data": {
            "chatbot_visible_to_user": true,
            "user_id": "868569208",
            "signed_up": false,
            "session_date": "Wed, 20 Mar 2024 09:07:45 GMT"
          },
          "user_found": true
        },
        {
          "data": {
            "chatbot_visible_to_user": true,
            "user_id": "868569208",
            "signed_up": true,
            "session_date": "Sun, 24 Mar 2024 21:43:58 GMT"
          },
          "user_found": true
        },
        {
          "data": {
            "chatbot_visible_to_user": true,
            "user_id": "868569208",
            "signed_up": false,
            "session_date": "Tue, 19 Mar 2024 07:50:00 GMT"
          },
          "user_found": true
        },
        {
          "data": {
            "chatbot_visible_to_user": true,
            "user_id": "868569208",
            "signed_up": false,
            "session_date": "Fri, 22 Mar 2024 09:33:57 GMT"
          },
          "user_found": true
        },
        {
          "data": {
            "chatbot_visible_to_user": true,
            "user_id": "868569208",
            "signed_up": true,
            "session_date": "Thu, 21 Mar 2024 09:54:37 GMT"
          },
          "user_found": true
        },
        {
          "data": {
            "chatbot_visible_to_user": true,
            "user_id": "868569208",
            "signed_up": false,
            "session_date": "Wed, 20 Mar 2024 01:36:14 GMT"
          },
          "user_found": true
        },
        {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Mon, 4 Mar 2024 01:36:14 GMT"
            },
            "user_found": true
        },
        {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Tues, 5 Mar 2024 01:36:14 GMT"
            },
            "user_found": true
        },
        {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Mon, 25 Mar 2024 01:36:14 GMT"
            },
            "user_found": true
        },
        {
            "data": {},
            "user_found": false
        },
        {
            "data": {},
            "user_found": false
        },
        {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Sun, 24 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Mon, 18 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Tue, 19 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Wed, 20 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Thu, 21 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Fri, 22 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Sat, 23 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Sun, 24 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Mon, 25 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Tue, 19 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Wed, 20 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Thu, 21 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Fri, 29 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Sat, 30 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Sun, 31 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Mon, 01 Apr 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Tue, 02 Apr 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Wed, 03 Apr 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Thu, 04 Apr 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Sun, 24 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Mon, 18 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Tue, 19 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Wed, 20 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Thu, 21 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Fri, 22 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Sat, 23 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Sun, 24 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Mon, 25 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Tue, 19 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Wed, 20 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Thu, 21 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Fri, 29 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Sat, 30 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Sun, 31 Mar 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Mon, 01 Apr 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Tue, 02 Apr 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Wed, 03 Apr 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Thu, 04 Apr 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Fri, 05 Apr 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": false,
              "session_date": "Sat, 06 Apr 2024 16:49:14 GMT"
            },
            "user_found": true
          },
          {
            "data": {
              "chatbot_visible_to_user": true,
              "user_id": "868569208",
              "signed_up": true,
              "session_date": "Sun, 07 Apr 2024 16:49:14 GMT"
            },
            "user_found": true
          },

];

export const generateFormDataSample = (botSuccess: boolean) => {
    if (Math.random() > 0.9 && !botSuccess) {
        return null
    };
    const randomName = faker.person.firstName().toLowerCase();
    const randomSentence = faker.lorem.sentence();
    const randomJob = faker.person.jobTitle();
    const randomCountry = faker.location.country();
    const randomGender = faker.person.gender();
    const randomPhone = faker.phone.number();
    const output = {
        "name": randomName,
        "email": `${randomName}@outlook.com`,
        "job_description": randomSentence,
        "job_title": randomJob,
        "phone": randomPhone,
        "pictures": [],
        "sub_category_id": "1234",
        "country": randomCountry,
        "gender": randomGender
    };
    return JSON.stringify(output);
}

export const mimeTypeTextSize = 30 * 1024 * 1024; // Limit text file size to 30MB
export const mimeTypeMediaSize = 50 * 1024 * 1024;
export const mimeTypeAvatarSize = 3 * 1024 * 1024;

export const requestHostnameWhitelist = [
    "host.docker.internal",
    "admin-backend",
    "test-company.insait.com",
    "test-delete.insait.com",
    "localhost"
];

const windowMs: number = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;

export const RATE_LIMIT: {windowMs: number, max: number, message: string} = {
    windowMs,
    max: Number(process.env.MAX_RATE_LIMIT) || 100,
    message: `Too many requests from this IP, please try again in ${Number(windowMs) / 60 / 1000} minutes`
};

export const requiredLoginParams: Record<LoginProviderOptionType, string[]> = {
    'google': ['clientId', 'hostedDomain', 'realm', 'keycloakUrl'],
    'microsoft': ['clientId', 'tenantId', 'realm', 'keycloakUrl'],
    'other': ['realm']
};

export const baseUrlPrefix = constants.STAND_ALONE === '1' ? '/admin/api' : '';