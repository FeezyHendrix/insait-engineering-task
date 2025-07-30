import { PrismaClient } from '@prisma/client';
import logger from '../libs/pino';
import { QuestionType, ClusterType } from '../types/interfaces';

const prisma = new PrismaClient();

export const addCluster = async (representativeQuestion: string): Promise<ClusterType> => {
  return prisma.cluster.create({
    data: {
      representativeQuestion
    },
    include: {
      questions: true
    }
  });
};

export const updateCluster = async (
  id: string,
  representativeQuestion: string
): Promise<ClusterType> => {
  return prisma.cluster.update({
    where: { id },
    data: {
      representativeQuestion
    },
    include: {
      questions: true
    }
  });
};

export const deleteCluster = async (id: string): Promise<void> => {
  await prisma.cluster.delete({
    where: { id }
  });
};

export const addQuestion = async (
  clusterId: string,
  question: string,
  conversationId?: string
): Promise<QuestionType> => {
  return prisma.question.create({
    data: {
      clusterId,
      question,
      conversationId
    },
    include: {
      cluster: true,
      interaction: {
        select: {
          conversationId: true,
          startedTime: true,
          endTime: true,
          messages: true,
          userFeedback: true,
          userRating: true,
          sentiment: true,
          messageCount: true
        }
      }
    }
  });
};

export const updateQuestion = async (
  id: string,
  data: {
    question?: string;
    clusterId?: string;
    conversationId?: string;
  }
): Promise<QuestionType> => {
  return prisma.question.update({
    where: { id },
    data,
    include: {
      cluster: true,
      interaction: {
        select: {
          conversationId: true,
          startedTime: true,
          endTime: true,
          messages: true,
          userFeedback: true,
          userRating: true,
          sentiment: true,
          messageCount: true
        }
      }
    }
  });
};

export const deleteQuestion = async (id: string): Promise<void> => {
  await prisma.question.delete({
    where: { id }
  });
};

export const fetchQuestions = async (params?: {
  id?: string;
  clusterId?: string;
  conversationId?: string;
}): Promise<QuestionType[]> => {
  const where = {
    ...(params?.id && { id: params.id }),
    ...(params?.clusterId && { clusterId: params.clusterId }),
    ...(params?.conversationId && { conversationId: params.conversationId })
  };

  return prisma.question.findMany({
    where,
    include: {
      cluster: true,
      interaction: {
        select: {
          conversationId: true,
          startedTime: true,
          endTime: true,
          messages: true,
          userFeedback: true,
          userRating: true,
          sentiment: true,
          messageCount: true
        }
      }
    }
  });
};

export const fetchClusters = async (params?: {
  id?: string;
}): Promise<ClusterType[]> => {
  const where = {
    ...(params?.id && { id: params.id })
  };

  return prisma.cluster.findMany({
    where,
    include: {
      questions: true
    }
  });
}; 