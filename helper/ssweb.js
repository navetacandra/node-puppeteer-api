const puppeteer = require('puppeteer');

async function helper(url, id) {
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
        ],
        product: 'chrome'
    });
    const page = await browser.newPage();

    await page.setViewport({
        width: 2048,
        height: 1080,
        isLandscape: true
    })

    await page.goto(url, {
        waitUntil: ['networkidle2'],
        timeout: 0,
    });

    await page.screenshot({
        type: 'jpeg',
        path: `${id}`
    });

    console.log(`${id}`);
    await browser.close();
}

module.exports = helper