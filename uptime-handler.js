const {v4: uuidv4} = require('uuid')
const fetch = (...args) => import('node-fetch').then(({default:f}) => f(...args)).catch(console.log)
let path = `/uptime-manager`

module.exports = function (app) {
    app.get(path, (req, res) => {
        res.send(200)
    })
    setInterval(() => {
        fetch(`${require('./service.json').url}/uptime-manager`)
    }, 30000);
}