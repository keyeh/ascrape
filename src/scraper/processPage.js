import fetch from "./fetch.js";
import * as cheerio from "cheerio";
import * as linkify from "linkifyjs";

export default async function processPage(url, logger = console.log) {
  let images = [];
  let download = "";
  let text = [];
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const html = await response.text();

    const $ = cheerio.load(html);

    images = $("div.post-entry p img")
      .map((i, el) => $(el).attr("src"))
      .toArray();

    download = $("div.post-entry .entry-content > a")
      .map((i, el) => $(el).attr("href"))
      .toArray();
    download = download.concat(
      $("div.post-entry .entry-content p a:not(:has(img))")
        .map(
          (i, el) => $(el).attr("href") || $(el).attr("[rg_fast_access]href")
        )
        .toArray()
    );

    const additionalLinks = linkify
      .find($("div.post-entry .entry-content").text())
      .map((l) => l.href);
    download = download.concat(additionalLinks);

    download = download.filter((s) => {
      for (let u of JSON.parse(process.env.EXCLUDE_DOWNLOAD)) {
        if (s.includes(u)) return false;
      }
      return true;
    });

    text.push($(".post .post-title").text());
    text.push($(".post .post-box-meta-single time").text());
    text.push($(".post .penci-standard-cat").text());

    let tags = [];
    $(".post .post-tags a").map((i, t) => {
      tags.push($(t).text());
    });
    text.push(tags.join(", "));
    text = text.join("\n");
  } catch (error) {
    const err = `Error fetching the page: ${url}`;
    logger(err);
  }

  return { url, images, download, text };
}
