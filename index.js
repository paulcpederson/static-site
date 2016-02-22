var lib = require('./lib/')
var getContext = require('./lib/utils/get-context')

function applyContext (context, library) {
  return lib[library].bind(null, context)
}

function staticSite (options, cb) {
  var context = getContext(options)
  var bindLib = applyContext.bind(null, context)
  lib.source.call(context)
    .then(bindLib('frontmatter'))
    .then(bindLib('data'))
    .then(bindLib('helpers'))
    .then(bindLib('template'))
    .then(bindLib('build'))
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
