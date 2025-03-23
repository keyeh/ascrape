import fs from "fs";
import path from "path";
// import {  useState } from "react";
// import "./page.css";
import { redirect } from "next/navigation";
export default async function PickedPage({
  params,
}: {
  params: Promise<{ fileName: string }>;
}) {
  let { fileName } = await params;
  let posts = [];

  if (fileName) {
    const filePath = path.join(process.cwd(), "data", fileName); // Adjust directory as needed
    try {
      const fileContent = await fs.promises.readFile(filePath, "utf-8");
      posts = JSON.parse(fileContent);
    } catch (error) {
      throw new Error("Error reading file: " + error.message);
    }
  }

  return (
    <pre>
      {posts
        .filter((post) => post.picked)
        .map((post) => post.download)
        .join("\n")}
    </pre>
  );
}
