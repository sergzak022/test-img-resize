// pubsub.mjs
import {PubSub} from '@google-cloud/pubsub';

const PUBSUB_KEYFILE = process.env.PUBSUB_KEYFILE; // Path to your GCS JSON key file

// Initialize Google Cloud Pub/Sub with explicit credentials
const pubSubClient = new PubSub({
  keyFilename: PUBSUB_KEYFILE,
});

const TOPIC_NAME = 'projects/resize-415118/topics/image'
const SUBSCRIPTION_NAME = 'projects/resize-415118/subscriptions/image-sub'

async function publishMessage(data) {
    try {
        const message = Buffer.from(JSON.stringify(data));
        return await pubSubClient.topic(TOPIC_NAME).publish(message);
    } catch (error) {
        console.error(`Received error while publishing: ${error.message}`);
        throw error;
    }
}

function listenForMessages(handleMessage) {
    const subscription = pubSubClient.subscription(SUBSCRIPTION_NAME);

    const messageHandler = message => {

        const buffer = Buffer.from(message.data); // Convert data to Buffer if not already
        const messageJson = buffer.toString(); // Convert Buffer to string to get JSON
        const messageObject = JSON.parse(messageJson); // Parse JSON to get the message object
        // Pass the data and a "done" callback to the handler
        handleMessage(messageObject, (err) => {
            if (!err) {
                // If no error, acknowledge the message
                message.ack();
            } else {
                // Log the error, handle it based on your application's requirements
                console.error(err);
                // Here, you can choose to not ack the message to have it redelivered
                // or use message.nack() if you want to explicitly indicate a negative acknowledgment
            }
        });
    };

    subscription.on('message', messageHandler);

    // Return a function to allow unsubscribing
    return () => {
        subscription.removeListener('message', messageHandler);
        console.log(`Unsubscribed from ${SUBSCRIPTION_NAME}`);
    };
}

export {publishMessage, listenForMessages};
