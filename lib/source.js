var path = require('path')
var glob = require('glob')
var Promise = require('es6-promise').Promise

function source () {
  var _this = this
  return new Promise(function (resolve, reject) {
    var ext = '*.{' + _this.options.files.join(',') + '}'
    var pattern = path.join(_this.sourcePath, '**', ext)
    var ignores = _this.options.ignore.map(function (ignore) {
      return path.resolve(_this.sourcePath, ignore, '**')
    })
    var defaultIgnore = [path.join(_this.sourcePath, '_*/**')]
    var options = {ignore: ignores.concat(defaultIgnore)}
    glob(pattern, options, function (err, result) {
      if (err) { return reject(err, err.stack) }
      return resolve(result)
    })
  })
}

module.exports = source
