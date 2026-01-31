import getBuffer from "../utils/dataUri.js";
import { v2 as cloudinary } from "cloudinary";
import { sql } from "../utils/db.js";

export const createBlog = async (req, res) => {
  try {
    const { title, description, blogContent, category } = req.body;
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

    const cloudBlogImage = await cloudinary.uploader.upload(
      fileBuffer.content,
      {
        folder: "BlogMicroService",
      },
    );

    const result =
      await sql`INSERT INTO blogs (title , description, image , blogContent , category , author) VALUES 
    (${title} , ${description} , ${cloudBlogImage.secure_url} , ${blogContent} , ${category} , ${req.user?.id}) RETURNING *`;

    return res.status(201).json({
      msg: "blog created",
      blog: result[0],
    });
  } catch (error) {
    return res.status(500).json({
      msg: "server error",
    });
  }
};
