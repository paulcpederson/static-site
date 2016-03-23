var test = require('tape')
var rimraf = require('rimraf')
var staticSite = require('..')
var fs = require('fs')

var options = {
  source: 'test/fixtures/collections/source',
  build: 'test/fixtures/collections/build'
}

test('should allow access to named collections from front matter', function (t) {
  rimraf.sync('test/fixtures/collections/build')
  t.plan(2)
  staticSite(options, function (err, stats) {
    t.error(err)
    var file = fs.readFileSync(stats.pages.pop(), 'utf8')
    t.equal(file, 'page three page one page two ')
    rimraf.sync('test/fixtures/collections/build')
  })
})
