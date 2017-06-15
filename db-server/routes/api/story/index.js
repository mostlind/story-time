const express = require('express')
const isAuthenticated = require('../../auth-middleware')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

// TODO: Add in proper status codes, be more thoughtful about return types

function getRoutes (dbConnection) {
    const story = require('./storyOps')(dbConnection)
    const router = express.Router()

// ----------------------------------------------------------------------------
//  insert story root
// ----------------------------------------------------------------------------

    router.post('/story', isAuthenticated, jsonParser, function (req, res) {
        if (!req.body) res.send({error: "No request body", result: null})

        if (!('title' in req.body) || typeof req.body.title !== 'string' || req.body.title.length > 50) {
            console.log(req.body.title)
            return res.json({error: "Invalid Title", result: null})
        }

        if (!('content' in req.body) || typeof req.body.content !== 'string' || req.body.content.length > 500) {
            return res.json({error: "Invalid Content", result: null})
        }

        story.create(req.body, (error, dbResponse) => {
            res.json({
                message: error ? "Couldn't create story" : "story created",
                error,
                result: error ? null : dbResponse
            })
        })
    })

// ----------------------------------------------------------------------------
//  get all chapters for story up to 'id', where 'id' is last chapter
// ----------------------------------------------------------------------------

    router.get('/story/:id', function (req, res) {
        story.get(req.params.id, (error, chapters) => {
            res.json({
                error,
                result: error ? null : chapters
            })
        })     
    })

// ----------------------------------------------------------------------------
//  add chapter to story update parent
// ----------------------------------------------------------------------------

    router.post('/chapter', jsonParser, isAuthenticated, function (req, res) {
        if (!req.body) res.send({err: "No request body", id: null})

        console.log(req.body)

        if (!('title' in req.body) || typeof req.body.title !== 'string' || req.body.title.length > 50) {
            return res.json({error: "Invalid Title", id: null})
        }

        if (!('content' in req.body) || typeof req.body.content !== 'string' || req.body.content.length > 500) {
            return res.json({error: "Invalid Content", id: null})
        }

        if (!('id' in req.body)) {
            return res.json({error: "Previous Chapter ID Required"})
        }

        story.addChapter(req.body, (error, result) => {
            res.json({
                error,
                result: error ? null : result
            })
        })
    })

    return router
}

module.exports = getRoutes
