import mongoose from "mongoose";

export async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "BlogMicroService",
    });
    console.log("connected to db");
  } catch (error) {
    console.log("error connecting to db: ", error);
  }
}
