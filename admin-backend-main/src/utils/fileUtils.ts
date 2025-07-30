import crypto from 'crypto';

export function getFileNameFromUrl(url: string): string {
  const urlParts = url.split('/');
  const fileName = urlParts[urlParts.length - 1];

  const questionMarkIndex = fileName.indexOf('?');
  if (questionMarkIndex !== -1) {
    return fileName.substring(0, questionMarkIndex);
  }

  return fileName;
}

export const calculateFileHash = (
  buffer: Buffer,
  algorithm = 'sha256'
): string => {
  return crypto.createHash(algorithm).update(buffer).digest('hex');
};

export function decodeFileName(originalName: string): string {
  return Buffer.from(originalName, 'latin1').toString('utf8').normalize('NFC');
}

export function generateTimestampedKey(originalName: string): string {
  const now = new Date();
  const timestamp = now
    .toISOString()           
    .replace(/[-:.TZ]/g, '') 
    .slice(0, 15);           
    
  const sanitizedFileName = originalName.replace(/\s+/g, '_');
  return `${timestamp}_${sanitizedFileName}`;
}