import { RequestHandler } from 'express';
import tryCatch from '../utils/tryCatch';
import logger from '../libs/pino';
import {
  createDocument,
  findDocumentById,
  deleteDocumentById,
  getPaginatedDocuments,
  getDocumentCount,
  findDocumentByHash,
  updateDocumentStatusInDb,
  updateDocumentReviewStatus,
  findCrawlingJobById,
  createCrawlingJob,
  updateCrawlingJobStatus,
  addDocumentsToCrawlingJob,
  getDocumentUrlsByIds,
  updateScrapingDocumentsStatus,
  getActiveCrawlingJob,
  getCrawlingJobHistory,
  updateDocument,
  createSingleLink
} from '../models/documentKnowledgeModel';
import { MulterFile } from '../types/interfaces';
import S3Client from '../services/S3Client';
import { calculateFileHash, decodeFileName } from '../utils/fileUtils';
import {
  NotFoundError,
  OperationalError,
  ValidationError,
} from '../utils/error';
import {
  runPrefectCreateDocumentFlow,
  runPrefectDeleteDocumentFlow,
  runPrefectURLDiscovery,
  runPrefectAppendURLs,
  getFlowIdByName,
  validateHintParams,
  runPrefectHintFlow,
  runPrefectDeleteLinkFlow,
  runPrefectAppendURL

} from '../services/prefectService';
import { validatePositiveInt } from '../utils/dateHelper';
import axiosInstance from '../utils/axiosInstance';
import { DocumentType } from '@prisma/client';

export const createDocumentKnowledge: RequestHandler = tryCatch(
  async (req, res) => {
    const files = req.files as MulterFile[];
    // Get four eyes setting from company config with default value false
    const fourEyesEnabled = res.locals.companyConfig?.four_eyes_enabled ?? false;

    if (!files || files.length === 0) {
      throw new ValidationError('No files uploaded');
    }

    const s3Client = S3Client.getInstance();
    const fileHashes = new Set<string>();
    const results = await Promise.allSettled(
      files.map(async (file) => {
        let s3Key: string | null = null;
        let documentId: string | null = null;
        let decodedName: string = decodeFileName(file.originalname);
        try {
          const fileHash = calculateFileHash(file.buffer);

          if (fileHashes.has(fileHash)) {
            logger.warn(`Duplicate file detected in request: ${decodedName}`);
            return {
              success: false,
              fileName: decodedName,
              error: 'This document already exists in this batch',
            };
          }
          fileHashes.add(fileHash);

          const existingDocument = await findDocumentByHash(fileHash);
          if (existingDocument) {
            logger.warn(`Duplicate file detected: ${decodedName}`);
            return {
              success: false,
              fileName: decodedName,
              error: 'This document already exists',
            };
          }
          const company = res.locals.companyConfig.company;
          s3Key = await s3Client.uploadFile(file, company);
          if (!s3Key)
            throw new OperationalError('File upload failed', new Error());

          // Create document with review status based on four eyes setting
          const document = await createDocument({
            name: decodedName,
            key: s3Key,
            size: file.size,
            hash: fileHash,
            reviewStatus: fourEyesEnabled ? 'PENDING' : 'APPROVED'
          });
          
          documentId = document.id;
          if (!documentId) {
            throw new OperationalError('Document creation failed', new Error());
          }
          logger.info(`Document added to admin db: ${document.id}`);

          // Only proceed with Prefect flow if four eyes is disabled or document is approved
          if (!fourEyesEnabled) {
            await runPrefectCreateDocumentFlow(s3Key, documentId);
          } else {
            logger.info(`Document ${document.id} awaiting review approval`);
          }

          return {
            success: true,
            fileName: decodedName,
            status: fourEyesEnabled ? 'PENDING_REVIEW' : 'PROCESSING',
            documentId: document.id
          };
        } catch (error) {
          logger.error(
            `Error processing file ${decodedName}: ${(error as Error).message}`
          );
          if (s3Key) {
            try {
              await s3Client.deleteFile(s3Key);
              logger.info(`Rolled back: File deleted from S3: ${s3Key}`);
            } catch (rollbackError) {
              logger.error(
                `Failed to rollback S3 file deletion: ${rollbackError}`
              );
            }
          }
          if (documentId) {
            try {
              await deleteDocumentById(documentId);
              logger.info(
                `Rolled back: Document deleted from database: ${documentId}`
              );
            } catch (rollbackError) {
              logger.error(
                `Failed to rollback database deletion: ${rollbackError}`
              );
            }
          }
          return {
            success: false,
            fileName: decodedName,
            error: (error as Error).message,
          };
        }
      })
    );

    const formattedResults = results.map((result) =>
      result.status === 'fulfilled' ? result.value : result.reason
    );

    res.status(201).json({
      message: 'File processing completed',
      results: formattedResults,
    });
  }
);

export const deleteDocumentKnowledge: RequestHandler = tryCatch(
  async (req, res) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      throw new ValidationError('Invalid or missing document ID');
    }

    try {
      const document = await findDocumentById(id);
      if (!document) {
        logger.warn(`Document with ID ${id} not found`);
        throw new NotFoundError(`Document with ID ${id} not found`);
      }
      if (document.type === 'link') {
        logger.info(`Deleting link document: ${id}`);

        await runPrefectDeleteLinkFlow({id, key: document.key});
        await deleteDocumentById(id);
        logger.info(`Link document deleted successfully: ${id}`);
        return res.status(200).json({});
      }
      
      const s3Client = S3Client.getInstance();
      await s3Client.deleteFile(document.key);
      await deleteDocumentById(id);
      await runPrefectDeleteDocumentFlow(document.key);

      logger.info(
        `Document deleted successfully: ${id}, File Name: ${document.name}`
      );
      res.json({
        message: 'Document deleted successfully',
        fileName: document.name,
        id,
      });
    } catch (error) {
      throw new OperationalError(
        `Error deleting document (ID: ${id})`,
        error as Error
      );
    }
  }
);

export const getDocumentKnowledge: RequestHandler = tryCatch(
  async (req, res) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      throw new ValidationError('Invalid or missing document ID');
    }

    const document = await findDocumentById(id);
    if (!document) {
      logger.info(`No documents found `);
      return res.status(404).json({ message: `Document with ID ${id} not found` });
    }
    const s3Client = S3Client.getInstance();
    const presignedUrl = await s3Client.getSignedUrl(document.key);

    logger.info(`Presigned URL generated for document: ${id}`);
    res.json({ document, presignedUrl });
  }
);

export const listDocumentKnowledge: RequestHandler = tryCatch(
  async (req, res) => {
    const { page = '1', limit = '10', orderBy = 'createdAt', order = 'desc', reviewStatus, type } = req.query as {
      page: string;
      limit: string;
      orderBy: string;
      order: 'asc' | 'desc';
      reviewStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
      type?: string; 
    };

    const pageNumber = validatePositiveInt(page);
    const limitNumber = validatePositiveInt(limit);

    if (!pageNumber || !limitNumber) {
      throw new ValidationError(
        `pagination query params must be a positive integers`
      );
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [documents, total] = await Promise.all([
      getPaginatedDocuments({ skip, take: limitNumber, orderBy, order, reviewStatus, type: DocumentType[type as keyof typeof DocumentType] }),
      getDocumentCount(),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    res.json({
      data: documents,
      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalDocuments: total,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  }
);

const getFileUrlFromDocumentId = async (id: string) => {
  const document = await findDocumentById(id);
  if (!document) {
    logger.error(`Document with ID ${id} not found`);
    throw new NotFoundError(`Document with ID ${id} not found`);
  }
  const s3Client = S3Client.getInstance();
  const fileUrl = await s3Client.getSignedUrl(document.key);
  return fileUrl;
}

export const fetchFileBuffer: RequestHandler = tryCatch(async (req, res) => {

  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    throw new ValidationError('Invalid or missing document ID');
  }
  
  try {
    const fileUrl = await getFileUrlFromDocumentId(id)
    const response = await axiosInstance.get(fileUrl, { 
      responseType: 'arraybuffer' 
    });
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
  
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(response.data);
  } catch (error) {
    logger.error('Error fetching file:', error);
    res.status(500).send('Error fetching file');
  }
});

export const updateDocumentStatus: RequestHandler = tryCatch(async (req, res) => {
  const { id: documentId } = req.params;
  const { status, r2rDocumentId } = req.body;
  await updateDocumentStatusInDb(documentId, status, r2rDocumentId);
  return res.status(200).json({ documentId, status, r2rDocumentId });
});

export const reviewDocument: RequestHandler = tryCatch(
  async (req, res) => {
    const { id } = req.params;
    const { approved } = req.body;  // Expecting boolean value

    if (!id || typeof id !== 'string') {
      throw new ValidationError('Invalid or missing document ID');
    }

    if (typeof approved !== 'boolean') {
      throw new ValidationError('approved field must be a boolean value');
    }

    const document = await findDocumentById(id);
    if (!document) {
      throw new NotFoundError(`Document with ID ${id} not found`);
    }

    if (document.reviewStatus !== 'PENDING') {
      throw new ValidationError(`Document is not in PENDING state. Current state: ${document.reviewStatus}`);
    }

    const reviewStatus = approved ? 'APPROVED' : 'REJECTED';
    const updatedDocument = await updateDocumentReviewStatus(id, reviewStatus);

    if (approved) {
      await runPrefectCreateDocumentFlow(document.key, document.id);
      logger.info(`Prefect flow initiated for approved document: ${document.id}`);
    }

    res.json({
      message: approved ? 'Document approved successfully' : 'Document rejected',
      document: updatedDocument
    });
  }
);

export const startCrawling: RequestHandler = tryCatch(async (req, res) => {
  const { url } = req.body;
  const tenant = res.locals.companyConfig.company

  logger.info('Start crawling request received', { tenant, url });
  const crawlJobId = await createCrawlingJob({
    tenant,
    url,
    progress: 0,
    status: 'PENDING',
  });

  logger.info('Crawl job created', { crawlJobId, url: url });

  await runPrefectURLDiscovery(crawlJobId, url, tenant);

  logger.info('Prefect URL discovery initiated', { crawlJobId });
  return res.status(200).json({ message: 'Crawling started', crawlJobId });
});


export const fetchCrawlStatus: RequestHandler = tryCatch(async (req, res) => {
  const { jobId } = req.params;

  logger.info('Fetch crawl status request received', { jobId });

  if (!jobId) {
    logger.warn('Validation failed for fetch crawl status', { jobId });
    throw new ValidationError('Job ID is required');
  }


  const crawlStatus = await findCrawlingJobById(jobId, true);
  if (!crawlStatus) {
    logger.warn('Crawl job not found', { jobId });
    throw new NotFoundError(`Crawl job with ID ${jobId} not found`);
  }

  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  if (crawlStatus.createdAt < fifteenMinutesAgo && crawlStatus.status === 'PENDING') {
    logger.error('Crawl job is still pending after 15 minutes', { jobId });
    await updateCrawlingJobStatus(jobId, { status: 'ERROR', progress: 0 });
  }

  logger.info('Crawl status fetched successfully', { jobId, crawlStatus });
  return res.status(200).json(crawlStatus);
}
);

export const fetchHistoricalJob: RequestHandler = tryCatch(async (req, res) => {
  const { jobId } = req.params;

  logger.info('Fetch historical job request received', { jobId });

  const crawlStatus = await findCrawlingJobById(jobId, true, true);
  if (!crawlStatus) {
    logger.warn('Crawl job not found', { jobId });
    throw new NotFoundError(`Crawl job with ID ${jobId} not found`);
  }

  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  if (crawlStatus.createdAt < fifteenMinutesAgo && crawlStatus.status === 'PENDING') {
    logger.error('Crawl job is still pending after 15 minutes', { jobId });
    await updateCrawlingJobStatus(jobId, { status: 'ERROR', progress: 0 });
  }

  logger.info('Crawl status fetched successfully', { jobId, crawlStatus });
  return res.status(200).json(crawlStatus);
}
);

export const findActiveCrawlingJob: RequestHandler = tryCatch(async (req, res) => {
  logger.info('Find active crawling job request received');

  const activeCrawlJob = await getActiveCrawlingJob();

  if (!activeCrawlJob) {
    logger.info('No active crawl job found');
    return res.status(404).json({ message: 'No active crawl job found' });
  }

  logger.info('Active crawl job found', { activeCrawlJob });
  return res.status(200).json(activeCrawlJob);
}
);

export const findCrawlHistory: RequestHandler = tryCatch(async (req, res) => {
  logger.info('Find active crawling job request received');

  const activeCrawlJob = await getCrawlingJobHistory();

  if (!activeCrawlJob) {
    logger.info('No active crawl job found');
    return res.status(404).json({ message: 'No active crawl job found' });
  }

  logger.info('Active crawl job found', { activeCrawlJob });
  return res.status(200).json(activeCrawlJob);
}
);


export const updateCrawlStatus: RequestHandler = tryCatch(async (req, res) => {
  const { jobId } = req.params;
  const { name, url, path, pageTitle, pageDescription, words, progress, hash, username, key } = req.body;

  logger.info('Update crawl status request received', { jobId, progress });

  const crawlJob = await findCrawlingJobById(jobId);
  if (!crawlJob) {
    logger.warn('Crawl job not found', { jobId });
    throw new NotFoundError(`Crawl job with ID ${jobId} not found`);
  }

  if (progress === undefined || progress === null) {
    logger.warn('Validation failed for update crawl status', { progress });
    throw new ValidationError('Progress and username are required');
  }

  if (progress < 0) {
    await updateCrawlingJobStatus(jobId, { status: 'ERROR', progress: 0 });
    return res.status(200).json({ message: 'Crawl job marked as error' });
  }

  const status = progress <= 99 ? 'PENDING' : 'COMPLETED';
  await updateCrawlingJobStatus(jobId, { status, progress });

  logger.info('Crawl job status updated', { jobId, status, progress });

  if (status !== 'COMPLETED' && name && url && path && pageTitle && pageDescription && words) {
    await addDocumentsToCrawlingJob(jobId, [
      { name, url, type: 'link', path, pageTitle, pageDescription, words, hash, key },
    ]);
    logger.info('Documents added to crawl job', { jobId, documents: [{ name, url }] });
  }

  return res.status(200).json({ message: 'Crawl status updated' });

});



export const appendPageToKnowledgeBase: RequestHandler = tryCatch(async (req, res) => {
  const { data } = req.body;
const tenant = res.locals.companyConfig.company

  logger.info('Append page to knowledge base request received', { tenant, pageIds: data?.pageIds });

  const missingFields: string[] = [];
  if (!data?.pageIds) missingFields.push('pageIds');

  if (missingFields.length > 0) {
    logger.warn('Validation failed for append page to knowledge base', { missingFields });
    throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
  }

  const urls = await getDocumentUrlsByIds(data.pageIds);
  logger.info('URLs fetched for appending', { urls });

  updateScrapingDocumentsStatus(data.pageIds, 'SCRAPING');
  logger.info('Scraping status updated for documents', { pageIds: data.pageIds });

  // const formattedData = data.pageIds.map((documentId: string, index: number, url: string, pageTitle: string, pageDescription: string, key: string ) => ({
  //   documentId,
  //   url: url,
  //   pageTitle: pageTitle,
  //   pageDescription: pageDescription,
  //   key: key,
  // }));

  // const stringifiedData = formattedData.map((item: { documentId: string; url: string, pageTitle: string, pageDescription: string, key: string }) => JSON.stringify(item));
  await runPrefectAppendURLs(urls, tenant);

  logger.info('Prefect append URLs flow initiated');
  return res.status(200).json({ message: 'OK' });
});


export const updateScrapingDocumentStatus: RequestHandler = tryCatch(async (req, res) => {
  const { documentId } = req.params;
  const { status } = req.body;

  logger.info('Update scraping document status request received', { documentId, status });

  if (!documentId || !status) {
    logger.warn('Validation failed for update scraping document status', { documentId, status });
    throw new ValidationError('Document ID and status are required');
  }

  await updateScrapingDocumentsStatus([documentId], status);

  logger.info('Scraping document status updated', { documentId, status });
  return res.status(200).json({ message: 'OK' });
});

export const updateDocumentHint: RequestHandler = tryCatch(async (req, res) => {
  const { id: documentId, target } = req.params as { id: string; target: 'r2r' | 'database' };
  const { newHint, previousHint, action, r2rId } = req.body.data ?? req.body as {
    newHint?: string | null;
    previousHint?: string;
    action: 'add' | 'delete' | 'edit';
    r2rId: string;
  };
  
  const existingHint = (await findDocumentById(documentId))?.hint;
  const errorMessage = validateHintParams(documentId, action, target, newHint, previousHint, existingHint, r2rId);
  if (errorMessage) {
    throw new ValidationError(`Invalid parameters: ${errorMessage}`);
  };

  if (target === 'r2r') {
    if (newHint === null) {
      throw new ValidationError('newHint cannot be null when sending to r2r');
    };
    logger.info(`Triggering Prefect flow to ${action} hint for document, admin ID: ${documentId}, r2r ID: ${r2rId}, new hint: ${newHint}, previous hint: ${previousHint}...`);
    const prefectFlowRunId = await runPrefectHintFlow(
      documentId,
      r2rId,
      action,
      newHint,
      previousHint
    );
    logger.info(`...Prefect flow run ${prefectFlowRunId} triggered, to ${action} hint for document, admin ID: ${documentId}, r2r ID: ${r2rId}, new hint: ${newHint}, previous hint: ${previousHint}`);
    return res.status(action === 'add' ? 201 : 200).json({ prefectFlowRunId });
  };

  if (target === 'database') {
    await updateDocument(documentId, { hint: newHint });
    return res.status(200).json({ message: `Document hint updated successfully in Admin db to '${newHint}'` });
  }
  return res.status(400).json({ message: "Invalid target specified. Must be 'r2r' or 'database.'" });
});

export const appendSinglePage: RequestHandler = tryCatch(async (req, res) => {
  const { name, pageTitle, pageDescription, url } = req.body;
  const tenant = res.locals.companyConfig.company;

  logger.info('Append single page to knowledge base request received', { tenant, name, pageTitle, pageDescription, url });

  const missingFields: string[] = [];
  if (!name) missingFields.push('name');
  if (!pageTitle) missingFields.push('pageTitle');
  if (!pageDescription) missingFields.push('pageDescription');
  if (!url) missingFields.push('url');

  if (missingFields.length > 0) {
    logger.warn('Validation failed for append single page to knowledge base', { missingFields });
    throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
  }

  const createdLink = await createSingleLink({
    name,
    url,
    type: 'link',
    pageTitle,
    pageDescription,
    words: 0,
    hash: url,
    published: true,
    status: 'SCRAPING'
  });

  logger.info('Single link created', { createdLink });

  const pageIds = [createdLink.id];
  const single_url = {
    id: createdLink.id,
    key: createdLink.key,
    url: createdLink.url,
    pageTitle: createdLink.pageTitle,
    pageDescription: createdLink.pageDescription
  }
  await runPrefectAppendURL(single_url, tenant);

  logger.info('Prefect flow scraping initiated', { tenant, pageIds });
  return res.status(200).json({ message: 'OK', pageIds });
});
