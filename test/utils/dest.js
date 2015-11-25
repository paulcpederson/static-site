var test = require('tape')
var dest = require('../../lib/utils/dest.js')
var path = require('path')

var cwd = process.cwd()
var options = {
  build: 'build',
  source: 'source'
}

test('generates a destination path', function (t) {
  t.plan(1)
  var file = path.join(cwd, 'source/path/to/file/index.html')
  var output = dest(file, options, true)
  var expected = path.join(cwd, 'build/path/to/file/index.html')
  t.equal(output, expected)
})

test('generates pretty urls', function (t) {
  t.plan(1)
  var file = path.join(cwd, 'source/path/to/file/test.html')
  var output = dest(file, options, true)
  var expected = path.join(cwd, 'build/path/to/file/test/index.html')
  t.equal(output, expected)
})

test('prettty urls can be turned off', function (t) {
  t.plan(1)
  var file = path.join(cwd, 'source/path/to/file/test.html')
  var output = dest(file, options, false)
  var expected = path.join(cwd, 'build/path/to/file/test.html')
  t.equal(output, expected)
})

test('generates an html url for markdown files', function (t) {
  t.plan(1)
  var file = path.join(cwd, 'source/path/to/file/test.md')
  var output = dest(file, options, true)
  var expected = path.join(cwd, 'build/path/to/file/test/index.html')
  t.equal(output, expected)
})
