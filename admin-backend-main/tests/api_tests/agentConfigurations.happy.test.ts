import { getAgentConfiguration, updateAgentConfiguration, uploadAgentAvatar } from '../../src/controllers/agentConfigurationController';
import { MulterFile } from '../../src/types/interfaces';
import * as configAxios from '../../src/utils/configAxios';
import * as configurationServices from '../../src/services/agentConfigurationsServices';
import { Request, Response } from 'express';

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.locals = { companyConfig: { company: 'mockCompany' } };
  return res;
};

const mockGetRequest = (auth = 'Bearer token'): Partial<Request> => ({
  headers: { authorization: auth },
});

const mockPutRequest = (editablePayload: object, auth = 'Bearer token'): Partial<Request> => ({
  headers: { authorization: auth },
  body: { editable: editablePayload },
});

const mockNext = jest.fn();

describe('AGENT CONFIGURATIONS - HAPPY', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET / → 200 + returns editable features', async () => {
    const req = mockGetRequest() as Request;
    const res = mockResponse() as Response;

    const mockGet = jest.fn().mockResolvedValue({ data: { editable: { bot_name: 'AgentX' } } });

    jest.spyOn(configAxios, 'getConfigAxiosInstance').mockReturnValue({ get: mockGet } as any);

    await getAgentConfiguration(req, res, mockNext);

    expect(mockGet).toHaveBeenCalledWith(`/editable/mockCompany`);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: { editable: { bot_name: 'AgentX' } } });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('PUT / → 200 + returns success message', async () => {
    const editablePayload = {
      bot: {
        ui: {
          bot_name: 'Updated AgentX'
        }
      }
    };

    const req = mockPutRequest(editablePayload) as Request;
    const res = mockResponse() as Response;

    const mockPut = jest.fn().mockResolvedValue({ status: 200, data: {  message: 'Editable configuration updated' } });

    jest.spyOn(configAxios, 'getConfigAxiosInstance').mockReturnValue({ put: mockPut } as any);

    await updateAgentConfiguration(req, res, mockNext);

    expect(mockPut).toHaveBeenCalledWith(`/editable/mockCompany`, { editable: editablePayload });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Configuration updated',
      data: { message: 'Editable configuration updated' },
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('POST /uploadAvatar → 200 + returns URL', async () => {
    const fakeFile = {
      originalname: 'avatar.png',
      buffer: Buffer.from('fake'),
      mimetype: 'image/png'
    } as MulterFile;

    const req  = { files: [ fakeFile ] } as unknown as Request;
    const res  = mockResponse() as Response;

    jest
      .spyOn(configurationServices, 'uploadAgentAvatarFile')
      .mockResolvedValue({ key: 'public/avatars/test/avatar.png', url: 'https://cdn.test/avatar.png' });

    await uploadAgentAvatar(req, res, mockNext);

    expect(configurationServices.uploadAgentAvatarFile).toHaveBeenCalledWith(
      'mockCompany',
      fakeFile
    );    
    expect(res.json).toHaveBeenCalledWith({ url: 'https://cdn.test/avatar.png' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});