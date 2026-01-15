//  node --env-file=.env ./repair/repair.js
import processPage from "../src/scraper/processPage.js";
import { readFileSync, writeFileSync } from "fs";

const filenames = ["2025-08", "2025-09", "2025-10", "2025-11", "2025-12"];

for (let filename of filenames) {
  var monthjson = JSON.parse(readFileSync(`./repair/${filename}.json`, "utf8"));
  let newFound = 0;
  // let post = monthjson[257];
  for (let post of monthjson) {
    newFound -= post.download.length;
    const o = await processPage(post.url);
    newFound += o.download.length;
    post.download = o.download;
    if (!post.download.length) {
      console.log("No download found!", post.url, post.download);
      // process.exit(1);
    }
  }
  console.log("found additional downloads:", newFound);

  writeFileSync(
    `./repair/${filename}_v2.json`,
    JSON.stringify(monthjson, null, 4)
  );
}
