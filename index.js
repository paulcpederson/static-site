var lib = require('./lib/')
var getContext = require('./lib/utils/get-context')

function staticSite (options, cb) {
  var context = getContext(options)
  lib.source.call(context)
    .then(lib.frontmatter.bind(context))
    .then(lib.data.bind(context))
    .then(lib.helpers.bind(context))
    .then(lib.template.bind(context))
    .then(lib.build)
    .then(function (pages) {
      var t2 = Date.now()
      var stats = {
        pages: pages,
        source: context.sourcePath,
        build: context.build,
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
