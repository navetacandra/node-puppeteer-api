const puppeteer = require('puppeteer');

async function helper(search) {
    let url = `https://wetv.vip/search?q=${encodeURIComponent(search).replace(/\%20/g, '+')}`
    const browser = await puppeteer.launch({
        headless: true,
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
    await page.setRequestInterception(true);
    await page.on('request', (request) => {
        // Block All Images
        if (request.url().endsWith('.png') || request.url().endsWith('.jpg') || request.url().endsWith('css') || request.url().endsWith('mp4')) {
            request.abort();
        } else {
            request.continue()
        }
    });
    await page.goto(url, {
        waitUntil: ['networkidle2'],
        timeout: 0,
    })
    await page.reload()
    let items = await page.evaluate(() => {
        let list = []
        document.querySelectorAll('div[class="search-result__item"]').forEach(item => {
            let link = item.querySelectorAll('.search-result__info .search-result__link')
            let _links = [];
            link.forEach(v => {
                _links.push('https://wetv.vip' + v.getAttribute('href'))
            })
            let data = {
                title: item.querySelector('.search-result__info .search-result__title [_trans="true"]').innerText,
                links: _links
            }
            list.push(data)
        })
        return list
    })
    await browser.close()
    return items
}

module.exports = helper