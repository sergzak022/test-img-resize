import { publishMessage, listenForMessages } from './pubsub.mjs';

// A test message payload
const testMessage = { message: 'Test message', foo: 'bar' };

// Function to test message publishing
async function testPublish() {
  try {
    console.log('Publishing message...');
    const messageId = await publishMessage(testMessage);
    console.log(`Message published with ID: ${messageId}`);
  } catch (error) {
    console.error('Failed to publish message:', error);
  }
}

// Function to test message subscription
function testSubscribe() {
  try {
    console.log('Subscribing to topic...');
    const unsubscribe = listenForMessages((data, done) => {
      // Assume message.data is a Buffer object containing the JSON representation of the message
      console.log(`Received message: ${data.foo}`);
      done();
    });

    // Call this function to stop listening for messages
    // Typically you might call this after some timeout or in a cleanup function
    // unsubscribe();
  } catch (error) {
    console.error('Failed to subscribe:', error);
  }
}

// Run the test functions
testPublish();
testSubscribe();
