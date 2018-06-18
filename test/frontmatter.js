var test = require('tape')
var rimraf = require('rimraf')
var staticSite = require('..')
var fs = require('fs')
var path = require('path')

test('frontmatter objects, arrays, and strings', function (t) {
  var options = {
    source: 'test/fixtures/frontmatter/source',
    build: 'test/fixtures/frontmatter/build'
  }
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

test('extra options are added to frontmatter', function (t) {
  var options = {
    source: 'test/fixtures/extra-options/source',
    build: 'test/fixtures/extra-options/build',
    ENV: 'production'
  }
  rimraf.sync('test/fixtures/extra-options/build')
  t.plan(3)
  staticSite(options, function (err, stats) {
    t.error(err)
    var file = fs.readFileSync(stats.pages[0], 'utf8')
    t.equal(file, 'production')
    var overriddenFile = fs.readFileSync(stats.pages[1], 'utf8')
    t.equal(overriddenFile, 'development')
    rimraf.sync('test/fixtures/extra-options/build')
  })
})

test('pretty urls can be turned off', function (t) {
  var options = {
    source: 'test/fixtures/prettyUrl/source',
    build: 'test/fixtures/prettyUrl/build'
  }
  rimraf.sync('test/fixtures/prettyUrl/build')
  t.plan(4)
  staticSite(options, function (err, stats) {
    t.error(err)
    t.equal(stats.pages[0], path.join(process.cwd(), 'test/fixtures/prettyUrl/build/not-pretty.html'))
    t.equal(stats.pages[1], path.join(process.cwd(), 'test/fixtures/prettyUrl/build/pretty-override/index.html'))
    t.equal(stats.pages[2], path.join(process.cwd(), 'test/fixtures/prettyUrl/build/pretty/index.html'))
    rimraf.sync('test/fixtures/prettyUrl/build')
  })
})

test('pretty urls can be turned off with option', function (t) {
  var options = {
    source: 'test/fixtures/prettyUrl/source',
    build: 'test/fixtures/prettyUrl/build',
    prettyUrl: false
  }
  rimraf.sync('test/fixtures/prettyUrl/build')
  t.plan(4)
  staticSite(options, function (err, stats) {
    t.error(err)
    t.equal(stats.pages[0], path.join(process.cwd(), 'test/fixtures/prettyUrl/build/not-pretty.html'))
    t.equal(stats.pages[1], path.join(process.cwd(), 'test/fixtures/prettyUrl/build/pretty-override/index.html'))
    t.equal(stats.pages[2], path.join(process.cwd(), 'test/fixtures/prettyUrl/build/pretty.html'))
    rimraf.sync('test/fixtures/prettyUrl/build')
  })
})
