import { sql } from "../utils/db.js";
import axios, { AxiosHeaders } from "axios";
import { redisClient } from "../index.js";

export const getAllBlogs = async (req, res) => {
  try {
    const { searchQuery = "", category = "" } = req.query;
    let blogs;

    const cachedKey = `blogs:${searchQuery}:${category}`;

    const cached = await redisClient.get(cachedKey);

    if (cached) {
      const parsedData = JSON.parse(cached);
      return res.status(200).json(parsedData);
    }

    if (searchQuery && category) {
      blogs =
        await sql`SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"})
        AND category = ${category}
        ORDER BY created_at DESC`;
    } else if (searchQuery) {
      blogs =
        await sql`SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"})
        ORDER BY created_at DESC`;
    } else {
      blogs = await sql`SELECT * FROM blogs ORDER BY created_at DESC`;
    }

    await redisClient.setEx(cachedKey, 60, blogs);

    return res.status(200).json({
      blogs,
    });
  } catch (error) {
    console.log("getallblogs error:-", error);

    return res.status(500).json({
      msg: "server error",
    });
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        msg: "missing id",
      });
    }

    const blog = await sql`SELECT * FROM  blogs WHERE id = ${req.params.id}`;

    const userServiceUrl = process.env.USER_SERVICE;
    const authorId = blog[0].author;

    const authHeaders = req.headers.authorization;
    const token = authHeaders.split(" ")[1];

    const response = await axios.get(
      `${userServiceUrl}/api/v1/user/${authorId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.status(200).json({
      blog: blog[0],
      author: response.data.user,
    });
  } catch (error) {
    console.log("getSingleBlog error:-", error);

    return res.status(500).json({
      msg: "server error",
    });
  }
};
