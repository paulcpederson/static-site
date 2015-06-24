var test = require('tape')
var rimraf = require('rimraf')
var staticSite = require('..')
var fs = require('fs')

var options = {
  source: 'test/fixtures/data/source',
  build: 'test/fixtures/data/build'
}

test('.json, .yml, and .js data files', function (t) {
  rimraf.sync('test/fixtures/data/build')
  t.plan(4)
  staticSite(options, function (err, stats) {
    t.error(err)
    var file = fs.readFileSync(stats.pages[0], 'utf8')
    t.ok(file.indexOf('JSON') > -1)
    t.ok(file.indexOf('YAML') > -1)
    t.ok(file.indexOf('JS') > -1)
    rimraf.sync('test/fixtures/data/build')
  })
})
