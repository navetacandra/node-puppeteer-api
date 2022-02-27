const { Brainly } = require("brainly-scraper-v2");
const brain = new Brainly("id"); // 'id' - Default to 'id'

async function helper(lang = 'id', q) {
    let fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)).catch(console.log)
    let _res = await fetch(`https://puppeteer-manager.puppeteernaveta.repl.co/brainly?q=${encodeURIComponent(q)}`)
    let res = (await _res.json()).result
    return res
}

module.exports = helper