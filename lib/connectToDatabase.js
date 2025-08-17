import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return { db: cachedDb };
  }

  try {
    await client.connect();
    cachedDb = client.db("2funDB");
    return { db: cachedDb };
  } catch (error) {
    throw new Error("Failed to connect to the database");
  }
}
