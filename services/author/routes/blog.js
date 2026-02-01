import express from "express";
import { auth } from "../middlewares/auth.js";
import { createBlog, updateBlog } from "../controllers/blog.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

router.post("/blog/create", auth, uploadFile, createBlog);
router.post("/blog/update/:id", auth, uploadFile, updateBlog);

export default router;
