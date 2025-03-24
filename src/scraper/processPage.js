import fetch from "./fetch.js";
import * as cheerio from "cheerio";
import fs from "fs";
import { convert } from "html-to-text";

export default async function processPage(url, logger = console.log) {
  let images = [];
  let download = "";
  let text = "";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const html = await response.text();

    const $ = cheerio.load(html);

    images = $(
      "div#outerwrapper div.wrap div#singlecont div.round-border-box div.videosection img"
    )
      .map((i, el) => $(el).attr("src"))
      .toArray();

    download = $(
      "div#outerwrapper div.wrap div#singlecont div.round-border-box div.videosection div a"
    )
      .map((i, el) => $(el).attr("href"))
      .toArray()
      .filter((s) => s.includes("rapidgator.net/"))
      .filter((s) => !s.includes("rapidgator.net/article/premium/"));

    text = $(
      "div#outerwrapper div.wrap div#singlecont div.round-border-box div.videosection .textsection"
    ).html();
    text = convert(text, {
      selectors: [{ selector: "a", options: { ignoreHref: true } }],
    });
    text = text.replace(/[\n]+/g, "\n");
  } catch (error) {
    const err = `Error fetching the page: ${url}`;
    logger(err);
  }

  return { url, images, download, text };
}
