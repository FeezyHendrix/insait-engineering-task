import express from "express"
import { getTestScenarios, postTestRun, postTestScenario, getTestScenarioFullData, deleteTestScenario, getTestScenarioPages } from "../controllers/testScenarioController";
import rateLimit from "express-rate-limit";
import { RATE_LIMIT } from "../constants";

const testScenarioRouter = express.Router()
const postLimiter = rateLimit(RATE_LIMIT);

testScenarioRouter.get('/', getTestScenarios);
testScenarioRouter.get('/pages', getTestScenarioPages);
testScenarioRouter.get('/:testScenarioId', getTestScenarioFullData);
testScenarioRouter.delete('/:testScenarioId', deleteTestScenario);
testScenarioRouter.use(postLimiter);
testScenarioRouter.post('/', postTestScenario);
testScenarioRouter.post('/testRun', postTestRun);

export default testScenarioRouter