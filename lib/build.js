var format = require('util').format

function build (site, options, t1, cb) {
  var t2 = Date.now()
  var stats = {
    pages: site.length,
    start: t1,
    end: t2,
    duration: t2 - t1
  }
  return cb(null, site, stats)
}

module.exports = build
