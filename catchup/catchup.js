import catchup from "./catchup.json" with { type: "json" };
import processPage from "../src/scraper/processPage.js";
import { fstat, writeFileSync } from "fs";

// ==================Run in console
// Array.from(document.querySelectorAll('.penci-entry-title > a'))
//                    .map(el => el.href);

const months = {};

catchup.reverse().forEach((url) => {
  //   const url = catchup[0];
  const year = url.split("/")[3];
  const month = url.split("/")[4];

  const key = `${year}-${month}`;

  months[key] = months[key] ?? [];
  months[key].push(url);
});

for (let [month, urls] of Object.entries(months)) {
  console.log(month);
  const monthData = [];
  for (let url of urls) {
    console.log(url);
    const o = await processPage(url);
    monthData.push(o);
    writeFileSync(
      `./catchup/${month}.json`,
      JSON.stringify(monthData, null, 4)
    );
    await new Promise((p) => setTimeout(p, 1000));
    // process.exit(0);
  }
}
