import {
  S3Client as AWSS3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import constants from '../constants';
import logger from '../libs/pino';
import { MulterFile } from '../types/interfaces';
import crypto from 'crypto';
import { OperationalError } from '../utils/error';
import { decodeFileName } from '../utils/fileUtils';

class S3Client {
  private static instance: S3Client;
  private s3: AWSS3Client | null = null;
  private bucketName: string | null = null;

  private constructor() {}

  public static getInstance(): S3Client {
    if (!S3Client.instance) {
      S3Client.instance = new S3Client();
      S3Client.instance.initialize();
    }
    return S3Client.instance;
  }

  public initialize(): void {
    if (this.s3) return; // Already initialized

    const endpointUrl = constants.LOCALSTACK_ENDPOINT_URL
      ? { endpoint: constants.LOCALSTACK_ENDPOINT_URL }
      : {};

    const isLocalDevelopment = constants.RUN_MODE !== 'PRODUCTION';
    this.s3 = new AWSS3Client({
      region: constants.AWS_REGION,
      ...(isLocalDevelopment && { forcePathStyle: true }),
      ...endpointUrl,
    });

    const bucketName = constants.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('Bucket name is not defined in configuration');
    }
    this.bucketName = bucketName;

    logger.info(
      `S3 client successfully initialized with endpoint: ${
        constants.LOCALSTACK_ENDPOINT_URL ||
        `https://s3.${constants.AWS_REGION}.amazonaws.com`
      }`
    );
  }

  private validateInitialization(): void {
    if (!this.s3 || !this.bucketName) {
      throw new Error(
        'S3 client or bucket name is not initialized. Call initialize() first.'
      );
    }
  }

  public async uploadFile(
    file: MulterFile,
    tenant: string
  ): Promise<string | null> {
    this.validateInitialization();

    const decodedName: string = decodeFileName(file.originalname);
    const s3Key = `${tenant}/${
      constants.RAW_KNOWLEDGE_BASE_FOLDER_NAME
    }/${crypto.randomUUID()}-${decodedName}`;

    try {
      await this.s3!.send(
        new PutObjectCommand({
          Bucket: this.bucketName!,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );
      return s3Key;
    } catch (error) {
      logger.error(
        `Failed to upload file to bucket "${this.bucketName}" with key "${s3Key}". Original file name: "${file.originalname}". Error: ${(error as Error).message}`
      );
      return null;
    }
  }

  public async deleteFile(key: string): Promise<void> {
    this.validateInitialization();

    try {
      await this.s3!.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName!,
          Key: key,
        })
      );
      logger.info(`File "${key}" deleted successfully from bucket "${this.bucketName}"`);
    } catch (error) {
      logger.error(
        `Failed to delete file from bucket "${this.bucketName}" with key "${key}". Error: ${(error as Error).message}`
      );
      throw new OperationalError('File deletion failed', error as Error);
    }
  }

  public async getSignedUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    this.validateInitialization();

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName!,
        Key: key,
      });
      return await getSignedUrl(this.s3!, command, { expiresIn });
    } catch (error) {
      logger.error(
        `Failed to generate signed URL for bucket "${this.bucketName}" with key "${key}". Error: ${(error as Error).message}`
      );
      throw new OperationalError(
        'Failed to generate signed URL',
        error as Error
      );
    }
  }
}

export default S3Client;
