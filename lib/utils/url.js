var path = require('path')

module.exports = function getUrl (file, build) {
  var relative = path.relative(build, file)
  var url = '/' + relative.replace('index.html', '')
  return url
}
