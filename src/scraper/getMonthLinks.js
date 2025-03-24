import fetch from "./fetch.js";
import * as cheerio from "cheerio";

export default async function getMonthLinks(url, logger = console.log) {
  const pageLinks = [];

  let currentPage = 0;
  let pageCount = 1;
  try {
    while (currentPage++ !== pageCount) {
      const fullURL = `${url}/page/${currentPage}`;
      logger(fullURL);
      const response = await fetch(fullURL);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const html = await response.text();
      // const html = fs.readFileSync('./month.html', 'utf8');

      const $ = cheerio.load(html);

      pageCount = $(".wp-pagenavi > .pages")
        .text()
        .replace("Page ", "")
        .split(" of ")
        .map(Number)[1];

      const newLinks = $("#content > .freepostbox > h2 > a")
        .map((i, el) => $(el).attr("href"))
        .toArray();

      pageLinks.push(...newLinks);
    }
    return pageLinks;
  } catch (error) {
    logger(`Error fetching the page: ${error}`);
  }
  return [];
}
