var test = require('tape')
var rimraf = require('rimraf')
var staticSite = require('..')
var fs = require('fs')

var options = {
  source: 'test/fixtures/frontmatter/source',
  build: 'test/fixtures/frontmatter/build'
}

test('frontmatter objects, arrays, and strings', function (t) {
  rimraf.sync('test/fixtures/frontmatter/build')
  t.plan(4)
  staticSite(options, function (err, stats) {
    t.error(err)
    var file = fs.readFileSync(stats.pages[0], 'utf8')
    t.ok(file.indexOf('thing') > -1)
    t.ok(file.indexOf('one,two,three') > -1)
    t.ok(file.indexOf('property') > -1)
    rimraf.sync('test/fixtures/frontmatter/build')
  })
})
