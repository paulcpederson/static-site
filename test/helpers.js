var test = require('tape')
var rimraf = require('rimraf')
var staticSite = require('..')
var fs = require('fs')

var options = {
  helpers: ['concat.js'],
  source: 'test/fixtures/helpers/source',
  build: 'test/fixtures/helpers/build'
}

test('runs helper functions', function (t) {
  rimraf.sync('test/fixtures/helpers/build')
  t.plan(2)
  staticSite(options, function (err, stats) {
    t.error(err)
    var file = fs.readFileSync(stats.pages[0], 'utf8')
    t.equal(file, 'onetwo')
    rimraf.sync('test/fixtures/helpers/build')
  })
})
