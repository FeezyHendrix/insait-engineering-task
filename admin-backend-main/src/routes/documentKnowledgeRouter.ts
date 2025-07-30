import { Router } from 'express';
import {
  createDocumentKnowledge,
  deleteDocumentKnowledge,
  getDocumentKnowledge,
  listDocumentKnowledge,
  updateDocumentStatus,
  reviewDocument,
  fetchFileBuffer,
  startCrawling,
  findActiveCrawlingJob,
  fetchCrawlStatus,
  updateCrawlStatus,
  appendPageToKnowledgeBase,
  updateScrapingDocumentStatus,
  appendSinglePage,
  updateDocumentHint,
  findCrawlHistory,
  fetchHistoricalJob
} from '../controllers/documentKnowledgeController';
import {allowedMimeTypeText, uploadFile } from '../middlewares/FileMulter';
import { mimeTypeTextSize } from '../constants';
import { getCombinedKnowledgePages } from '../controllers/combinedKnowledgeController';

const documentKnowledgeRouter = Router();

documentKnowledgeRouter.post(
  '/upload',
  uploadFile(mimeTypeTextSize, allowedMimeTypeText, 'files', 50),
  createDocumentKnowledge
);


documentKnowledgeRouter.get('/crawl/active', findActiveCrawlingJob);
documentKnowledgeRouter.get('/crawl/status/:jobId', fetchCrawlStatus);
documentKnowledgeRouter.get('/crawl/history', findCrawlHistory);
documentKnowledgeRouter.get('/crawl/job/:jobId', fetchHistoricalJob);

documentKnowledgeRouter.get('/combined-knowledge', getCombinedKnowledgePages);
documentKnowledgeRouter.get('/fetch-file/:id', fetchFileBuffer);
documentKnowledgeRouter.get('/:id', getDocumentKnowledge);
documentKnowledgeRouter.get('/', listDocumentKnowledge);

documentKnowledgeRouter.put('/status/:id', updateDocumentStatus);
documentKnowledgeRouter.put('/review/:id', reviewDocument);

documentKnowledgeRouter.delete('/:id', deleteDocumentKnowledge);

documentKnowledgeRouter.post('/crawl', startCrawling);
documentKnowledgeRouter.post('/crawl/status/:jobId', updateCrawlStatus);
documentKnowledgeRouter.post('/crawl/append-url', appendPageToKnowledgeBase);
documentKnowledgeRouter.post('/scraping/:documentId', updateScrapingDocumentStatus);
documentKnowledgeRouter.post('/link',  appendSinglePage);
documentKnowledgeRouter.put('/hints/:id/:target', updateDocumentHint);

export default documentKnowledgeRouter;
