printObj = (obj) => {console.log(JSON.stringify(obj, null, 2)); return obj }
callbackThrow = (f) => (err, res) => {if (err) throw err; res.call(null, f)}
printObjCallbackThrow = callbackThrow(printObj)

module.exports = {
    printObj,
    callbackThrow,
    printObjCallbackThrow
}