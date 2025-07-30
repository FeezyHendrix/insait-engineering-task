import { createDocumentKnowledge } from '../../src/controllers/documentKnowledgeController';
import S3Client from '../../src/services/S3Client';
import {
  createDocument,
  findDocumentByHash,
  deleteDocumentById,
} from '../../src/models/documentKnowledgeModel';
import { runPrefectCreateDocumentFlow } from '../../src/services/prefectService';
import { Request, Response } from 'express';
import { ValidationError } from '../../src/utils/error';
import { calculateFileHash, decodeFileName } from '../../src/utils/fileUtils';
import { NextFunction } from 'express-serve-static-core';
import constants from '../../src/constants';
import axios from 'axios';

jest.mock('../../src/services/S3Client');
jest.mock('../../src/models/documentKnowledgeModel');
jest.mock('../../src/services/prefectService');
jest.mock('../../src/utils/fileUtils');

const mockS3Client = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
};
(S3Client.getInstance as jest.Mock).mockReturnValue(mockS3Client);

const mockRequest = (files: any[] = []): Partial<Request> => ({
  files,
});

mockS3Client.uploadFile.mockImplementation((file, tenant) => {
  return Promise.resolve(
    `${tenant}/raw-knowledge-files/${crypto.randomUUID()}-${file.originalname}`
  );
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.locals = { companyConfig: { company: 'mockCompany' } };
  return res;
};

const mockNext: NextFunction = jest.fn();

describe('createDocumentKnowledge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should throw ValidationError if no files are uploaded', async () => {
    const req = mockRequest() as Request;
    const res = mockResponse() as Response;
    const mockNext = jest.fn() as jest.MockedFunction<NextFunction>;

    await createDocumentKnowledge(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
    expect(mockNext.mock.calls[0][0]).toMatchObject({
      message: 'No files uploaded',
      statusCode: 400,
    });
  });

  test('should process files successfully', async () => {
    const req = mockRequest([
      { originalname: 'testfile.txt', buffer: Buffer.from('content') },
    ]) as Request;
    const res = mockResponse() as Response;

    // Mock utility and service calls
    (decodeFileName as jest.Mock).mockReturnValue('testfile.txt');
    (calculateFileHash as jest.Mock).mockReturnValue('hash123');
    (findDocumentByHash as jest.Mock).mockResolvedValue(null);
    mockS3Client.uploadFile.mockResolvedValue(
      'mockCompany/raw-knowledge-files/s3-key'
    );
    (createDocument as jest.Mock).mockResolvedValue({ id: 'doc123' });
    (runPrefectCreateDocumentFlow as jest.Mock).mockResolvedValue(null);

    await createDocumentKnowledge(req, res, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'File processing completed',
      results: [
        {
          success: true,
          fileName: 'testfile.txt',
          documentId: 'doc123',
          status: 'PROCESSING'
        },
      ],
    });
  });

  test('should detect duplicate files and log warning', async () => {
    const req = mockRequest([
      { originalname: 'duplicate.txt', buffer: Buffer.from('content') },
    ]) as Request;
    const res = mockResponse() as Response;

    (decodeFileName as jest.Mock).mockReturnValue('duplicate.txt');
    (calculateFileHash as jest.Mock).mockReturnValue('hash123');
    (findDocumentByHash as jest.Mock).mockResolvedValue({ id: 'existingDoc' });

    await createDocumentKnowledge(req, res, mockNext);

    expect(decodeFileName).toHaveBeenCalledWith('duplicate.txt');
    expect(calculateFileHash).toHaveBeenCalledWith(Buffer.from('content'));
    expect(findDocumentByHash).toHaveBeenCalledWith('hash123');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'File processing completed',
      results: [
        {
          success: false,
          fileName: 'duplicate.txt',
          error: 'This document already exists',
        },
      ],
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should handle errors and rollback operations', async () => {
    const req = mockRequest([
      { originalname: 'errorfile.txt', buffer: Buffer.from('content') },
    ]) as Request;
    const res = mockResponse() as Response;

    (decodeFileName as jest.Mock).mockReturnValue('errorfile.txt');
    (calculateFileHash as jest.Mock).mockReturnValue('hash123');
    (findDocumentByHash as jest.Mock).mockResolvedValue(null);
    mockS3Client.uploadFile.mockResolvedValue(
      'mockCompany/raw-knowledge-files/s3-key'
    );
    (createDocument as jest.Mock).mockResolvedValue({ id: 'doc123' });
    (runPrefectCreateDocumentFlow as jest.Mock).mockRejectedValue(
      new Error('Prefect flow failed')
    );

    await createDocumentKnowledge(req, res, mockNext);

    expect(mockS3Client.deleteFile).toHaveBeenCalledWith(
      'mockCompany/raw-knowledge-files/s3-key'
    );
    expect(deleteDocumentById).toHaveBeenCalledWith('doc123');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'File processing completed',
      results: [
        {
          success: false,
          fileName: 'errorfile.txt',
          error: 'Prefect flow failed',
        },
      ],
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe('/status/:id', () => {
  test('update kb file status from prefect flow outcome', async () => {
    const response = await axios.put(`http://${constants.BACKEND_URL}/documentKnowledge/status/123`, {status: 'COMPLETED'});
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('documentId', '123');
    expect(response.data).toHaveProperty('status', 'COMPLETED');
    
  });
});


describe('updateDocumentHint', () => {
  test('add document hint in admin db', async () => {
    const payload = {
      "data": {
        "newHint": "new hint",
        "action": "add",
      }
    };
    const response = await axios.put(`http://${constants.BACKEND_URL}/documentKnowledge/hints/123/database`, payload);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message', "Document hint updated successfully in Admin db to 'new hint'");
  });
  test('update document hint in admin db', async () => {
    const payload = {
      "data": {
        "newHint": "updated hint",
        "previousHint": "new hint",
        "action": "edit"
      }
    };
    const response = await axios.put(`http://${constants.BACKEND_URL}/documentKnowledge/hints/123/database`, payload);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message', "Document hint updated successfully in Admin db to 'updated hint'");
  });
  test('fail to update hint due to invalid action', async () => {
    const payload = {
      "data": {
        "newHint": "updated hint",
        "previousHint": "updated hint",
        "action": "invalidAction"
      }
    };
    try {
      await axios.put(`http://${constants.BACKEND_URL}/documentKnowledge/hints/123/database`, payload);
    } catch (error: any) {
      expect(error.response.data).toContain("Invalid parameters: Invalid action 'invalidAction'. Valid actions are: add, delete, edit.");
    }
  });
  test('fail to update hint due to incorrect previous hint', async () => {
    const payload = {
      "data": {
        "newHint": "updated hint",
        "previousHint": "wrong hint",
        "action": "edit"
      }
    };
    try {
      await axios.put(`http://${constants.BACKEND_URL}/documentKnowledge/hints/123/database`, payload);
    } catch (error: any) {
      expect(error.response.data).toContain("Invalid parameters: Error editing hint. Previous hint does not match. given: wrong hint, existing: updated hint");
    }
  });
});
``