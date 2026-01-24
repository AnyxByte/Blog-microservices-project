import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./utils/db.js";
import userRouter from "./routes/user.js";

const app = express();

dotenv.config();
const port = process.env.PORT || 5000;

await connectDb();

app.use(express.json());

app.get("/test", (req, res) => {
  return res.status(200).json({
    msg: "test",
  });
});

app.use("/api/v1", userRouter);

app.listen(port, () => {
  console.log(`server started on http://localhost:${port}`);
});
