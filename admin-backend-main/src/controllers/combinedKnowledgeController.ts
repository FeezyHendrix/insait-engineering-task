import { RequestHandler } from 'express';
import tryCatch from '../utils/tryCatch';
import { getPaginatedDocuments, getDocumentCountWithSearch } from '../models/documentKnowledgeModel';
import { getKnowledgePagesWithPagination, getKnowledgeCount } from '../models/knowledgeModel';
import { validatePositiveInt } from '../utils/dateHelper';
import { DocumentType } from '@prisma/client';
import { KnowledgePaginationParams } from '../types/interfaces';

export const getCombinedKnowledgePages: RequestHandler = tryCatch(async (req, res) => {
  const {
    page = '1',
    limit = '10',
    order = 'desc',
    orderBy = 'createdAt',
    search = '',
    type = 'all',
  } = req.query as {
    page?: string;
    limit?: string;
    order?: 'asc' | 'desc';
    orderBy?: string;
    search?: string;
    type?: 'document' | 'qa' | 'link' | 'all' | null;
  };

  const normalizedType = type ?? 'all';
  const pageNumber = validatePositiveInt(page);
  const limitNumber = validatePositiveInt(limit);
  if (!pageNumber || !limitNumber) {
    return res.status(400).json({ message: 'Invalid pagination parameters' });
  }

  const skip = (pageNumber - 1) * limitNumber;

  const knowledgeParams: KnowledgePaginationParams = {
    pageNumber,
    limitNumber,
    order,
    orderBy,
    search,
  };

  let combined: any[] = [];
  let totalRecords = 0;

  if (normalizedType === 'document' || normalizedType === 'link') {
    const docType = normalizedType as DocumentType;
    const [docs, count] = await Promise.all([
        getPaginatedDocuments({ skip, take: limitNumber, orderBy, order, type: docType }),
        getDocumentCountWithSearch(search, docType),
      ]);
    combined = docs;
    totalRecords = count;
  } else if (normalizedType === 'qa') {
    const qaResult = await getKnowledgePagesWithPagination({ ...knowledgeParams, skip });
    combined = qaResult.allKnowledges ?? [];
    totalRecords = qaResult.totalRecords ?? 0;
  } else if (normalizedType === 'all') {

    const [totalDocs, totalQA] = await Promise.all([
        getDocumentCountWithSearch(search),
        getKnowledgeCount(search),
      ]);
      

    totalRecords = totalDocs + totalQA;

    const docsToTake = Math.max(0, Math.min(limitNumber, totalDocs - skip));
    const qaToSkip = Math.max(0, skip - totalDocs);
    const qaToTake = limitNumber - docsToTake;

    const [docs, qa] = await Promise.all([
      docsToTake > 0
        ? getPaginatedDocuments({
            skip,
            take: docsToTake,
            orderBy,
            order,
            type: undefined as any,
          })
        : Promise.resolve([]),
      qaToTake > 0
        ? getKnowledgePagesWithPagination({
            ...knowledgeParams,
            skip: qaToSkip,
            limitNumber: qaToTake,
          }).then(r => r.allKnowledges ?? [])
        : Promise.resolve([]),
    ]);

    const merged = [...docs, ...qa];
    combined = merged.sort((a, b) =>
      order === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    }

  const totalPages = Math.ceil(totalRecords / limitNumber);

  return res.status(200).json({
    data: combined,
    pagination: {
      totalRecords,
      currentPage: pageNumber,
      totalPages,
      nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
      previousPage: pageNumber > 1 ? pageNumber - 1 : null,
    },
  });
});