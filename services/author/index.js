import express from "express";
import dotenv from "dotenv";

import { v2 as cloudinary } from "cloudinary";
import { sql } from "./utils/db.js";
import blogRouter from "./routes/blog.js";
import initDb from "./utils/initDb.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 5001;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

await initDb();

app.use("/api/v1", blogRouter);

app.listen(port, () => {
  console.log(`server started at ${port}`);
});
