import { sql } from "../utils/db.js";

export const getAllBlogs = async (req, res) => {
  try {
    let blogs;
    blogs = await sql`SELECT * FROM blogs ORDER BY created_at DESC`;

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
