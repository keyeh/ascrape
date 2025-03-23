import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";

export default async function PickerRedirect({
  params,
}: {
  params: Promise<{ fileName: string }>;
}) {
  const { fileName } = await params;
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

  const lastPickedIndex = posts
    .map((post) => post.picked !== undefined)
    .lastIndexOf(true);

  redirect(`${fileName}/${Math.max(0, lastPickedIndex)}`);
}
