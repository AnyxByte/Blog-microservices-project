import express from "express";
import dotenv from "dotenv";
import blogRoutes from "./routes/blog.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 5002;

app.use(express.json());

app.use("/api/v1", blogRoutes);

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
