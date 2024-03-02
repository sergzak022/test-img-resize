import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;

// Database and Collection names
const dbName = 'imageProcessingDB';
const collectionName = 'images';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export async function connect() {
  await client.connect();
  console.log('Connected to MongoDB');
}

export async function addImage(imageData) {
  const collection = client.db(dbName).collection(collectionName);
  const {insertedId} = await collection.insertOne(imageData);
  return insertedId
}

export async function updateImage(imageId, updateData) {
  const collection = client.db(dbName).collection(collectionName);
  const id = new ObjectId(imageId);
  const result = await collection.updateOne({ _id: id }, { $set: updateData });
}

export async function listImages() {
  const collection = client.db(dbName).collection(collectionName);
  const images = await collection.find({}).toArray();
  return images;
}

// Fetches an image by its ID
export async function getImage(imageId) {
  const collection = client.db(dbName).collection(collectionName);
  // Convert string ID to ObjectId for MongoDB query
  const id = new ObjectId(imageId);
  const image = await collection.findOne({ _id: id });
  return image;
}

export async function removeAllImages() {
  const collection = client.db(dbName).collection(collectionName);
  const result = await collection.deleteMany({}); // Empty filter object to match all documents
  console.log(`${result.deletedCount} images were deleted.`);
  return result.deletedCount;
}
