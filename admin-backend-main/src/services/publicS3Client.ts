import { S3 } from '@aws-sdk/client-s3';
import constants from '../constants';

export class PublicS3Client {
  private s3: S3;
  private bucketName: string;
  private region: string;

  constructor() {
    this.bucketName = constants.AWS_PUBLIC_S3_BUCKET_NAME;
    this.region = constants.AWS_PUBLIC_S3_BUCKET_REGION;
  
    this.s3 = new S3({
      region: this.region,
      ...(constants.S3_ENDPOINT_URL && {
        endpoint: constants.S3_ENDPOINT_URL,
        forcePathStyle: true, 
      }),
    });
  }

  async uploadObject(
    key: string,
    body: Buffer,
    contentType: string
  ): Promise<{ key: string; url: string }> {
    const params: any = {
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    };
  
    await this.s3.putObject(params);
  
    let baseUrl;
    if (constants.S3_ENDPOINT_URL) {
      baseUrl = `${constants.S3_ENDPOINT_URL.replace(/\/$/, '')}/${this.bucketName}`;
    } else if (constants.AWS_CDN_BASE_URL) {
      baseUrl = constants.AWS_CDN_BASE_URL;
    } else {
      baseUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com`;
    }    return {
      key,
      url: `${baseUrl}/${key}`,
    };
  }
}