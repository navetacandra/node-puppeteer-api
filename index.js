const express = require('express');
const fs = require('fs')
const attp = require('./helper/attp');
const ttp = require('./helper/ttp');
const ssweb = require('./helper/ssweb');
const jadwalsholat = require('./helper/jadwalsholat');
const brainly = require('./helper/brainly');
const tinyurl = require('./helper/tinyurl');
const bitly = require('./helper/bitly');
const wetv = require('./helper/wetv-search');
const wetvEps = require('./helper/wetv-eps');
const timeout = require('connect-timeout');
const path = require('path')
const http = require('http')
const fetch = (...args) => import('node-fetch').then(({
    default: f
}) => f(...args)).catch(console.log)

const app = express();
let port = process.env.PORT || 443

require('./uptime-handler')(app)
app.use((req, res, next) => {
    console.log('Request from :', req.socket.remoteAddress.split(':')[0].split(',')[0] || '');
    next()
})
app.use(timeout('3600s'));

// app.use((req, res, next) => {
//     if (req.path !== '/') {
//         let params = Object.keys(req.query)
//         let _p = []
//         let _param = {}
//         params.forEach(el => {
//             _p.push(el.toLowerCase())
//             _param[el.toLowerCase()] = req.query[el]
//         });
//         if (!_p.includes('apikey') || !_param.apikey) {
//             res.json({
//                 status: "error",
//                 message: "No apikey stored"
//             })
//         } else {
//             next()
//         }
//     }
// })

app.get('/attp', async function (req, res) {
    const text = decodeURIComponent(req.query['text']);
    let _base64 = await attp(text);
    await res.json({
        status: "success",
        result: _base64
    })
});

app.get('/ttp', async function (req, res) {
    const text = decodeURIComponent(req.query['text']);
    let _base64 = await ttp(text);
    await res.json({
        status: "success",
        result: _base64
    })
});

app.get('/ssweb', async function (req, res) {
    const url = decodeURIComponent(req.query['url']);
    const json = Object.keys(req.query).includes('json');
    if (Object.keys(req.query).includes('url') && req.query['url']) {
        http.get({
            method: 'HEAD',
            host: url.replace(/https?:\/\//, '').split('/')[0]
        }).on('error', err => {
            res.json({
                status: 'error',
                message: err.message
            })
        }).on('finish', async () => {
            let _file = path.resolve(`./src/ss-${req.socket.remoteAddress.split(':')[0].split(',')[0] || ''}.jpg`)
            let link = /https?:\/\//.test(url) ? url : 'http://' + url
            try {
                await ssweb(link, _file)
                if (!json) {
                    res.sendFile(_file)
                } else {
                    res.json({
                        status: 'suuccess',
                        base64: fs.readFileSync(_file, 'base64'),
                        url: 'data:image/jpeg;base64,' + fs.readFileSync(_file, 'base64')
                    })
                }
            } catch (err) {
                res.json({
                    status: 'error',
                    error: err.toString()
                })
            }
        })
    } else {
        res.json({
            status: "error",
            message: 'Parameter url not defined',
            hint: '/ssweb?url=https://example.com'
        })
    }
});

app.get('/jadwalsholat', async function (req, res) {
    req.setTimeout(0)
    const city = decodeURIComponent(req.query['kota']);
    // const result = await jadwalsholat(city)
    if (Object.keys(req.query).includes('kota') && req.query['kota'] && await jadwalsholat(city) !== undefined) {
        res.json({
            status: "success",
            result: await jadwalsholat(city)
        })
    } else {
        res.json({
            status: "error",
            message: "Mohon isi parameter kota!"
        })
    }
})

app.get('/brainly', async function (req, res) {
    req.setTimeout(0)
    const lang = decodeURIComponent(req.query['lang']) === ("undefined" || "null") ? 'id' : decodeURIComponent(req.query['lang']);
    const search = decodeURIComponent(req.query['search']);
    const result = await brainly(lang, search)
    if (Object.keys(req.query).includes('search') && req.query['search']) {
        if (result.length > 0) {
            res.json({
                status: "success",
                result: result
            })
        } else {
            res.json({
                status: "error",
                message: "Pencarian tidak dapat ditemukan"
            })
        }
    } else {
        res.json({
            status: "error",
            message: "Mohon isi pencarian!"
        })
    }
})


app.get('/tinyurl', async function (req, res) {
    req.setTimeout(0)
    const url = decodeURIComponent(req.query['url']);
    const result = await tinyurl(url)
    if (Object.keys(req.query).includes('url') && req.query['url']) {
        res.json({
            status: "success",
            result: result.join('')
        })
    } else {
        res.json({
            status: "error",
            message: "Mohon isi parameter!",
            hint: "?url=https://google.com"
        })
    }
})

app.get('/bitly', async function (req, res) {
    req.setTimeout(0)
    req.setTimeout(1000 * 3600)
    const url = req.query['url'];
    if (Object.keys(req.query).includes('url') && req.query['url']) {
        const result = await bitly(decodeURIComponent(url))
        if (result === "") {
            res.json({
                status: "error",
                message: "Link tidak dapat di-konversi!"
            })
        } else {
            res.json({
                status: "success",
                result: result
            })
        }
    } else {
        res.json({
            status: "error",
            message: "Mohon isi parameter url!",
            hint: "/bitly?url=https://google.com"
        })
    }
})

app.get('/wetv/search', async function (req, res) {
    req.setTimeout(0)
    if (Object.keys(req.query).includes('q') && req.query['q']) {
        let result = await wetv(req.query.q)
        if (result.length > 0) {
            res.json({
                status: "success",
                search: decodeURIComponent(req.query.q),
                result: result
            })
        } else {
            res.json({
                status: "error",
                message: "An error when search"
            })
        }
    } else {
        res.json({
            status: "error",
            message: "Mohon isi parameter q!"
        })
    }
})

app.get('/wetv/eps', async function (req, res) {
    req.setTimeout(0)
    if (Object.keys(req.query).includes('title') && req.query['title']) {
        let result = await wetvEps(req.query.title)
        if (result.length > 0) {
            res.json({
                status: "success",
                search: decodeURIComponent(req.query.title),
                result: result
            })
        } else {
            res.json({
                status: "error",
                message: "An error when search"
            })
        }
    } else {
        res.json({
            status: "error",
            message: "Mohon isi parameter q!"
        })
    }
})

app.listen(port, async () => {
    console.log(`Running on ${port}`);
}) 

fetch(`https://puppeteer-manager.puppeteernaveta.repl.co/setcurrent-puppeteer?active=${require('./service.json').code}`)
    .then(res => {
        res.json()
    }).then(e => console.log(e))