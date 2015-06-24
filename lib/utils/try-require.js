/**
* Try to require a user-defined module, run with args
* @param {String}   filePath Path to the JS file (absolute)
* @param {Array}    args     Array of args to supply to the module
* @param {Function} cb       Callback function to pass to module
*/
module.exports = function tryRequire (filePath, args, cb) {
  try {
    var jsModule = require(filePath)
  } catch (e) {
    return cb(e)
  }
  var moduleArguments = [].concat(args)
  moduleArguments.push(cb)
  return jsModule.apply(null, moduleArguments)
}
