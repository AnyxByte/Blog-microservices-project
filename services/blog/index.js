import express from "express";
import dotenv from "dotenv";
import blogRoutes from "./routes/blog.js";
import { createClient } from "redis";

const app = express();
dotenv.config();
const port = process.env.PORT || 5002;

app.use(express.json());

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient
  .connect()
  .then(() => {
    console.log("connected to redis");
  })
  .catch((err) => {
    console.log("error connecting to redis:-", err);
  });

app.use("/api/v1", blogRoutes);

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
