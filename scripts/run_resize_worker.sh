#!/bin/bash

# Get the directory of the script
SCRIPT_DIR=$(dirname "$0")

# Define the paths to the service account files relative to the script's directory
SERVICE_ACCOUNT_FILE_1="$SCRIPT_DIR/../resize-415118-4cbe3b9ae616-pubsub.json"
SERVICE_ACCOUNT_FILE_2="$SCRIPT_DIR/../resize-415118-cca6aaebd900.json"

# Run the Docker container with the paths
docker run --name resize-worker \
           -v "$SERVICE_ACCOUNT_FILE_1:/app/resize-415118-4cbe3b9ae616-pubsub.json" \
           -v "$SERVICE_ACCOUNT_FILE_2:/app/resize-415118-cca6aaebd900.json" \
           -e "MONGODB_URI=REPLACE_WITH_YOURS" \
           -e "PUBSUB_KEYFILE=/app/resize-415118-4cbe3b9ae616-pubsub.json" \
           -e "GCS_KEYFILE=/app/resize-415118-cca6aaebd900.json" \
           resize-worker
