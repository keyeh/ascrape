"use server";
import fs from "fs";
import path from "path";
import scrape from "../../../../scraper";

export async function getLog(fileName: string) {
  let posts = [];

  const filePath = path.join(process.cwd(), "data", fileName); // Adjust directory as needed
  try {
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    return fileContent;
  } catch (error) {
    return "Error reading file: " + error.message;
  }
}

export async function clearLog(fileName: string) {
  const filePath = path.join(process.cwd(), "data", fileName); // Adjust directory as needed
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {}
}

export async function scrapeIt(year: string, month: string) {
  scrape(year, month);
}
