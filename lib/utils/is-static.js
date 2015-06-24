var path = require('path')

module.exports = function isStatic (filePath) {
  var extensions = ['.yml', '.yaml', '.json']
  var ext = path.extname(filePath)
  return extensions.indexOf(ext) > -1
}
