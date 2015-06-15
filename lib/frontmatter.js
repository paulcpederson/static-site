var path = require('path')
var matter = require('gray-matter')
var assign = require('object-assign')
var cwd = process.cwd()
var Promise = require('es6-promise').Promise

function isMarkdown (file) {
  var ext = path.extname(file)
  return ext === '.md' || ext === '.markdown'
}

function getUrl (file, build) {
  var relative = path.relative(build, file)
  var url = '/' + relative.replace('index.html', '')
  return url
}

function getDest (file, options) {
  var build = path.join(cwd, options.build)
  var source = path.join(cwd, options.source)
  var relative = path.relative(source, file)
  var dest = path.join(build, relative)

  if (isMarkdown(file)) {
    dest = dest.replace(path.extname(dest), '.html')
  }

  var ext = path.extname(dest)
  if (ext === '.html') {
    var base = path.basename(dest, ext)
    if (base !== 'index') {
      var prettyUrl = path.join(base, 'index.html')
      dest = dest.replace(path.basename(dest), prettyUrl)
    }
  }
  return dest
}

function frontmatter (files) {
  var _this = this
  return new Promise(function (resolve, reject) {
    var pages = files.map(function (file) {
      var dest = getDest(file, _this.options)
      var build = path.join(cwd, _this.options.build)
      var f = matter.read(file)
      var meta = {
        content: f.content,
        file: file,
        dest: dest,
        url: getUrl(dest, build),
        root: path.relative(dest, build),
        isMarkdown: isMarkdown(file)
      }
      return assign({}, f.data, meta)
    })
    resolve(pages)
  })
}

module.exports = frontmatter
