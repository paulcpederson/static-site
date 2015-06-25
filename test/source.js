var test = require('tape')
var rimraf = require('rimraf')
var staticSite = require('..')

var options = {
  source: 'test/fixtures/ignore-underscores/source',
  build: 'test/fixtures/ignore-underscores/build'
}

test('ignores underscored folders and files', function (t) {
  rimraf.sync('test/fixtures/ignore-underscores/build')
  t.plan(2)
  staticSite(options, function (err, stats) {
    t.error(err)
    t.equal(stats.pages.length, 2)
    rimraf.sync('test/fixtures/ignore-underscores/build')
  })
})

test('custom ignore', function (t) {
  rimraf.sync('test/fixtures/ignore-underscores/build')
  t.plan(2)
  options.ignore = ['nested/']
  staticSite(options, function (err, stats) {
    t.error(err)
    t.equal(stats.pages.length, 1)
    rimraf.sync('test/fixtures/ignore-underscores/build')
  })
})

var fileOptions = {
  source: 'test/fixtures/files/source',
  build: 'test/fixtures/files/build'
}

test('builds only markdown and html files', function (t) {
  rimraf.sync('test/fixtures/files/build')
  t.plan(2)
  staticSite(fileOptions, function (err, stats) {
    t.error(err)
    t.equal(stats.pages.length, 1)
    rimraf.sync('test/fixtures/files/build')
  })
})

test('custom files', function (t) {
  rimraf.sync('test/fixtures/files/build')
  t.plan(2)
  fileOptions.files = ['xml']
  staticSite(fileOptions, function (err, stats) {
    t.error(err)
    t.equal(stats.pages.length, 2)
    rimraf.sync('test/fixtures/files/build')
  })
})
