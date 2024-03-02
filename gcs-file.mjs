// gcs-file.mjs
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'crypto';
import { join } from 'path'

const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME // Your GCS bucket name
const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID // Your GCS project ID
const GCS_KEYFILE = process.env.GCS_KEYFILE

const storage = new Storage({
  keyFilename: GCS_KEYFILE,
  projectId: GCS_PROJECT_ID,
});

async function uploadFile(buffer, mimeType, destination = '') {
  const bucket = storage.bucket(GCS_BUCKET_NAME);
  const gcsFileName = `${destination}/${Date.now()}-${randomUUID()}.jpg`;
  const file = bucket.file(gcsFileName);

  const stream = file.createWriteStream({
    metadata: {
      contentType: mimeType,
    },
  });

  await new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.on('finish', resolve);
    stream.end(buffer);
  });

  return `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${gcsFileName}`;
}

async function downloadFile(gcsFileName, destinationPath) {
  const bucket = storage.bucket(GCS_BUCKET_NAME);
  const file = bucket.file(gcsFileName);

  await file.download({
    destination: destinationPath,
  });

  return destinationPath;
}

async function downloadFileFromURL(gcsFileUrl, destinationDir) {
  const parsedUrl = new URL(gcsFileUrl)
  const splitPathName = parsedUrl.pathname.split('/').slice(1); // first el with be '/' so pull the res
  const [bucketName, ...restPathName] = splitPathName
  const filePath = join(...restPathName)

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filePath);

  const fileName = restPathName[restPathName.length - 1]

  const destinationPath = join(destinationDir, fileName)

  await file.download({
    destination: destinationPath,
  });

  return destinationPath;
}

export { uploadFile, downloadFile, downloadFileFromURL };
