import { Router } from 'express';
import {
  getClusters,
  createCluster,
  updateClusterHandler,
  deleteClusterHandler,
  addQuestionHandler,
  updateQuestionHandler,
  deleteQuestionHandler,
  getQuestions
} from '../controllers/questionsController';

const router = Router();

// Cluster routes
router.get('/clusters', getClusters);
router.post('/clusters', createCluster);
router.put('/clusters/:id', updateClusterHandler);
router.delete('/clusters/:id', deleteClusterHandler);

// Question routes
router.get('/questions', getQuestions);
router.post('/questions', addQuestionHandler);
router.put('/questions/:id', updateQuestionHandler);
router.delete('/questions/:id', deleteQuestionHandler);

export default router; 