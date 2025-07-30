import multer from 'multer';
import logger from '../libs/pino';

export const allowedMimeTypeText = [
  'text/html',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'text/plain', // .txt
  'application/pdf', // .pdf
  'application/octet-stream', // .md
  'text/x-markdown', // .md
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'text/csv', // .csv
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'audio/mpeg', // .mp3
];

export const allowedMimeTypesMedia = [
  'image/png', // .png
  'video/mp4', // .mp4
  'video/webm', // .webm
];

export const allowedMimeTypesAvatars = [
  'image/png',
  'image/jpeg',
  'image/gif',
]

export const uploadFile = (size: number, allowedTypes: string[], fieldName: string, maxFiles: number) => {
  try {
    const upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: size, 
        files: maxFiles, 
      },
      fileFilter: (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          const error = new Error(`Unsupported file type: ${file.mimetype}`);
          logger.error(error.message);
          cb(error);
        }
      },
    });

    return upload.array(fieldName, maxFiles); 
  } catch (error) {
    logger.error(`Failed to initialize multer: ${(error as Error).message}`);
    throw new Error('Multer initialization failed');
  }
};
