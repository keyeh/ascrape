import { exit } from 'process';
import getMonthLinks from './getMonthLinks.js';
import processPage from './processPage.js';
import fs from 'fs';

const pageLinks = await getMonthLinks('..');
// fs.writeFileSync('pageLinks.json', JSON.stringify(pageLinks, null, 4));

let result = [];

for (const [index, link] of pageLinks.entries()) {
    console.log(`Processing ${index + 1} of ${pageLinks.length}`);
    result.push(await processPage(link));
    // await new Promise((r) => setTimeout(r, 1000));
}

fs.writeFileSync('scraped.json', JSON.stringify(result, null, 4));
