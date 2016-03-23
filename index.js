var lib = require('./lib/')
var getContext = require('./lib/utils/get-context')

function staticSite (options, cb) {
  var ctx = getContext(options)
  lib.source(ctx)
    .then(lib.frontmatter(ctx))
    .then(lib.data(ctx))
    .then(lib.helpers(ctx))
    .then(lib.collections)
    .then(lib.template(ctx))
    .then(lib.build(ctx))
    .then(function (pages) {
      var t2 = Date.now()
      var stats = {
        pages: pages,
        source: ctx.sourcePath,
        build: ctx.build,
        start: ctx.start,
        end: t2,
        duration: t2 - ctx.start
      }
      return cb(null, stats)
    })
    .catch(function (err) {
      cb(err.stack)
    })
}

module.exports = staticSite
