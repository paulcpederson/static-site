var test = require('tape')
var rimraf = require('rimraf')
var staticSite = require('..')
var fs = require('fs')

test('runs helper functions', function (t) {
  var options = {
    helpers: ['test/fixtures/helpers/source/concat.js'],
    source: 'test/fixtures/helpers/source',
    build: 'test/fixtures/helpers/build'
  }
  rimraf.sync('test/fixtures/helpers/build')
  t.plan(2)
  staticSite(options, function (err, stats) {
    t.error(err)
    var file = fs.readFileSync(stats.pages[0], 'utf8')
    t.equal(file, 'onetwo')
    rimraf.sync('test/fixtures/helpers/build')
  })
})

test('helper functions throw errors correctly', function (t) {
  var options = {
    helpers: ['test/fixtures/helper-errors/source/helper.js'],
    source: 'test/fixtures/helper-errors/source',
    build: 'test/fixtures/helper-errors/build'
  }
  rimraf.sync('test/fixtures/helper-errors/build')
  t.plan(1)
  staticSite(options, function (err, stats) {
    t.ok(err)
    // t.equal(err.message, 'Threw error correctly')
    rimraf.sync('test/fixtures/helpers/build')
  })
})
