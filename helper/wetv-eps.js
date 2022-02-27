const puppeteer = require('puppeteer');
let fetch = (...args) => import('node-fetch').then(({
    default: f
}) => f(...args)).catch(console.log)

async function helper(search) {
    let _search = decodeURIComponent(search)
    // let _a = await fetch(`${require('../service.json').url}}/wetv/search?q=` + encodeURIComponent(_search))
    let _a = await require('./wetv-search')(search);
    // _a = await _a.json()
    // _a = _a.result
    _a = _a.filter(v => new RegExp(_search.toLowerCase()).test(v.title.toLowerCase()))[0]
    _a = _a.links
    const browser = await puppeteer.launch({
        headless: true,
        // headless: false,
        ignoreHTTPSErrors: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--aggressive-cache-discard',
            '--disable-cache',
            '--disable-application-cache',
            '--disk-cache-size=0'
        ]
    });
    const page = await browser.newPage();
    // await page.setRequestInterception(true);
    // page.on('request', (request) => {
    //         // Block All Images
    //         if (request.url().endsWith('.png') || request.url().endsWith('.jpg') || request.url().endsWith('css') || request.url().endsWith('mp4')) {
    //             request.continue()
    //         } else {
    //             request.abort();
    //         }
    //     });
    await page.goto(_a[0], {
        waitUntil: ['networkidle2'],
        timeout: 0,
    })
    await page.reload()
    let items = await page.evaluate(() => {
        let list = []
        document.querySelectorAll('.play-relevant__item').forEach(item => {
            let link = item.querySelector('.play-relevant__link').getAttribute('href')
            // let poster = item.querySelector('.play-relevant__poster > span > img').getAttribute('src')
            let title = item.querySelector('.play-relevant__title').innerText
            let data = {
                link: 'https://wetv.vip' + link,
                title: title,
                // thumbnail: poster
            }
            if (/(ep|EP)[0-9]/.test(data.title)) {
                list.push(data)
            }
        })
        return list
    })
    await browser.close()
    return items
}
module.exports = helper