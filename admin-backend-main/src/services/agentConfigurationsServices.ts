import constants from '../constants';
import { MulterFile } from '../types/interfaces';
import { getConfigAxiosInstance } from '../utils/configAxios';
import { generateTimestampedKey } from '../utils/fileUtils';
import { PublicS3Client } from './publicS3Client';

export const uploadAgentAvatarFile = async (tenant: string, file: MulterFile) => {
  const fileName = generateTimestampedKey(file.originalname);
  const key = `public/avatars/${tenant}/${fileName}`;
  
  const publicS3 = new PublicS3Client();
  return await publicS3.uploadObject(key, file.buffer, file.mimetype);
};

export const fetchAgentEditableConfigurations = async (authHeader: string, tenant: string) => {
    const configInstance = getConfigAxiosInstance(authHeader);
    const { data } = await configInstance.get(`/editable/${tenant}`);
    return data; 
}

export const updateAgentConfigurationService = async(
    authHeader: string,
    tenant: string,
    editable: Record<string, any>
  ) => {
    const configInstance = getConfigAxiosInstance(authHeader);
    const { data } = await configInstance.put(`/editable/${tenant}`, { editable });
    return data;
  }