import express from "express";
import { auth } from "../middlewares/auth.js";
import { createBlog } from "../controllers/blog.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

router.post("/blog/create", auth, uploadFile, createBlog);

export default router;
