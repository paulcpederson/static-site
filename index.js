var path = require('path')
var glob = require('glob')
var assign = require('object-assign')
var defaults = require('./lib/defaults')
var frontmatter = require('./lib/frontmatter')
var data = require('./lib/data')
var layout = require('./lib/layout')
var build = require('./lib/build')

function parse (files, options, cb) {
  var t0 = Date.now()
  var site = files.map(function (file) {return frontmatter(file, options, cb)})
      .map(function (page) {return data(page, options, cb)})
      .map(function (page) {return layout(page, options, cb)})
  return build(site, options, t0, cb)
}

function static (options, cb) {
  var opts = assign({}, defaults, options)
  var sourcePath = path.join(process.cwd(), opts.source)
  var fileExtensions = '*.{' + opts.files.join(',') + '}'
  var globPattern = path.join(sourcePath, '**', fileExtensions)

  glob(globPattern, {}, function (err, files) {
    if (err) { return cb(err) }
    return parse(files, options, cb)
  })
}

module.exports = static
