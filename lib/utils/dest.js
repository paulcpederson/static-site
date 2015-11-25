var path = require('path')
var isMarkdown = require('./is-markdown')
var cwd = process.cwd()

module.exports = function getDest (file, options, makePrettyUrl) {
  var build = path.join(cwd, options.build)
  var source = path.join(cwd, options.source)
  var relative = path.relative(source, file)
  var dest = path.join(build, relative)

  if (isMarkdown(file)) {
    dest = dest.replace(path.extname(dest), '.html')
  }

  var ext = path.extname(dest)

  if (ext === '.html' && makePrettyUrl) {
    var base = path.basename(dest, ext)
    if (base !== 'index') {
      var prettyUrl = path.join(base, 'index.html')
      dest = dest.replace(path.basename(dest), prettyUrl)
    }
  }
  return dest
}
