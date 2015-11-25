var path = require('path')
var assign = require('object-assign')
var defaults = require('./lib/defaults')
var source = require('./lib/source')
var frontmatter = require('./lib/frontmatter')
var data = require('./lib/data')
var helpers = require('./lib/helpers')
var template = require('./lib/template')
var build = require('./lib/build')
var cwd = process.cwd()

function staticSite (options, cb) {
  var pkg = {}
  try {
    pkg = require(path.join(cwd, 'package.json'))
  } catch (e) {
    pkg = {}
  }

  var extraOptions = Object.keys(options)
      .filter(function (key) { return Object.keys(defaults).indexOf(key) === -1 })
      .reduce(function (prev, curr) {
        prev[curr] = options[curr]
        return prev
      }, {})

  var packageOptions = (pkg['static-site'] || {})
  var opts = assign({}, defaults, packageOptions, options)
  var context = {
    sourcePath: path.join(cwd, opts.source),
    start: Date.now(),
    options: opts,
    extraOptions: extraOptions
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
