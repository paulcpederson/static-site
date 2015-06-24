var test = require('tape')
var isStatic = require('../../lib/utils/is-static.js')

test('identifies static data files', function (t) {
  t.plan(5)
  t.equal(isStatic('thing.json'), true)
  t.equal(isStatic('thing.yaml'), true)
  t.equal(isStatic('thing.yml'), true)
  t.equal(isStatic('thing.js'), false)
  t.equal(isStatic('thing'), false)
})
