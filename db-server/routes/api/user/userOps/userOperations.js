const r = require('rethinkdb')
const bcrypt = require('bcrypt')
const sp =  require('secure-password')
const pwd = require('secure-password')() // TODO: Use this to hash passwords
const saltRounds = 10

function generateCreateUser(dbConnection) {
    return function createUser (userInfo, callback) {

        console.log('in create user')

        pwd.hash(Buffer.from(userInfo.password), (err, hash) => {
            console.log('in hash')
            if (err) callback(err)

            r.table('users').insert({
                username: userInfo.username,
                email: userInfo.email,
                color: userInfo.color,
                password: hash,
                posts: []
            }).do((resultObj) => {
                return r.table('map_email_userid').insert({
                    email: userInfo.email,
                    userID: resultObj('generated_keys')(0)
                }).do(() => r.table('users').get(resultObj('generated_keys')(0)))
            }).run(dbConnection, (error, result) => {
                if (error || result.errors > 0) callback({message: "Could not create user: email already used", error, result})

                callback(null, result)
            })
        })
    }
}

function generateValidateUser(dbConnection) {

    // TODO: provide more descriptive error messages, e.g. Could not find user OR wrong password
    return function validateUser (userInfo, callback) {

        console.log('start validate user')

        let email = userInfo.email.split('@')
        email[1] = email[1].toLowerCase()
        email = email.join('@')

        r.table('map_email_userid').get(email).do((resultObj) => {
            return r.table('users').get(resultObj('userID'))
        }).run(dbConnection, (err, result) => {
            
            if (err) {
                err.message = 'could not find user'
                return callback(err)
            }

            console.log('found user')
            console.log('user info', userInfo,'result',  result)
            pwd.verify(Buffer.from(userInfo.password), Buffer.from(result.password), function (err, hashResult) {
                if (err) callback(err)

                console.log('checked password')

                if (hashResult === sp.INVALID) {
                    console.log('invalid password')
                    return callback(null, {isAuth: false})
                }
                if (hashResult === sp.VALID) {
                    console.log('valid password')
                    return callback(null, {isAuth: true, user: { id: result.id, username: result.username }})
                }
                if (hashResult === sp.VALID_NEEDS_REHASH) {
                    pwd.hash(Buffer.from(userInfo.password), function (err, newHash) {
                        if (err) return callback(null, {isAuth: true, user: { id: result.id, username: result.username }})
                        r.table('users').get(result.id).update({password: newHash.toString()})
                            .run(dbConnection, function (err, ok) {
                                // maybe do something here
                                callback(null, {isAuth: true, user: { id: result.id, username: result.username }})
                            })
                    })
                }

                callback(null, {isAuth: isAuth, user: { id: result.id, username: result.username } } )

            })
        })
    } 
}

function generateGetUser(dbConnection) {
    return function getUserById (userId, callback) {
        
    }
}

function generateUpdateUser(dbConnection) {

    // for username changes, also update 'map_email_userid'

    return function updateUser (updateInfo, callback) {
        
    }
}

module.exports = {
    generateCreateUser,
    generateValidateUser,
    generateGetUser,
    generateUpdateUser,
}