const r = require('rethinkdb')
const express = require('express')
const morgan = require('morgan')
const utils = require('./utils')
const config = require('./config')
const routes = require('./routes')

const app = express()

app.use(morgan('dev'))

r.connect(config.db, (err, connection) => {
    if (err) throw err

    connection.use('story_time')
    routes(app, connection)
})

app.listen(8081, () => console.log('listening on 8081'))





