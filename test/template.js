var test = require('tape')
var rimraf = require('rimraf')
var staticSite = require('..')
var fs = require('fs')

var options = {
  source: 'test/fixtures/template/source',
  build: 'test/fixtures/template/build',
  files: ['xml']
}

test('swig layouts and partials', function (t) {
  rimraf.sync('test/fixtures/template/build')
  t.plan(12)
  staticSite(options, function (err, stats) {
    t.error(err)
    var file = fs.readFileSync(stats.pages[0], 'utf8')
    t.ok(file.indexOf('title: index title') > -1)
    t.ok(file.indexOf('description: index description') > -1)
    t.ok(file.indexOf('partial1: index title') > -1)
    t.ok(file.indexOf('partial2: index title') > -1)
    t.ok(file.indexOf('thing1 thing2 thing3 ') > -1)

    var file2 = fs.readFileSync(stats.pages[1], 'utf8')
    t.equal(file2, 'xml title')

    var file3 = fs.readFileSync(stats.pages[2], 'utf8')
    t.ok(file3.indexOf('title: test title') > -1)
    t.ok(file3.indexOf('description: test description') > -1)
    t.ok(file3.indexOf('partial1: test title') > -1)
    t.ok(file3.indexOf('partial2: test title') > -1)
    t.ok(file3.indexOf('test1 test2 test3 ') > -1)
    rimraf.sync('test/fixtures/template/build')
  })
})

test('swig block disable', function (t) {
  var blockOptions = {
    source: 'test/fixtures/no-block/source',
    build: 'test/fixtures/no-block/build'
  }
  rimraf.sync('test/fixtures/no-block/build')
  t.plan(2)
  staticSite(blockOptions, function (err, stats) {
    t.error(err)
    var file = fs.readFileSync(stats.pages[0], 'utf8')
    t.equals(file, 'side-aftercontent-after')
    rimraf.sync('test/fixtures/template/build')
  })
})

test('swig markdown tag', function (t) {
  rimraf.sync('test/fixtures/markdown/build')
  var markdownOptions = {
    source: 'test/fixtures/markdown/source',
    build: 'test/fixtures/markdown/build'
  }
  t.plan(2)
  staticSite(markdownOptions, function (err, stats) {
    t.error(err)
    var file = fs.readFileSync(stats.pages[0], 'utf8')
    t.ok(file.indexOf('<span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>') > -1)
    rimraf.sync('test/fixtures/markdown/build')
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
