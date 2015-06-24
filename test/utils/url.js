var test = require('tape')
var url = require('../../lib/utils/url.js')

test('generates correctly formatted urls', function (t) {
  t.plan(2)
  var file = 'path/to/build/test/index.html'
  var build = 'path/to/build/'
  t.equal(url(file, build), '/test/')
  var nestedFile = 'path/to/build/test/nested/index.html'
  t.equal(url(nestedFile, build), '/test/nested/')
})
