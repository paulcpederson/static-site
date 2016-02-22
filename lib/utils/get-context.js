var path = require('path')
var assign = require('object-assign')
var defaults = require('../defaults')

function getContext (options) {
  var cwd = process.cwd()
  var pkg
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
  return context
}

module.exports = getContext
