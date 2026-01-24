import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    instagram: String,
    facebook: String,
    linkedin: String,
    bio: String,
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("blogUsers", userSchema);
