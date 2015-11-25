var path = require('path')
var matter = require('gray-matter')
var assign = require('object-assign')
var isMarkdown = require('./utils/is-markdown')
var getUrl = require('./utils/url')
var getDest = require('./utils/dest')
var cwd = process.cwd()

function frontmatter (files) {
  var _this = this
  var pages = files.map(function (file) {
    var f = matter.read(file)
    var build = path.join(cwd, _this.options.build)
    var prettyUrl = true
    if (f.data.prettyUrl === false) {
      prettyUrl = false
    }
    var dest = getDest(file, _this.options, prettyUrl)
    var meta = {
      content: f.content,
      file: file,
      dest: dest,
      url: getUrl(dest, build),
      root: path.relative(dest, build),
      isMarkdown: isMarkdown(file),
      prettyUrl: prettyUrl
    }
    return assign({}, _this.extraOptions, f.data, meta)
  })
  return pages
}

module.exports = frontmatter
