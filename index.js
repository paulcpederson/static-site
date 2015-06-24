var path = require('path')
var assign = require('object-assign')
var defaults = require('./lib/defaults')
var source = require('./lib/source')
var frontmatter = require('./lib/frontmatter')
var data = require('./lib/data')
var helpers = require('./lib/helpers')
var template = require('./lib/template')
var build = require('./lib/build')

function staticSite (options, cb) {
  var opts = assign({}, defaults, options)
  var context = {
    sourcePath: path.join(process.cwd(), opts.source),
    start: Date.now(),
    options: opts
  }
  source.call(context)
    .then(frontmatter.bind(context))
    .then(data.bind(context))
    .then(helpers.bind(context))
    .then(template.bind(context))
    .then(build)
    .then(function (pages) {
      var t2 = Date.now()
      var stats = {
        pages: pages,
        source: context.sourcePath,
        build: opts.build,
        start: context.start,
        end: t2,
        duration: t2 - context.start
      }
      return cb(null, stats)
    })
    .catch(function (err) {
      cb(err.stack)
    })
}

module.exports = staticSite
