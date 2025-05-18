// import mongoose from 'mongoose';

// const connection = {};

// export async function connect() {
//   if (connection.isConnected) return;

//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URL, {
//       dbName: "my-exam-world",
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 30000
//     });
    
//     connection.isConnected = db.connections[0].readyState;
//     console.log(`Connected to MongoDB: ${db.connection.host}`);
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     throw error;
//   }
// }



import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: 'my-exam-world' // Database name specified here
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;