var path = require('path')
var Promise = require('es6-promise').Promise

function runHelper (filePath, pages) {
  return new Promise(function (resolve, reject) {
    try {
      var module = require(filePath)
    } catch (e) {
      return reject(e)
    }
    module(pages, function (err, site) {
      if (err) { return reject(err) }
      return resolve(site)
    })
  })
}

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
    var filePath = path.join(_this.sourcePath, helperPath)
    return runHelper(filePath, pages)
  })
  return getHelpers(helperPromises, pages)
}

module.exports = helpers
