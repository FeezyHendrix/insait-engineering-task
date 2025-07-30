import { prisma } from '../libs/prisma';
import logger from '../libs/pino';
import { DocumentData, DocumentStatus } from '../types/interfaces';
import { NotFoundError, OperationalError } from '../utils/error';
import { DocumentType } from '@prisma/client';

export const createDocument = async (data: DocumentData) => {
  try {
    const document = await prisma.documentKnowledge.create({
      data: {
        ...data,
        status: 'PENDING'
      }
    });
    return document;
  } catch (error) {
    logger.error(`Error creating document record: ${(error as Error).message}`);
    throw new OperationalError(
      'Failed to create document record',
      error as Error
    );
  }
};

export const findDocumentById = async (id: string) => {
  try {
    const document = await prisma.documentKnowledge.findUnique({
      where: { id },
    });

    return document;
  } catch (error) {
    logger.error(`Error fetching document record: ${(error as Error).message}`);
    throw new OperationalError(
      'Failed to fetch document record',
      error as Error
    );
  }
};

export const deleteDocumentById = async (id: string) => {
  try {
    const deletedDocument = await prisma.documentKnowledge.delete({
      where: { id },
    });
    return deletedDocument;
  } catch (error) {
    if ((error as any).code === 'P2025') {
      logger.warn(`Attempt to delete non-existent document with ID ${id}`);
      throw new NotFoundError(
        `Document with ID ${id} not found, cannot delete`
      );
    }

    logger.error(`Error deleting document record: ${(error as Error).message}`);
    throw new OperationalError(
      'Failed to delete document record',
      error as Error
    );
  }
};

export const getPaginatedDocuments = async ({
  skip,
  take,
  orderBy,
  order,
  reviewStatus,
  type
}: {
  skip: number;
  take: number;
  orderBy: string;
  order: 'asc' | 'desc';
  reviewStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  type: DocumentType;
}) => {
  try {
    const orderByParams = { [orderBy]: order };
    const where = {
      ...reviewStatus ? { reviewStatus } : {},
      type,
      published: true,
    };
    return await prisma.documentKnowledge.findMany({
      where,
      skip,
      take,
      orderBy: orderByParams,
    });
  } catch (error) {
    logger.error(
      `Error fetching paginated documents: ${(error as Error).message}`
    );
    throw new OperationalError(
      'Failed to fetch paginated documents',
      error as Error
    );
  }
};

export const getDocumentCount = async () => {
  try {
    return await prisma.documentKnowledge.count({
      where: {
        published: true,
      }
    });
  } catch (error) {
    logger.error(`Error counting documents: ${(error as Error).message}`);
    throw new OperationalError('Failed to count documents', error as Error);
  }
};

export const findDocumentByHash = async (hash: string) => {
  try {
    const document = await prisma.documentKnowledge.findUnique({
      where: { hash },
    });

    return document;
  } catch (error) {
    throw new OperationalError(
      'Failed to query document by name',
      error as Error
    );
  }
};

export const updateDocumentStatusInDb = async (id: string, status: DocumentStatus, r2rId?: string) => { // TODO use updateDocument function once its tested
  try {
    logger.info(`Updating document ${id} status to ${status}...`);
    const updatedDocument = await prisma.documentKnowledge.update({
      where: { id },
      data: {
        status,
        ...(r2rId && { r2rId }),
      },
    });
    logger.info(`Document ${id} status updated to ${status}, and R2R ID set to ${r2rId}`);
    return updatedDocument;
  } catch (error) {
    logger.error(`Error updating document status: ${(error as Error).message}`);
    throw new OperationalError(`Failed to update document ${id} status to ${status}`,error as Error);
  }
};

export const updateDocument = async (id: string, params: { 
    reviewStatus?: 'APPROVED' | 'REJECTED'; 
    status?: DocumentStatus; 
    hint?: string | null
  }) => {
  try {
    if (Object.values(params).filter((param) => param !== undefined).length !== 1) {
      throw new OperationalError('Only one of reviewStatus, status, or hint should be provided', new Error('Invalid parameters'));
    };
    const entry = Object.entries(params).find(([_, value]) => value !== undefined);
    if (!entry) {
      throw new OperationalError('No valid parameter provided for update', new Error('Invalid parameters'));
    };
    const [fieldName, value] = entry;
    logger.info(`Updating ${fieldName} of document ${id} to '${value}'...`);
    const updatedDocument = await prisma.documentKnowledge.update({
      where: { id },
      data: {
        [fieldName]: value,
      }
    });
    logger.info(`Document ${id} updated in Admin db`);
    return updatedDocument;
  } catch (error) {
    logger.error(`Error updating document: ${(error as Error).message}`);
    throw new OperationalError('Failed to update document', error as Error);
  }
}
export const updateDocumentReviewStatus = async (id: string, reviewStatus: 'APPROVED' | 'REJECTED') => { // TODO use updateDocument function once its tested
  try {
    logger.info(`Updating document ${id} review status to ${reviewStatus}...`);
    const updatedDocument = await prisma.documentKnowledge.update({
      where: { id },
      data: { 
        reviewStatus
      }
    });
    logger.info(`Document ${id} review status updated to ${reviewStatus}`);
    return updatedDocument;
  } catch (error) {
    logger.error(`Error updating document review status: ${(error as Error).message}`);
    throw new OperationalError(`Failed to update document ${id} review status to ${reviewStatus}`, error as Error);
  }
};

export const getDocumentCountWithSearch = async (
  search: string = '',
  type?: DocumentType
): Promise<number> => {
  try {
    const filter: any = {
      published: true,
    };

    if (search) {
      filter.name = {
        contains: search.toLowerCase(),
        mode: 'insensitive',
      };
    }

    if (type) {
      filter.type = type;
    }

    return await prisma.documentKnowledge.count({ where: filter });
  } catch (error) {
    logger.error(`Error counting documents with search: ${(error as Error).message}`);
    throw new OperationalError('Failed to count documents with search', error as Error);
  }
};

export const updateScrapingDocumentsStatus = async (ids: string[], status: DocumentStatus): Promise<string[]> => {
  try {
    logger.info(`Updating status of documents with IDs: ${ids.join(', ')} to ${status}...`);

    const updatedDocuments = await prisma.documentKnowledge.updateMany({
      where: { id: { in: ids } },
      data: { status: { set: status }, published: true },
    });

    logger.info(`Updated ${updatedDocuments.count} documents to status ${status}`);


    return ids;
  } catch (error) {
    logger.error(`Error updating document statuses: ${(error as Error).message}`);
    throw new OperationalError(`Failed to update document statuses to ${status}`, error as Error);
  }
};

export const createCrawlingJob = async (data: { tenant: string; url: string; progress?: number; status?: DocumentStatus }) => {
  try {
    const crawlingJob = await prisma.crawlingJob.create({
      data: {
        tenant: data.tenant,
        url: data.url,
        progress: data.progress || 0,
        status: data.status,
      },
    });
    return crawlingJob.id;
  } catch (error) {
    logger.error(`Error creating CrawlingJob: ${(error as Error).message}`);
    throw new OperationalError('Failed to create CrawlingJob', error as Error);
  }
};

export const updateCrawlingJobStatus = async (id: string, data: { status: DocumentStatus; progress: number }) => { // TODO use updateDocument function once its tested
  try {
    const updatedCrawlingJob = await prisma.crawlingJob.update({
      where: { id },
      data: {
        status: data.status,
        progress: data.progress,
      },
    });
    return updatedCrawlingJob;
  } catch (error) {
    logger.error(`Error updating CrawlingJob status: ${(error as Error).message}`);
    throw new OperationalError(`Failed to update CrawlingJob with ID ${id}`, error as Error);
  }
};

export const addDocumentsToCrawlingJob = async (
  crawlingJobId: string,
  documents: Array<{
    url: string;
    path: string;
    type: DocumentType;
    pageTitle: string;
    pageDescription: string;
    words: number;
    name: string;
    hash: string;
    key: string;
  }>
) => {
  try {
    const createOrUpdatePromises = documents.map(async (doc) => {
      try {
        await prisma.documentKnowledge.create({
          data: {
            url: doc.url,
            type: doc.type,
            pagePath: doc.path,
            pageTitle: doc.pageTitle,
            pageDescription: doc.pageDescription,
            words: doc.words,
            name: doc.name,
            published: false,
            hash: doc.hash,
            crawlingJobId,
            key: doc.key,
          },
        });
      } catch (error: any) {
        if (error.code === 'P2002') { // Unique constraint violation
          logger.warn(`Document with unique constraint conflict detected. Checking for update.`);
          const existingDocument = await prisma.documentKnowledge.findFirst({
            where: {
              OR: [
                { hash: doc.hash },
                { name: doc.name },
              ],
            },
          });

          if (existingDocument) {
            if (existingDocument.published) {
              logger.info(`Skipping update for published document with ID ${existingDocument.id}`);
              return;
            }

            await prisma.documentKnowledge.update({
              where: { id: existingDocument.id },
              data: { crawlingJobId },
            });
            logger.info(`Updated CrawlingJobId for document with ID ${existingDocument.id}`);
          } else {
            logger.error(`Document with hash ${doc.hash} or name ${doc.name} not found for update.`);
            throw new NotFoundError(`Document with hash ${doc.hash} or name ${doc.name} not found.`);
          }
        } else {
          throw error;
        }
      }
    });

    await Promise.all(createOrUpdatePromises);
    logger.info(
      `Processed ${documents.length} documents for CrawlingJob ${crawlingJobId}`
    );
  } catch (error) {
    logger.error(
      `Error adding or updating documents for CrawlingJob: ${(error as Error).message}`
    );
    throw new OperationalError(
      `Failed to process documents for CrawlingJob with ID ${crawlingJobId}`,
      error as Error
    );
  }
};

export const findCrawlingJobById = async (id: string, includeDocuments = false, showOnlyUnPublished = false) => {
  try {
    const crawlingJob = await prisma.crawlingJob.findUnique({
      where: { id },
      include: includeDocuments
      ? {
        documents: {
          where: showOnlyUnPublished ? { published: false } : undefined,
        },
        }
      : undefined,
    });
    if (!crawlingJob) {
      throw new NotFoundError(`CrawlingJob with ID ${id} not found`);
    }
    return crawlingJob;
  } catch (error) {
    logger.error(`Error fetching CrawlingJob: ${(error as Error).message}`);
    throw new OperationalError(`Failed to fetch CrawlingJob with ID ${id}`, error as Error);
  }
};


export const getActiveCrawlingJob = async () => {
  try {
    const crawlingJob = await prisma.crawlingJob.findFirst({
      where: {
        status: {
          in: ['PENDING'],
        },
      },
    });

    if (!crawlingJob) {
      logger.info(`No active CrawlingJob found`);
      return null;
    }

    return crawlingJob;
  } catch (error) {
    logger.error(`Error fetching active CrawlingJob: ${(error as Error).message}`);
    throw new OperationalError(
      `Failed to fetch active CrawlingJob`,
      error as Error
    );
  }
};

export const getCrawlingJobHistory = async () => {
  try {
    const crawlingJob = await prisma.crawlingJob.findMany({
      where: {
        status: {
          in: ['COMPLETED', 'ERROR'],
        },
      },
    });

    if (!crawlingJob) {
      logger.info(`No active CrawlingJob found`);
      return null;
    }

    return crawlingJob;
  } catch (error) {
    logger.error(`Error fetching active CrawlingJob: ${(error as Error).message}`);
    throw new OperationalError(
      `Failed to fetch active CrawlingJob`,
      error as Error
    );
  }
};


export const findDocumentsByCrawlingJobId = async (crawlingJobId: string) => {
  try {
    const documents = await prisma.documentKnowledge.findMany({
      where: { crawlingJobId },
    });
    return documents;
  } catch (error) {
    logger.error(`Error fetching documents for CrawlingJob: ${(error as Error).message}`);
    throw new OperationalError(`Failed to fetch documents for CrawlingJob with ID ${crawlingJobId}`, error as Error);
  }
};

export const getDocumentUrlsByIds = async (documentIds: string[]): Promise<Array<{ id: string; url: string | null; key: string | null; pageTitle: string | null; pageDescription: string | null }>> => {
  try {
    const documents = await prisma.documentKnowledge.findMany({
      where: {
        id: { in: documentIds },
      },
      select: {
        id: true,
        url: true,
        key: true, 
        pageTitle: true,
        pageDescription: true
      },
    });
    console.log(`documents`, documents);
    logger.info(`Fetched ${documents.length} documents for provided IDs`);
    return documents;
  } catch (error) {
    logger.error(`Error fetching document URLs: ${(error as Error).message}`);
    throw new OperationalError('Failed to fetch document URLs', error as Error);
  }
};

export const createSingleLink = async (data: {
  url: string;
  name: string;
  type: DocumentType;
  pageTitle?: string;
  pageDescription?: string;
  words?: number;
  hash: string;
  published?: boolean;
  status?: DocumentStatus;
}) => {
  try {
    logger.info(`Creating a single link document with URL: ${data.url}`);
    const document = await prisma.documentKnowledge.create({
      data: {
        url: data.url,
        name: data.name,
        type: data.type,
        pageTitle: data.pageTitle || null,
        pageDescription: data.pageDescription || null,
        words: data.words || 0,
        hash: data.hash,
        published: data.published || false,
        status: data.status || 'SCRAPING',},
    });
    logger.info(`Single link document created with ID: ${document.id}`);
    return document;
  } catch (error: any) {
    if (error.code === 'P2002') {
      logger.warn(`Document with hash ${data.hash} or name ${data.name} already exists.`);
      throw new OperationalError(
        `Document with hash ${data.hash} or name ${data.name} already exists.`,
        error
      );
    }
    logger.error(`Error creating single link document: ${(error as Error).message}`);
    throw new OperationalError('Failed to create single link document', error as Error);
  }
};