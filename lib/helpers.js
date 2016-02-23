var path = require('path')
var Promise = require('es6-promise').Promise

function runHelper (filePath, pages) {
  return new Promise(function (resolve, reject) {
    var module
    try {
      module = require(filePath)
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        var relativePath = path.join(process.cwd(), filePath)
        module = require(relativePath)
      } else {
        throw e
      }
    }
    module(pages, function (err, site) {
      if (err) { return reject(err) }
      return resolve(site)
    })
  })
}

function helpers (context, pages) {
  return context.options.helpers.reduce(function (prev, current) {
    return prev.then(runHelper.bind(null, current))
  }, Promise.resolve(pages))
}

module.exports = function (context) {
  return helpers.bind(null, context)
}
