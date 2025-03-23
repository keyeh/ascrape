import fetch from './fetch.js';
import * as cheerio from 'cheerio';

export default async function getMonthLinks(url) {
    const pageLinks = [];

    let currentPage = 0;
    let pageCount = 1;
    try {
        while (currentPage++ !== pageCount) {
            console.log('page', currentPage);
            const response = await fetch(`${url}/page/${currentPage}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            const html = await response.text();
            // const html = fs.readFileSync('./month.html', 'utf8');

            const $ = cheerio.load(html);

            pageCount = $('.wp-pagenavi > .pages').text().replace('Page ', '').split(' of ').map(Number)[1];

            const newLinks = $('#content > .freepostbox > h2 > a')
                .map((i, el) => $(el).attr('href'))
                .toArray();

            pageLinks.push(...newLinks);
        }
    } catch (error) {
        console.error('Error fetching the page:', error);
    }
    return pageLinks;
}
