import express from "express";
import dotenv from "dotenv";
import { sql } from "./utils/db.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 5001;

async function initDb() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS blogs(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    blogContent TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    await sql`CREATE TABLE IF NOT EXISTS comments(
    id SERIAL PRIMARY KEY,
    comment VARCHAR(255) NOT NULL,
    userid VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    blogid VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    await sql`CREATE TABLE IF NOT EXISTS savedBlogs(
    id SERIAL PRIMARY KEY,
    userid VARCHAR(255) NOT NULL,
    blogid VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    console.log("database initialized successfully");
  } catch (error) {
    console.log("initDb error->", error);
  }
}

await initDb();

app.listen(port, () => {
  console.log(`server started at ${port}`);
});
