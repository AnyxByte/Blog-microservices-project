import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, name, image } = req.body;

    if (!email || !name || !image) {
      return res.status(400).json({
        msg: "missing fields",
      });
    }

    let user = await User.findOne({
      email,
    });

    if (!user) {
      user = await User.create({
        email,
        name,
        image,
      });
    }

    const payload = {
      email: user.email,
      name: user.name,
      image: user.image,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "2d",
    });
    return res.status(201).json({
      msg: "login successful",
      user,
      token,
    });
  } catch (error) {
    console.log("error at loginUser", error);

    return res.status(500).json({
      msg: error.message,
    });
  }
};

export const myProfile = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log("error at myProfile", error);

    return res.status(500).json({
      msg: error.message,
    });
  }
};
