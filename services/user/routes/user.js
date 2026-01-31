import express from "express";
import {
  getUserProfile,
  loginUser,
  myProfile,
  updateProfilePic,
  updateUser,
} from "../controllers/user.js";
import { auth } from "../middlewares/auth.js";
import uploadFile from "../middlewares/multer.js";
const router = express.Router();

router.post("/login", loginUser);
router.get("/profile", auth, myProfile);
router.get("/user/:id", auth, getUserProfile);
router.post("/user/update", auth, updateUser);
router.post("/user/update/pic", auth, uploadFile, updateProfilePic);

export default router;
