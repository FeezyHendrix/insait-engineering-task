import { getAgentConfiguration, updateAgentConfiguration, uploadAgentAvatar } from '../../src/controllers/agentConfigurationController';
import { Request, Response } from 'express';
import { AuthError, ValidationError } from '../../src/utils/error';
import * as configServices from '../../src/services/agentConfigurationsServices';


const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.locals = { companyConfig: { company: 'mockCompany' } };
  return res;
};

const mockGetRequest = (auth?: string): Partial<Request> => ({
    headers: auth ? { authorization: auth } : {},
  });

const mockPutRequest = (body: any, auth?: string): Partial<Request> => ({
    headers: auth ? { authorization: auth } : {},
    body,
  });

const mockNext = jest.fn();

describe('AGENT CONFIGURATIONS - UNHAPPY', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET / → no auth header → AuthError', async () => {
    const req  = mockGetRequest(undefined) as Request;
    const res  = mockResponse() as Response;

    await getAgentConfiguration(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    const err = mockNext.mock.calls[0][0];
    expect(err).toBeInstanceOf(AuthError);
    expect(err.message).toBe('Missing Token');
  });

  test('GET / → no tenant info → generic Error', async () => {
    const req  = mockGetRequest('Bearer token') as Request;
    const res  = mockResponse() as Response;

    res.locals.companyConfig = {};

    await getAgentConfiguration(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    const err = mockNext.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Missing tenant information');
  });

  test('PUT / → no auth header → AuthError', async () => {
    const req  = mockPutRequest({ data: {editable: { test_key: 'test_value' } }}, undefined) as Request;
    const res  = mockResponse() as Response;

    await updateAgentConfiguration(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    const err = mockNext.mock.calls[0][0];
    expect(err).toBeInstanceOf(AuthError);
    expect(err.message).toBe('Missing token');
  });

  test('PUT / → no tenant info → generic Error', async () => {
    const req  = mockPutRequest({ data:{ editable: { test_key: 'test_value' }} }, 'Bearer token') as Request;
    const res  = mockResponse() as Response;

    res.locals.companyConfig = {};

    await updateAgentConfiguration(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    const err = mockNext.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Missing tenant information');
  });

  test('PUT / → missing editable → ValidationError', async () => {
    const req  = mockPutRequest({data:{}}, 'Bearer token') as Request;
    const res  = mockResponse() as Response;

    await updateAgentConfiguration(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    const err = mockNext.mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.message).toBe('No editable configuration provided.');
  });

  test('PUT / → empty editable → ValidationError', async () => {
    const req  = mockPutRequest({ data:{editable: {}} }, 'Bearer token') as Request;
    const res  = mockResponse() as Response;

    await updateAgentConfiguration(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    const err = mockNext.mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.message).toBe('No editable configuration provided.');
  });

  test('PUT / → service throws → propagate error', async () => {
    const payload = { data: {editable: { bot: { ui: { test_key: 'test_value' }} } } };
    const req  = mockPutRequest(payload, 'Bearer token') as Request;
    const res  = mockResponse() as Response;

    jest
      .spyOn(configServices, 'updateAgentConfigurationService')
      .mockRejectedValue(new Error('mock error from configuration service'));

    await updateAgentConfiguration(req, res, mockNext);

    expect(configServices.updateAgentConfigurationService)
      .toHaveBeenCalledWith('Bearer token', 'mockCompany', payload.data.editable);

    expect(mockNext).toHaveBeenCalledTimes(1);
    const err = mockNext.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('mock error from configuration service');
  });

  test('POST /uploadAvatar → no file → ValidationError', async () => {
    const req  = { files: [] } as unknown as Request;
    const res  = mockResponse() as Response;
    const next = mockNext;

    await uploadAgentAvatar(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.message).toBe('File not uploaded');
  });
});