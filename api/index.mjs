import express from 'express'
import { uploadToGCSMiddleware } from '../file-uploader.mjs';
import * as db from '../db.mjs'
import { publishMessage } from '../pubsub.mjs';

const PORT = 3333

function initApp() {
  const app = express()

  app.post('/resize', uploadToGCSMiddleware('original'), async (req, res) => {
    try {
      const file = req.file
      const targetWidth = req.body.width ?? 300;
      const targetHeight = req.body.height ?? 300;

      if (!file) {
        return res.status(400).send('No file uploaded.')
      }

      //add entry to the database {name, originalUrl, resizedUrl}
      //send pub/sub message

      const uploadedFileURL = file.cloudStoragePublicUrl || file.localUrl;

      const {originalname} = file

      const imgId = await db.addImage({
        name:originalname,
        uploadUrl: uploadedFileURL,
        targetWidth,
        targetHeight,
      })

      const msgId = await publishMessage({imgId})

      res.status(200).send({message: 'File uploaded successfully and is being proccesed.', url: uploadedFileURL, imgId, msgId,})
    } catch (error) {
      console.error('Failed to upload/process file:', error)
      res.status(500).send(`Failed to upload file: ${error.message}`)
    }
  });

  app.get('/list', async (req, res) => {
    const images = await db.listImages()
    res.send(JSON.stringify(images))
  })

  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
  });
}

await db.connect()

initApp()



