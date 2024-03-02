import sharp from 'sharp'
import { listenForMessages } from '../pubsub.mjs'
import * as db from '../db.mjs'
import { downloadFileFromURL, uploadFile } from '../gcs-file.mjs'
import { join } from 'path'
import { readFile, unlink } from 'fs/promises'

// 1. Connect to GCS
// 2. Connect to CloudSQL. Create a table {id, srcUrl, resizedUrl}
// 3. Connect to Pub/Sub
// 4. Create Docker container


async function resizeImage(imgId) {
  try {
    const {uploadUrl, targetWidth, targetHeight} = await db.getImage(imgId)

    const tempDownloadPath = await downloadFileFromURL(uploadUrl, './tmp-images')

    const [folder, fileName] = tempDownloadPath.split('/')
    const [name, extension] = fileName.split('.')

    const resizedImgPath = join(folder, `${name}-res.${extension}`)

    console.log('paths', tempDownloadPath, resizedImgPath)

    // Resize the image
    await sharp(tempDownloadPath)
      .resize(targetWidth, targetHeight)
      .toFile(resizedImgPath);

    const buffer = await readFile(resizedImgPath)

    const resizedImgGCSPath = await uploadFile(buffer, 'image/jpeg', 'resized')

    await db.updateImage(imgId, {resizedUrl: resizedImgGCSPath})

    await unlink(tempDownloadPath);
    await unlink(resizedImgPath);

    // Upload the resized image back to GCS
    //await destinationBucket.upload(tempUploadPath, { destination: `resized-${uploadUrl}` });

  } catch (error) {
    console.error('Failed to process resize task:', error);
  }
}

function startService() {
  listenForMessages(async ({imgId}, done) => {
    await resizeImage(imgId);
    done(null); // Acknowledge the message
  });
}

await db.connect()
startService()
