var fs = require('fs')
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

test('should rebuild when files change with the --watch option', function (t) {
  t.plan(2)
  var tmp = 'test/fixtures/watch/source/tmp.html'
  rimraf.sync('test/fixtures/watch/build')
  rimraf.sync(tmp)
  fs.writeFileSync(tmp, '')

  var bin = spawn(cli, ['-b', options.build, '-s', options.source, '-w'])

  bin.stdout.setEncoding('utf8')
  bin.stdout.once('data', function (data) {
    t.ok(data.indexOf('Built 3 files') > -1)
  })

  setTimeout(function () {
    fs.appendFileSync(tmp, 'OK')
  }, 500)

  setTimeout(function () {
    var builtTmp = fs.readFileSync(path.join(process.cwd(), options.build, '/tmp/index.html'), 'utf-8')
    t.equals(builtTmp, 'OK')
    bin.kill()
    rimraf.sync(options.build)
    rimraf.sync(tmp)
  }, 700)
})
