import { Request, Response } from 'express';
import {
  addCluster,
  updateCluster,
  deleteCluster,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  fetchQuestions,
  fetchClusters
} from '../models/questionsModel';

export const getClusters = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const clusters = await fetchClusters({
      id: id as string
    });

    if (id && clusters.length === 0) {
      return res.status(404).json({ error: 'Cluster not found' });
    }

    res.status(200).json(clusters);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCluster = async (req: Request, res: Response) => {
  try {
    const { representativeQuestion } = req.body;
    if (!representativeQuestion) {
      return res.status(400).json({ error: 'Representative question is required' });
    }
    const cluster = await addCluster(representativeQuestion);
    res.status(201).json(cluster);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateClusterHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { representativeQuestion } = req.body;
    if (!representativeQuestion) {
      return res.status(400).json({ error: 'Representative question is required' });
    }
    const updatedCluster = await updateCluster(id, representativeQuestion);
    res.status(200).json(updatedCluster);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteClusterHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteCluster(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addQuestionHandler = async (req: Request, res: Response) => {
  try {
    const { clusterId, question, conversationId } = req.body;
    if (!clusterId || !question) {
      return res.status(400).json({ error: 'Cluster ID and question are required' });
    }
    const newQuestion = await addQuestion(clusterId, question, conversationId);
    res.status(201).json(newQuestion);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ 
        error: 'This question already exists for this conversation',
        details: 'Duplicate question and conversationId combination'
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateQuestionHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, clusterId, conversationId } = req.body;
    
    const updateData = {
      ...(question && { question }),
      ...(clusterId && { clusterId }),
      ...(conversationId && { conversationId })
    };

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'At least one field to update is required' });
    }

    const updatedQuestion = await updateQuestion(id, updateData);
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteQuestionHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteQuestion(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { id, clusterId, conversationId } = req.query;
    const questions = await fetchQuestions({
      id: id as string,
      clusterId: clusterId as string,
      conversationId: conversationId as string
    });

    if (id && questions.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}; 