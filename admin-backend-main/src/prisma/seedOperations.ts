import { faker } from '@faker-js/faker';
import constants, { generateFormDataSample } from '../constants';
import { prisma } from '../libs/prisma';
import { randomUUID } from 'crypto';
import { AdminConversationType, TicketPriority, TicketStatus } from '../types/interfaces';
import logger from '../libs/pino';

export const clearOldData = async () => {
  await prisma.messageLog.deleteMany();
  await prisma.conversationStep.deleteMany();
  await prisma.clientSession.deleteMany();
  await prisma.unansweredQuestion.deleteMany();
  await prisma.interaction.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
}

export const populateProducts = async () => {
    try {
      const productCount = (await prisma.product.findMany()).length;
      if (productCount === 0) {
        const products = await prisma.product.createMany({
          data: [
            {
              id: "0001",
              name: "CDs",
              available: true
            },
            {
              id: "0002",
              name: "mortgages",
              available: true
            },
            {
              id: "0003",
              name: "loans",
              available: true
            },
            {
              id: "0004",
              name: "credit card",
              available: true
            },
            {
              id: "0005",
              name: "Fds",
              available: true
            },
            {
              id: "0006",
              name: "bonds",
              available: true
            },
            {
              id: "0007",
              name: "forex cash",
              available: true
            },
          ],
        });
        return products
      }
    } catch (error) {
    }
  };

export const populateCustomers = async (customerCount: number) => {
  const personas = ["quizzer", "decider", "techie", "explorer", "achiever", "chatter"];
  for (let customerIndex = 0; customerIndex < customerCount; customerIndex++) {
    const randomPersona = personas[Math.floor(Math.random() * personas.length)];
    const firstName = Math.random() < .1 ? null : faker.person.firstName().toLowerCase();
    const lastName = Math.random() < .1 ? null : faker.person.lastName().toLowerCase();
    const createdAt = faker.date.recent({ days: 90 });
    const mediaOptions = ['DESKTOP', 'MOBILE', 'TABLET', 'UNKNOWN', null];

    await prisma.user.create({
        data: {
          userId: customerIndex.toString(),
          firstName,
          lastName,
          personaClassification: randomPersona,
          createdAt,
          userAgent: mediaOptions[Math.floor(Math.random() * mediaOptions.length)],
        }
      });
  };
};


export const populateInteractions = async (interactionCount: number, percentOfConversationsEnded: number) => {
  const today = new Date();
  const oneYearAgo: Date = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - constants.SEEDING_PARAMS_OBJECT.yearsBack);
  const yesterday: Date = new Date();
  yesterday.setDate(today.getDate() - 1);
  const earliest = oneYearAgo;
  const latest = new Date();
  latest.setDate(today.getDate() + 7);

  for (let index = 0; index < interactionCount; index++) {
    logger.info(`Creating interaction ${index}`);
    const randomTimestamp = earliest.getTime() + Math.random() * (latest.getTime() - earliest.getTime());
    const startedTime = new Date(randomTimestamp);
    const hour = Math.floor(Math.random() * 24 + Math.random() * 24) / 2;
    startedTime.setHours(hour);

    let endTime = null;
    if (Math.random() * 100 < percentOfConversationsEnded) {
      const duration = Math.ceil(Math.random() * constants.SEEDING_PARAMS_OBJECT.maxInteractionDurationMinutes);
      endTime = new Date(startedTime.getTime() + duration * 60000);
    }

    const avgResponseTimePerQuery = Math.random() * 10000;

    const endStatusOptions = ['completion', 'customerService', 'dropOff'];
    const endStatusChoice = endStatusOptions[Math.floor(Math.random() * endStatusOptions.length)];
    const endStatus = endStatusChoice;

    const positivenessScore = Math.ceil(Math.random() * 100);
    const complexityScore = Math.ceil(Math.random() * 100);
    const customerIdResults = await prisma.user.findMany({
      select: {
        userId: true
      }
    });
    const customerId = customerIdResults[Math.floor(Math.random() * customerIdResults.length)].userId;

    const productIdResults = await prisma.product.findMany({
      select: {
        id: true
      }
    });
    const productId = productIdResults[Math.floor(Math.random() * productIdResults.length)].id.toString();

    const speed = Math.round(Math.random() * constants.SEEDING_PARAMS_OBJECT.averageSpeed);

    let randomChatLength = Math.floor(Math.random() * (constants.SEEDING_PARAMS_OBJECT.maxChatLength - 1));

    if (randomChatLength % 2 !== 0) {
      randomChatLength += 1;
    }

    const messagesData = [];
    for (let i = 0; i < randomChatLength; i++) {
      messagesData.push({
        id: randomUUID(),
        pov: i % 2 === 0 ? "bot" : "user",
        file: null,
        text: faker.lorem.sentence(),
        time: new Date(startedTime.getTime() + i * 60000).toUTCString(),
        rating: i % 2 === 0 ? Math.random() < .05 ? 'positive' : Math.random() < .05 ? 'negative' : null : null, 
        response_time: Math.random() * 10,
      })
    };
    const queryKnowledgebase = Math.floor(Math.random() * 3);
    const securityViolations = Math.floor(Math.random() * 3);
    const userRating = Math.random() < 0.2 ? null : Math.ceil(Math.random() * 5);
    const userFeedback = Math.random() < 0.2 ? null : faker.lorem.sentence();  
    const botSuccess = Math.random() > 0.5;  
    const dataObject = generateFormDataSample(botSuccess);
    const history = JSON.stringify(messagesData);
    const sentimentOptions = ['positive', 'negative', 'neutral'];
    const sentiment = sentimentOptions[Math.floor(Math.random() * sentimentOptions.length)];
    const personaOptions = ['inquirer', 'applicant', null];
    const persona = personaOptions[Math.floor(Math.random() * personaOptions.length)];
    const nodeOptions = Array.from({ length: 10 }, (_, i) => `node_number_${i + 1}`);
    const nodes = nodeOptions.filter(node => node !== 'node4').sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 1);
    await prisma.interaction.create({
      data: {
        conversationId: index.toString(),
        userId: customerId,
        productId,
        startedTime,
        endTime: endTime,
        avgResponseTimePerQuery,
        endStatus,
        positivenessScore,
        complexityScore,
        speed,
        messages: messagesData,
        comment: "",
        totalPromptTokensUsed: Math.random() * constants.SEEDING_PARAMS_OBJECT.maxTokenUsage,
        totalCompletionTokensUsed: Math.random() * constants.SEEDING_PARAMS_OBJECT.maxTokenUsage,
        queryKnowledgebase,
        securityViolations,
        messageCount: messagesData.length,
        userRating,
        userFeedback,
        botSuccess,
        dataObject,
        history,
        sentiment,
        persona,
        nodes,
      }
    });
  }
};

export const populateUnansweredQs = async (unansweredQsCount: number) => {
  const allInteractionIds = (await prisma.interaction.findMany()).map(
    (interaction: AdminConversationType) => interaction.conversationId
  )
  const generateRandomInteractionId = () => allInteractionIds[Math.floor(Math.random() * allInteractionIds.length)]
  const fakeUnansweredQs = Array.from({ length: unansweredQsCount }, (_, i) => ({
    unansweredQId: randomUUID(),
    conversationId: generateRandomInteractionId(),
    question: faker.lorem.sentence(),
    answer: faker.lorem.sentence(),
    reason: faker.lorem.sentence(),
    createdAt: new Date((new Date()).getTime() - ((Math.floor(Math.random() * 7) * 24 * 60 * 60 + Math.floor(Math.random() * 86400)) * 1000)).toISOString(),
    archive: false
  }))

  await prisma.unansweredQuestion.createMany({
    data: fakeUnansweredQs
  })
}

export const populateSupportTickets = async (ticketCount: number) => {
  const fakeSupportTickets = Array.from({ length: ticketCount }, () => ({
    subject: faker.lorem.sentence(),
    sender: faker.person.fullName(),
    companyName: faker.company.name(),
    message: faker.lorem.paragraph(),
    chatURL: `http://localhost:5173/chats?page=1&conversationId=${Math.floor(Math.random() * constants.SEEDING_PARAMS_OBJECT.interactionCount)}`,
    ticketURL: faker.internet.url(),
    priority: faker.helpers.arrayElement(Object.values(TicketPriority)),
    status: faker.helpers.arrayElement(Object.values(TicketStatus)),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }));

  await prisma.support.createMany({
    data: fakeSupportTickets
  })
};

export const populateKbDocuments = async (kbDocumentCount: number) => {
  const newCrawlingJob = await prisma.crawlingJob.create({
    data: {
      id: randomUUID(),
      tenant: "example-tenant",
      url: "https://example.com",
      progress: 0,
      status: "COMPLETED",
    },
  });

  const fakeKbDocuments = Array.from({ length: kbDocumentCount }, () => {
    const fakeName = faker.lorem.word();
    const hash = faker.string.alphanumeric(64);
    return {
      id: randomUUID(),
      name: `${fakeName}.txt`,
      key: `test-company/raw-knowledge-files/43cf56ca-8de9-4d9f-b754-65d4093068b2-${fakeName}.txt`,
      size: Math.floor(Math.random() * 1000),
      hash,
    };
  });

  const fakeDocumentForTest = {
    id: "123",
    name: "fake-document.txt",
    key: `test-company/raw-knowledge-files/43cf56ca-8de9-4d9f-b754-65d4093068b2-fake-document.txt`,
    size: Math.floor(Math.random() * 1000),
    hash: faker.string.alphanumeric(64),
  };

  const fakeScrapingResults = Array.from({ length: kbDocumentCount }, () => {
    const fakeCompanyName = faker.lorem.word();
    const fakePath = faker.lorem.word();
    const fakeKbDocument = `${fakeCompanyName}-${fakePath}`.replace(/^-+|-+$/g, "");
    const fakeWordsCount = Math.floor(Math.random() * 1000);
    const hash = faker.string.alphanumeric(64);
    return {
      id: randomUUID(), 
      name: `${fakeKbDocument}.md`,
      key: `test-company/raw-knowledge-files/43cf56ca-8de9-4d9f-b754-65d4093068b2-${fakeCompanyName}.md`,
      size: Math.floor(Math.random() * 1000),
      hash,
      type: "link",
      url: `https://example.com`,
      pagePath: `/${fakePath}`,
      pageTitle: fakePath,
      pageDescription: `Description for ${fakePath}`,
      published: true,
      words: fakeWordsCount,
      crawlingJobId: newCrawlingJob.id,
    };
  });

  await prisma.documentKnowledge.createMany({
    data: [...fakeKbDocuments, fakeDocumentForTest, ...fakeScrapingResults],
    skipDuplicates: true, 
  });
};


export const populateKnowledgeQestionsAndAnswers = async (knowledgeCount: number) => {
  const fakeKnowledgeEntries = Array.from({ length: knowledgeCount }, () => ({
    id: randomUUID(),
    question: faker.lorem.sentence(),
    answer: faker.lorem.paragraph(),
    url: faker.internet.url(),
    createdAt: new Date().toISOString(),
    product: faker.helpers.arrayElement([
      "CDs",
      "mortgages",
      "loans",
      "credit card",
      "Fds",
      "bonds",
      "forex cash",
    ]),
    active: faker.datatype.boolean(),
  }));

  await prisma.knowledge.createMany({
    data: fakeKnowledgeEntries,
  });
};

export const populateQuestionsAndClusters = async (clusterCount: number = 5, questionsPerCluster: number = 3) => {
  try {
    // Clear existing data
    await prisma.question.deleteMany();
    await prisma.cluster.deleteMany();

    // Create clusters
    for (let i = 0; i < clusterCount; i++) {
      const representativeQuestion = faker.lorem.sentence() + "?";
      
      const cluster = await prisma.cluster.create({
        data: {
          representativeQuestion
        }
      });

      // Create questions for each cluster
      for (let j = 0; j < questionsPerCluster; j++) {
        // Get a random interaction to link with the question
        const interaction = await prisma.interaction.findFirst({
          select: { conversationId: true },
          skip: Math.floor(Math.random() * await prisma.interaction.count()),
        });

        await prisma.question.create({
          data: {
            question: faker.lorem.sentence() + "?",
            clusterId: cluster.id,
            conversationId: interaction?.conversationId
          }
        });
      }
    }

    logger.info(`Created ${clusterCount} clusters with ${questionsPerCluster} questions each`);
  } catch (error) {
    logger.error('Error seeding questions and clusters:', error);
    throw error;
  }
};

export const seedQuestions = async () => {
  const { clusterCount, questionsPerCluster } = constants.SEEDING_PARAMS_OBJECT;
  
  for (let i = 0; i < clusterCount; i++) {
    const cluster = await prisma.cluster.create({
      data: {
        representativeQuestion: `Representative question ${i + 1}`
      }
    });

    for (let j = 0; j < questionsPerCluster; j++) {
      await prisma.question.create({
        data: {
          clusterId: cluster.id,
          question: `Question ${j + 1} for cluster ${i + 1}`,
          conversationId: null
        }
      });
    }
  }
};

export const populateFlows = async () => {
  const flowNames = ["Onboarding", "Support", "Feedback", "Sales", "Retention"];

  for (const flowName of flowNames) {
    const flow = await prisma.flow.create({
      data: {
        id: randomUUID(),
        name: flowName,
      },
    });

    const interactions = await prisma.interaction.findMany({
      take: Math.floor(Math.random() * 50) + 1,
    });

    for (const interaction of interactions) {
      await prisma.interaction.update({
        where: { conversationId: interaction.conversationId },
        data: { flowId: flow.id },
      });
    }
  }
};

export const populateClientSessions = async (sessionCount: number = 100) => {
  try {
    const users = await prisma.user.findMany();
    const sessionStatuses = ['ACTIVE', 'COMPLETED', 'ABANDONED', 'ERROR'];
    
    for (let i = 0; i < sessionCount; i++) {
      const user = faker.helpers.arrayElement(users) as { userId: string };
      const startTime = faker.date.recent({ days: 30 });
      const sessionDuration = faker.number.int({ min: 30, max: 3600 }); // 30 seconds to 1 hour
      const totalSteps = faker.number.int({ min: 1, max: 15 });
      const completedSteps = faker.number.int({ min: 0, max: totalSteps });
      const status = faker.helpers.arrayElement(sessionStatuses);
      
      const endTime = status === 'ACTIVE' ? null : 
        new Date(startTime.getTime() + sessionDuration * 1000);
      
      await prisma.clientSession.create({
        data: {
          userId: user.userId,
          startTime,
          endTime,
          totalSteps,
          completedSteps,
          dropOffStep: status === 'ABANDONED' ? faker.number.int({ min: 1, max: totalSteps }) : null,
          sessionDuration: status !== 'ACTIVE' ? sessionDuration : null,
          status: status as any,
          userAgent: faker.internet.userAgent(),
          ipAddress: faker.internet.ip(),
        },
      });
    }
    
    logger.info(`Created ${sessionCount} client sessions`);
  } catch (error) {
    logger.error('Error populating client sessions:', error);
  }
};

export const populateConversationSteps = async () => {
  try {
    const sessions = await prisma.clientSession.findMany();
    const stepTypes = ['MESSAGE', 'INPUT', 'CHOICE', 'API_CALL', 'VALIDATION', 'REDIRECT'];
    const stepNames = [
      'Welcome Message', 'User Input', 'Menu Selection', 'Product Inquiry',
      'Form Validation', 'Payment Process', 'Confirmation', 'Redirect to Agent',
      'FAQ Lookup', 'User Authentication', 'Data Collection', 'Summary'
    ];
    
    for (const session of sessions) {
      for (let stepNum = 1; stepNum <= session.totalSteps; stepNum++) {
        const entryTime = new Date(session.startTime.getTime() + (stepNum - 1) * 30000); // 30 seconds between steps
        const duration = faker.number.int({ min: 1000, max: 60000 }); // 1-60 seconds
        const exitTime = stepNum <= session.completedSteps ? 
          new Date(entryTime.getTime() + duration) : null;
        
        await prisma.conversationStep.create({
          data: {
            sessionId: session.sessionId,
            stepNumber: stepNum,
            stepType: faker.helpers.arrayElement(stepTypes) as any,
            stepName: faker.helpers.arrayElement(stepNames),
            entryTime,
            exitTime,
            duration: exitTime ? duration : null,
            userInput: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.7 }),
            botResponse: faker.helpers.maybe(() => faker.lorem.sentences(2), { probability: 0.8 }),
            wasSuccessful: stepNum <= session.completedSteps,
            errorMessage: (stepNum > session.completedSteps && faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 })) || null,
          },
        });
      }
    }
    
    logger.info('Created conversation steps for all sessions');
  } catch (error) {
    logger.error('Error populating conversation steps:', error);
  }
};

export const populateMessageLogs = async () => {
  try {
    const sessions = await prisma.clientSession.findMany({
      include: { conversationSteps: true }
    });
    
    const messageTypes = ['TEXT', 'IMAGE', 'FILE', 'BUTTON_CLICK', 'FORM_SUBMIT', 'ERROR'];
    const senders = ['USER', 'BOT', 'SYSTEM'];
    const sentiments = ['positive', 'negative', 'neutral'];
    
    for (const session of sessions) {
      // Generate messages for each step
      for (const step of session.conversationSteps) {
        const messageCount = faker.number.int({ min: 1, max: 5 });
        
        for (let i = 0; i < messageCount; i++) {
          const sender = faker.helpers.arrayElement(senders);
          const messageType = faker.helpers.arrayElement(messageTypes);
          const timestamp = new Date(step.entryTime.getTime() + i * 5000); // 5 seconds between messages
          
          await prisma.messageLog.create({
            data: {
              sessionId: session.sessionId,
              stepId: step.stepId,
              messageType: messageType as any,
              sender: sender as any,
              content: sender === 'USER' ? faker.lorem.sentence() : faker.lorem.sentences(2),
              metadata: {
                channel: faker.helpers.arrayElement(['web', 'mobile', 'api']),
                device: faker.helpers.arrayElement(['desktop', 'mobile', 'tablet']),
                location: faker.location.country(),
              },
              timestamp,
              responseTime: sender === 'BOT' ? faker.number.int({ min: 500, max: 5000 }) : null,
              tokenCount: faker.number.int({ min: 10, max: 200 }),
              sentiment: faker.helpers.arrayElement(sentiments),
              processed: faker.datatype.boolean({ probability: 0.9 }),
            },
          });
        }
      }
    }
    
    logger.info('Created message logs for all sessions');
  } catch (error) {
    logger.error('Error populating message logs:', error);
  }
};
