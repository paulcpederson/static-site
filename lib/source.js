var path = require('path')
var glob = require('glob')
var Promise = require('es6-promise').Promise
var defaults = require('./defaults')

function source (context) {
  return new Promise(function (resolve, reject) {
    var files = defaults.files.concat(context.options.files)
    var ext = '*.{' + files.join(',') + '}'
    var pattern = path.join(context.sourcePath, '**', ext)
    var ignores = context.options.ignore.map(function (ignore) {
      return path.resolve(context.sourcePath, ignore, '**')
    })
    var defaultIgnore = [path.join(context.sourcePath, '_*/**')]
    var options = {ignore: ignores.concat(defaultIgnore)}
    glob(pattern, options, function (err, result) {
      if (err) { return reject(err, err.stack) }
      return resolve(result)
    })
  })
}

module.exports = source
