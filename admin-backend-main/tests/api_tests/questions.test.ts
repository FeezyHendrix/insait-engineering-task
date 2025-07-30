import { Request, Response } from 'express';
import {
  getClusters,
  createCluster,
  updateClusterHandler,
  deleteClusterHandler,
  addQuestionHandler,
  updateQuestionHandler,
  deleteQuestionHandler,
  getQuestions
} from '../../src/controllers/questionsController';
import { prisma } from '../../src/libs/prisma';
import { populateQuestionsAndClusters } from '../../src/prisma/seedOperations';

interface ClusterRequestBody {
  representativeQuestion?: string;
}

interface QuestionRequestBody {
  question?: string;
  clusterId?: string;
  conversationId?: string | null;
}

type RequestBody = ClusterRequestBody | QuestionRequestBody;
type QuestionRequestParams = Record<string, string>;

const mockRequest = (body: RequestBody = {}, params: QuestionRequestParams = {}) => ({
  body,
  params,
  query: params
} as Request);

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('Questions API', () => {
  beforeAll(async () => {
    // Seed the database before all tests
    await populateQuestionsAndClusters(2, 2); // Create 2 clusters with 2 questions each
  });

  afterAll(async () => {
    // Clean up after all tests
    await prisma.question.deleteMany();
    await prisma.cluster.deleteMany();
    await prisma.$disconnect();
  });

  describe('Clusters', () => {
    test('should get all clusters', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await getClusters(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseData).toHaveLength(2); // We seeded 2 clusters
      expect(responseData[0]).toHaveProperty('id');
      expect(responseData[0]).toHaveProperty('representativeQuestion');
    });

    test('should get cluster by id', async () => {
      // First, get a real cluster ID from the database
      const cluster = await prisma.cluster.findFirst();
      if (!cluster) {
        throw new Error('No cluster found for test');
      }
      const req = mockRequest({}, { id: cluster.id });
      const res = mockResponse();

      await getClusters(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseData).toHaveLength(1);
      expect(responseData[0].id).toBe(cluster.id);
    });

    test('should create cluster', async () => {
      const newQuestion = 'New test question';
      const req = mockRequest({ representativeQuestion: newQuestion });
      const res = mockResponse();

      await createCluster(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const responseData = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseData.representativeQuestion).toBe(newQuestion);
    });

    test('should update cluster', async () => {
      // First, get a real cluster ID from the database
      const cluster = await prisma.cluster.findFirst();
      if (!cluster) {
        throw new Error('No cluster found for test');
      }
      const updatedQuestion = 'Updated test question';
      const req = mockRequest({ representativeQuestion: updatedQuestion }, { id: cluster.id });
      const res = mockResponse();

      await updateClusterHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseData.representativeQuestion).toBe(updatedQuestion);
    });

    test('should delete cluster', async () => {
      // First, create a new cluster to delete
      const cluster = await prisma.cluster.create({
        data: { representativeQuestion: 'To be deleted' }
      });
      
      const req = mockRequest({}, { id: cluster.id });
      const res = mockResponse();

      await deleteClusterHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      
      // Verify cluster was actually deleted
      const deletedCluster = await prisma.cluster.findUnique({
        where: { id: cluster.id }
      });
      expect(deletedCluster).toBeNull();
    });
  });

  describe('Questions', () => {
    test('should get all questions', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await getQuestions(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseData.length).toBeGreaterThanOrEqual(4); // We seeded at least 4 questions (2 per cluster)
      expect(responseData[0]).toHaveProperty('id');
      expect(responseData[0]).toHaveProperty('question');
      expect(responseData[0]).toHaveProperty('clusterId');
    });

    test('should get questions by cluster id', async () => {
      // First, get a real cluster ID from the database
      const cluster = await prisma.cluster.findFirst();
      if (!cluster) {
        throw new Error('No cluster found for test');
      }
      const req = mockRequest({}, { clusterId: cluster.id });
      const res = mockResponse();

      await getQuestions(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseData.length).toBeGreaterThanOrEqual(2); // Each cluster has at least 2 questions
      expect(responseData.every((q: any) => q.clusterId === cluster.id)).toBe(true);
    });

    test('should add question with conversation id', async () => {
      // First, get a real cluster ID from the database
      const cluster = await prisma.cluster.findFirst();
      if (!cluster) {
        throw new Error('No cluster found for test');
      }
      const newQuestion = 'New test question';
      const req = mockRequest({ 
        question: newQuestion, 
        clusterId: cluster.id,
        conversationId: '123' // Test conversation ID
      });
      const res = mockResponse();

      await addQuestionHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const responseData = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseData.question).toBe(newQuestion);
      expect(responseData.clusterId).toBe(cluster.id);
      expect(responseData.conversationId).toBe('123');
    });

    test('should update question', async () => {
      // First, get a real question ID from the database
      const question = await prisma.question.findFirst();
      if (!question) {
        throw new Error('No question found for test');
      }
      const updatedQuestionText = 'Updated test question';
      const req = mockRequest({ 
        question: updatedQuestionText,
        conversationId: '456' // New conversation ID
      }, { id: question.id });
      const res = mockResponse();

      await updateQuestionHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const responseData = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseData.question).toBe(updatedQuestionText);
      expect(responseData.conversationId).toBe('456');
    });

    test('should delete question', async () => {
      // First, create a new question to delete
      const cluster = await prisma.cluster.findFirst();
      const question = await prisma.question.create({
        data: {
          question: 'To be deleted',
          clusterId: cluster!.id
        }
      });
      
      const req = mockRequest({}, { id: question.id });
      const res = mockResponse();

      await deleteQuestionHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      
      // Verify question was actually deleted
      const deletedQuestion = await prisma.question.findUnique({
        where: { id: question.id }
      });
      expect(deletedQuestion).toBeNull();
    });
  });
});