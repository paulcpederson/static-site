var path = require('path')
var spawn = require('child_process').spawn
var cli = path.join(__dirname, '..', 'bin', 'static-site.js')
var test = require('tape')
var rimraf = require('rimraf')

var options = {
  source: 'test/fixtures/watch/source',
  build: 'test/fixtures/watch/build'
}

test('should not exit with the --watch option', function (t) {
  t.plan(1)
  rimraf.sync('test/fixtures/watch/build')
  var exited = false
  var bin = spawn(cli, ['-b', options.build, '-s', options.source, '--watch'])

  bin.once('close', function (code) {
    exited = true
  })

  setTimeout(function () {
    t.notOk(exited)
    if (!exited) {
      bin.kill()
    }
    rimraf.sync('test/fixtures/watch/build')
  }, 1000)
})

// test('should rebuild when files change with the --watch option', function (t) {
//   t.plan(1)
//   var tmp = 'test/fixtures/watch/source/tmp.html'
//   rimraf.sync('test/fixtures/watch/build')
//   rimraf.sync(tmp)

//   var bin = spawn(cli, ['-b', options.build, '-s', options.build, '-w'])
//   fs.writeFileSync(tmp, '')

//   bin.stderr.setEncoding('utf8')
//   bin.stderr.once('data', function(data) {
//     assert.strictEqual(data.trim(), '=> changed: ' + src)
//     fs.unlinkSync(src)
//     bin.kill()
//     done()
//   })

//   setTimeout(function() {
//     fs.appendFileSync(src, 'body {}')
//   }, 500)

//   setTimeout(function () {
//     t.notOk(exited)
//     if (!exited) {
//       bin.kill()
//     }
//     rimraf.sync('test/fixtures/watch/build')
//   }, 500)
// })
