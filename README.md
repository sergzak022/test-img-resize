You can run node with this flag to import es6 modules like this `var db = await import('./db.mjs');`
`node --experimental-repl-await`


TODO:

API

1. Connect API to GCS [DONE]
2. Connect API to Mongodb [DONE]
3. Connect API to Pub/Sub [PROGRESS]
4. Create Docker container for API and deploy to Google Cloud Run [DONE]
    - Create cotainer [DONE]
    - Mount service account files [DONE]
    - Deploy container to docker [DONE]
    - Create Kubernetes deployemnt [DONE]
    - Provide service account files to Kubernetes [DONE]

docker build -f ./api/Dockerfile -t resize-api .

docker run -v "./resize-415118-4cbe3b9ae616-pubsub.json:/app/resize-415118-4cbe3b9ae616-pubsub.json" -v "./resize-415118-cca6aaebd900.json:/app/resize-415118-cca6aaebd900.json" resize-api

Resize

5. Create resize service [DONE]
6. Connect GCS, Mongodb, Pub/Sub to resize service [DONE]
7. Create Docker container for resize worker and deploy to Google Cloud Run [DONE]

kubectl create secret generic service-account-pubsub-secret --from-file=resize-415118-4cbe3b9ae616-pubsub.json=/path/to/file/on/host

kubectl create secret generic service-account-gcs-secret --from-file=resize-415118-cca6aaebd900.json=/path/to/file/on/host

kubectl create secret generic mongodb-uri-secret --from-literal=mongodb_uri='YOUR_URL'

More TODO

1. gcs-file.mjs needs GCS_BUCKET_NAME and GCS_PROJECT_ID env vars. They were hardcoded. Need to pass to docker run command and to kubernetes containers as secrets

