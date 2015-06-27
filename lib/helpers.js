var path = require('path')
var Promise = require('es6-promise').Promise

function runHelper (filePath, pages) {
  var module
  return new Promise(function (resolve, reject) {
    try {
      module = require(filePath)
    } catch (e) {
      try {
        var relativePath = path.join(process.cwd(), filePath)
        module = require(relativePath)
      } catch (e) {
        return reject(e)
      }
    }
    module(pages, function (err, site) {
      if (err) { return reject(err) }
      return resolve(site)
    })
  })
}

// TODO errors in helpers fail silently
function getHelpers (helperPromises, pages) {
  var initialPromise = Promise.resolve(pages)
  var finalHelperPromise = helperPromises.reduce(function (prev, current) {
    return prev.then(current)
  }, initialPromise)
  return finalHelperPromise
}

function helpers (pages) {
  var _this = this
  var helperPromises = _this.options.helpers.map(function (helperPath) {
    return runHelper(helperPath, pages)
  })
  return getHelpers(helperPromises, pages)
}

module.exports = helpers
