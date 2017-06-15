const jwt = require('jsonwebtoken')
const config = require('../../config')

module.exports = function (req, res, next) {
    var token = req.headers['x-access-token']

    if (token) {
        jwt.verify(token, config.secret, (err, decodedToken) => {
            if (err) {
                console.log('err at verify')
                return res.json({error: "not authenticated"})
            } else {
                req.tokenInfo = decodedToken
                console.log('verified')
                next()
            }
        })
    } else {
        console.log('no token')
        res.status(403).json({error: "no authentication token"})
    }
}