import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import getBuffer from "../utils/dataUri.js";

import { v2 as cloudinary } from "cloudinary";

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
      id: user._id,
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

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        msg: "No user with this id",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log("error at getUserProfile", error);

    return res.status(500).json({
      msg: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, instagram, linkedin, bio, facebook } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      {
        name,
        instagram,
        linkedin,
        bio,
        facebook,
      },
      {
        new: true,
      },
    );

    const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
      expiresIn: "3d",
    });

    res.status(200).json({
      msg: "updated successfully",
      user,
      token,
    });
  } catch (error) {
    console.log("error:-", error);
    return res.status(500).json({
      msg: "server error",
    });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        msg: "file not uploaded",
      });
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      return res.status(400).json({
        msg: "failed to generate buffer",
      });
    }

    const cloudImage = await cloudinary.uploader.upload(fileBuffer.content, {
      folder: "BlogMicroService",
    });

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      {
        image: cloudImage.secure_url,
      },
      {
        new: true,
      },
    );

    const token = jwt.sign(
      {
        user,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "2d",
      },
    );
    return res.status(200).json({
      msg: "profile pic updated",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "server error",
    });
  }
};
