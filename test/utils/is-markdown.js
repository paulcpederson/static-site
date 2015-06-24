var test = require('tape')
var isMarkdown = require('../../lib/utils/is-markdown.js')

test('detects markdown extensions', function (t) {
  t.plan(5)
  t.equal(isMarkdown('path/to/file.md'), true)
  t.equal(isMarkdown('path/to/file.markdown'), true)
  t.equal(isMarkdown('path/to/file.html'), false)
  t.equal(isMarkdown('path/to/file.xml'), false)
  t.equal(isMarkdown('path/to/file'), false)
})
