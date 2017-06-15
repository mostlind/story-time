const subdomain = require('express-subdomain')

function accessControl (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Access-Token')

    next()
}

module.exports = function (app, dbConnection) {
    const api = require('./api')(dbConnection)

    app.use(accessControl)
    app.use(subdomain('api', api.routes))
}