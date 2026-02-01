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
    console.log("create blog error:-", error);

    return res.status(500).json({
      msg: "server error",
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const id = req.params.id;

    const { title, description, blogContent, category } = req.body;
    const file = req.file;

    const blog = await sql`SELECT * FROM blogs WHERE id = ${id}`;

    if (!blog.length) {
      return res.status(400).json({
        msg: "No blog found",
      });
    }

    if (blog[0].author !== req.user?.id) {
      return res.status(400).json({
        msg: "unauthorized",
      });
    }

    let imageUrl = blog[0].image;

    if (file) {
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

      imageUrl = cloudBlogImage.secure_url;
    }

    const updates = [];
    const values = [];
    let idx = 1;

    if (title !== undefined) {
      updates.push(`title = $${idx++}`);
      values.push(title);
    }

    if (description !== undefined) {
      updates.push(`description = $${idx++}`);
      values.push(description);
    }

    if (imageUrl !== undefined) {
      updates.push(`image = $${idx++}`);
      values.push(imageUrl);
    }

    if (blogContent !== undefined) {
      updates.push(`blogContent = $${idx++}`);
      values.push(blogContent);
    }

    if (category !== undefined) {
      updates.push(`category = $${idx++}`);
      values.push(category);
    }

    values.push(id);

    if (updates.length === 0) {
      return res.status(400).json({ msg: "Nothing to update" });
    }

    const updatedBlog = await sql.query(
      `UPDATE blogs SET ${updates.join(", ")}
      WHERE id = $${idx} RETURNING *`,
      values,
    );

    return res.status(200).json({
      msg: "blog updated",
      blog: updatedBlog,
    });
  } catch (error) {
    console.log("update blog error:-", error);

    return res.status(500).json({
      msg: "server error",
    });
  }
};
