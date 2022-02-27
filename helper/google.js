const cheerio = require('cheerio');
const rp = require('request-promise');

async function helper(search) {
    let _html = await rp(`https://google.com/search?q=${encodeURIComponent(search)}`);
    let $ = cheerio.load(_html);
    let link = [];
    let title = [];
    let desc = [];
    $('div[class="yuRUbf"] > a').each((i, el) => {
        link.push(el.attr('href'))
    })
    console.log(link);
}