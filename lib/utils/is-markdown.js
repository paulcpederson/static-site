var path = require('path')

module.exports = function isMarkdown (file) {
  var ext = path.extname(file)
  return ext === '.md' || ext === '.markdown'
}
