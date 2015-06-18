var path = require('path')
var Promise = require('es6-promise').Promise

function runHelper (filePath, pages) {
  return new Promise(function (resolve, reject) {
    try {
      var module = require(fullPath)
    } catch (e) {
      return reject(e)
    }
    module(pages, function (err, site) {
      if (err) { return reject(err) }
      return resolve(site)
    })
  })
}

function getHelpers (helperPromises) {
  var finalHelperPromise = helperPromises.reduce(function (prev, current) {
    return prev.then(current)
  }, resolvedPromise)
  return finalHelperPromise
}

function helpers (pages) {
  var helperPromises = this.helpers.map(function (helperPath) {
    var filePath = path.join(this.sourcePath, helperPath)
    return runHelper(filePath, pages)
  })
  return getHelpers(helperPromises)
}

module.exports = helpers
