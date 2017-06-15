const express = require('express')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const jwt = require('jsonwebtoken')
const config = require('../../../config')

function getRoutes(dbConnection) {

    const user = require('./userOps')(dbConnection)
    let router = express.Router()

    // if authenticated, send token
    router.post('/authenticate', jsonParser, (req, res) => {
        if (!req.body || !req.body.email || !req.body.password) return res.json({ error: 'Provide Correct Information', token: false })

        user.validate(req.body, (err, result) => {
            if (err || !result.isAuth) return res.json({ error: { message: "could not authenticate", fromDb: err }, token: false })

            let token = jwt.sign(result.user, config.secret, {
                expiresIn: "24h"
            })

            return res.json({
                error: null,
                token
            })
        })
    })


    // create user
    router.post('/user', jsonParser, (req, res) => {

        if (!req.body) return res.json({ error: 'Include POST body' })
        if (!req.body.email || typeof req.body.email !== 'string' || req.body.email.indexOf('@') === -1) return res.json({ error: 'Include valid email address' })
        if (!req.body.password || typeof req.body.password !== 'string' || req.body.password.length < 10) return res.json({ error: 'Password invalid' })
        if (!('color' in req.body) || isNaN(parseInt(req.body.color)) || (req.body.color < 0 || req.body.color > 15)) return res.json({ error: 'Include valid color' })
        if (!req.body.username || typeof req.body.username != 'string' || req.body.username < 3) return res.json({ error: 'Include valid username' })

        user.create(req.body, (err, result) => {
            if (err) return res.json({ error: err })

            token = jwt.sign({ id: result.id, username: result.username }, config.secret, {
                expiresIn: "24h"
            })

            return res.json({
                error: null,
                token,
                result: {
                    username: result.username,
                    id: result.id,
                    color: result.color
                }
            })
        })
    })

    return router
}

module.exports = getRoutes