const express = require('express')
const userRoutes = require('./user')
const storyRoutes = require('./story')

module.exports = function (dbConnection) {
    const router = express.Router()

    router.use('/', userRoutes(dbConnection))
    router.use('/', storyRoutes(dbConnection))

    return {
        routes: router
    }

}