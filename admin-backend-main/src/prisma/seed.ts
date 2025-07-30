import { ISeedingParams } from "../types/interfaces";
import constants from "../constants";
const { SEEDING_PARAMS_OBJECT } = constants;

import {
  populateProducts,
  populateCustomers,
  populateInteractions,
  clearOldData,
  populateUnansweredQs,
  populateSupportTickets,
  populateKbDocuments,
  populateKnowledgeQestionsAndAnswers,
  populateQuestionsAndClusters,
  populateFlows,
  populateClientSessions,
  populateConversationSteps,
  populateMessageLogs
} from "./seedOperations";
import { prisma } from "../libs/prisma";

const seed = async (seedingObj: ISeedingParams) => {
  await clearOldData();
  await populateProducts();
  await populateCustomers(seedingObj.customerCount);
  await populateInteractions(seedingObj.interactionCount, seedingObj.percentOfConversationsEnded);
  await populateUnansweredQs(seedingObj.unansweredQsCount);
  await populateSupportTickets(seedingObj.ticketCount);
  await populateKbDocuments(seedingObj.kbDocumentCount);
  await populateKnowledgeQestionsAndAnswers(seedingObj.kbDocumentCount);
  await populateQuestionsAndClusters(seedingObj.clusterCount, seedingObj.questionsPerCluster);
  await populateFlows();
  
  // Populate new analytics tables
  await populateClientSessions(50);
  await populateConversationSteps();
  await populateMessageLogs();
  
  return true;
};

seed(SEEDING_PARAMS_OBJECT)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
