var path = require('path')
var matter = require('gray-matter')
var assign = require('object-assign')
var isMarkdown = require('./utils/is-markdown')
var getUrl = require('./utils/url')
var getDest = require('./utils/dest')
var cwd = process.cwd()

function getPrettyUrl (context, f) {
  if (f.data.hasOwnProperty('prettyUrl')) {
    return f.data.prettyUrl
  }
  if (context.extraOptions.hasOwnProperty('prettyUrl')) {
    return context.extraOptions.prettyUrl === 'true'
  }
  if (context.hasOwnProperty('prettyUrl')) {
    return context.prettyUrl === 'true'
  }
  return true
}

function eachFile (context, file) {
  var f = matter.read(file)
  var build = path.join(cwd, context.options.build)
  var prettyUrl = getPrettyUrl(context, f)
  var dest = getDest(file, context.options, prettyUrl)
  var meta = {
    content: f.content,
    file: file,
    dest: dest,
    url: getUrl(dest, build),
    root: path.relative(dest, build),
    isMarkdown: isMarkdown(file),
    prettyUrl: prettyUrl
  }
  return assign({}, context.extraOptions, f.data, meta)
}

function frontmatter (context, files) {
  return files.map(eachFile.bind(null, context))
}

module.exports = function (context) {
  return frontmatter.bind(null, context)
}
