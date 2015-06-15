var path = require('path')
var assign = require('object-assign')
var defaults = require('./lib/defaults')
var source = require('./lib/source')
var frontmatter = require('./lib/frontmatter')
var data = require('./lib/data')
var layout = require('./lib/layout')
var build = require('./lib/build')

function static (options, cb) {
  var opts = assign({}, defaults, options)
  var context = {
    sourcePath: path.join(process.cwd(), opts.source),
    start: Date.now(),
    options: opts
  }
  source.call(context)
    .then(frontmatter.bind(context))
    .then(data.bind(context))
    .then(layout.bind(context))
    .then(build.bind(context))
    .then(function (pages) {
      console.log(pages)
      var t2 = Date.now()
      var stats = {
        pages: pages.length,
        start: context.start,
        end: t2,
        duration: t2 - context.start
      }
      return cb(null, pages, stats)
    })
    .catch(function (err) {
      cb(err)
    })
}

module.exports = static
