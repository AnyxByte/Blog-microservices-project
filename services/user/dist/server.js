import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import userRoutes from "./routes/user.js";
const app = express();
dotenv.config();
const port = process.env.PORT;
app.use("/api/v1", userRoutes);
await connectDb();
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map