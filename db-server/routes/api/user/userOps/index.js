const userOperations = require('./userOperations')

module.exports = function (dbConnection) {
    return {
        validate: userOperations.generateValidateUser(dbConnection),
        create: userOperations.generateCreateUser(dbConnection), //TODO: create user creation,
        get: userOperations.generateGetUser(dbConnection), //TODO: create getUser,
        update: userOperations.generateUpdateUser(dbConnection) //TODO: create updateUser
    }
    
}