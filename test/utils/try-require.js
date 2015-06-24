var test = require('tape')
var tryRequire = require('../../lib/utils/try-require.js')
var path = require('path')

test('correctly loads defined modules', function (t) {
  t.plan(2)
  var filePath = path.join(process.cwd(), 'test/fixtures/dynamic-require/module.js')
  tryRequire(filePath, [1, 3], function (err, response) {
    t.error(err)
    t.equal(response, 4)
  })
})

test('returns error for undefined modules', function (t) {
  t.plan(1)
  var filePath = path.join(process.cwd(), 'nonsense/path/doesnt/exist/bananas.js')
  tryRequire(filePath, [1, 3], function (err) {
    t.ok(err)
  })
})
