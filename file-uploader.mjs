// file-Uploader.mjs
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'crypto';
import {join} from 'path'
import {uploadFile} from './gcs-file.mjs'

// Environment variables
const UPLOAD_MODE = process.env.UPLOAD_MODE || 'gcs'; // 'local' or 'gcs'
const LOCAL_UPLOAD_PATH = './test_uploads'; // Local storage path


// Multer storage configuration
const multerStorage = UPLOAD_MODE === 'gcs' ?
  multer.memoryStorage() : // For GCS, use memory storage
  multer.diskStorage({ // For local storage
    destination: function (req, file, cb) {
      cb(null, LOCAL_UPLOAD_PATH);
    },
    filename: function (req, file, cb) {
      const filename = file.fieldname + '-' + Date.now()
      const localUrl = join(LOCAL_UPLOAD_PATH, filename)
      file.localUrl = localUrl;
      cb(null, filename);
    },
  });

const upload = multer({ storage: multerStorage });

// Middleware for uploading file to GCS
export function uploadToGCSMiddleware(destination = ''){
  return function (req, res, next) {
    if (UPLOAD_MODE === 'gcs') {
      upload.single('file')(req, res, async function (err) {
        const {file} = req
        if (UPLOAD_MODE !== 'gcs' || !file) {
          return next(); // Skip middleware if not using GCS or no file uploaded
        }

        try {
          file.cloudStoragePublicUrl = await uploadFile(file.buffer, file.mimetype, destination);
          next();
        } catch (error) {
          next(error);
        }
      })
    } else {
      upload.single('file')(req, res, next);
    }
  }
}
