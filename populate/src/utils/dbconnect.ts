import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

type MongoDBCon = {
  conn: null | mongoose.Mongoose;
  promise: null | Promise<mongoose.Mongoose>;
};
declare global {
  var mongoose: undefined | MongoDBCon;
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}
const cached = global.mongoose;

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error("Missing MongoDB URI in environment variables");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log(
      "Connected to database:",
      cached.conn.connection.db?.databaseName,
    );
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
