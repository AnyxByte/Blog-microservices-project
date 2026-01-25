import express from "express";
import { loginUser, myProfile } from "../controllers/user.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();

router.post("/login", loginUser);
router.get("/profile", auth, myProfile);

export default router;
