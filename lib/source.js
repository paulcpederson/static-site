var path = require('path')
var glob = require('glob')
var Promise = require('es6-promise').Promise

function source () {
  var _this = this
  return new Promise(function (resolve, reject) {
    var fileExtensions = '*.{' + _this.options.files.join(',') + '}'
    var globPattern = path.join(_this.sourcePath, '**', fileExtensions)
    glob(globPattern, {}, function (err, files) {
      if (err) { return reject(err, err.stack) }
      return resolve(files)
    })
  })
}

module.exports = source
