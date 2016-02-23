var mkdirp = require('mkdirp')
var Promise = require('es6-promise').Promise
var fs = require('fs')
var path = require('path')

function writeFile (page) {
  return new Promise(function (resolve, reject) {
    var dir = path.dirname(page.dest)
    mkdirp(dir, function (err) {
      if (err) { return reject(err) }
      fs.writeFile(page.dest, page.contents, function (err) {
        if (err) { return reject(err) }
        return resolve(page.dest)
      })
    })
  })
}

function build (context, pages) {
  var builtPages = pages.map(writeFile)
  return Promise.all(builtPages)
}

module.exports = function (context) {
  return build.bind(null, context)
}
