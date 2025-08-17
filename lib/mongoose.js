import mongoose from "mongoose";

export async function mongooseConnect() {
  if (mongoose.connections[0].readyState) {
    return; // If already connected, skip
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected:", connection.connections[0].host);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}


// import mongoose from "mongoose";

// export async function mongooseConnect() {
//   if (mongoose.connection.readyState === 1) {
//     return;
//   }

//   const uri = process.env.MONGODB_URI;
//   if (!uri) throw new Error("MONGODB_URI not set");

//   return mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// }

// import mongoose from "mongoose";

// export function mongooseConnect() {
//   if (mongoose.connection.readyState === 1) {
//     return mongoose.connection.asPromise();
//   } else {
//     const uri = process.env.MONGODB_URI;
//     return mongoose.connect(uri);
//   }
// }