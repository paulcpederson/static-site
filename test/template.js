var test = require('tape')
var rimraf = require('rimraf')
var staticSite = require('..')
var fs = require('fs')

var options = {
  source: 'test/fixtures/template/source',
  build: 'test/fixtures/template/build'
}

test('swig layouts and partials', function (t) {
  rimraf.sync('test/fixtures/template/build')
  t.plan(11)
  staticSite(options, function (err, stats) {
    t.error(err)
    var file = fs.readFileSync(stats.pages[0], 'utf8')
    t.ok(file.indexOf('title: index title') > -1)
    t.ok(file.indexOf('description: index description') > -1)
    t.ok(file.indexOf('partial1: index title') > -1)
    t.ok(file.indexOf('partial2: index title') > -1)
    t.ok(file.indexOf('thing1 thing2 thing3 ') > -1)

    var file2 = fs.readFileSync(stats.pages[1], 'utf8')
    t.ok(file2.indexOf('title: test title') > -1)
    t.ok(file2.indexOf('description: test description') > -1)
    t.ok(file2.indexOf('partial1: test title') > -1)
    t.ok(file2.indexOf('partial2: test title') > -1)
    t.ok(file2.indexOf('test1 test2 test3 ') > -1)
    rimraf.sync('test/fixtures/template/build')
  })
})

var customOptions = {
  source: 'test/fixtures/templateEngine/source',
  build: 'test/fixtures/templateEngine/build',
  templateEngine: 'test/fixtures/templateEngine/source/engine.js'
}

test('custom template engine', function (t) {
  rimraf.sync('test/fixtures/templateEngine/build')
  t.plan(2)
  staticSite(customOptions, function (err, stats) {
    t.error(err)
    var file = fs.readFileSync(stats.pages[0], 'utf8')
    t.equal(file, 'This is sweet.')
    rimraf.sync('test/fixtures/templateEngine/build')
  })
})
