import getMonthLinks from "./getMonthLinks.js";
import processPage from "./processPage.js";
import fs from "fs";
import path from "path";

export default async function scrape(year, month) {
  const logger = (text) => {
    console.log(text);
    const logPath = path.join(process.cwd(), "data", `${year}-${month}.log`);
    fs.promises.appendFile(logPath, `${text}\n`);
  };
  const url = `${process.env.SOURCE_BASE_URL}/${year}/${month}`;
  logger("Start: " + url);
  const pageLinks = await getMonthLinks(url, logger);
  // fs.writeFileSync('pageLinks.json', JSON.stringify(pageLinks, null, 4));

  let result = [];

  for (const [index, link] of pageLinks.entries()) {
    logger(`Processing ${index + 1} of ${pageLinks.length}`);
    result.push(await processPage(link, logger));
  }

  fs.writeFileSync(
    path.join(process.cwd(), "data", `${year}-${month}.json`),
    JSON.stringify(result, null, 4)
  );
}

//scrape("2024", "08");
