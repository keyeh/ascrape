"use server";
import fs from "fs";
import path from "path";

export async function getPosts(fileName: string) {
  let posts = [];

  const filePath = path.join(process.cwd(), "data", fileName); // Adjust directory as needed
  try {
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    posts = JSON.parse(fileContent);
  } catch (error) {
    throw new Error("Error reading file: " + error.message);
  }

  return posts;
}

export async function writePosts(fileName: string, newPosts: any[]) {
  const filePath = path.join(process.cwd(), "data", fileName); // Adjust directory as needed
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(newPosts, null, 4));
  } catch (error) {
    throw new Error("Error writing file: " + error.message);
  }
}
