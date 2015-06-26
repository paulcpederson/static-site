var test = require('tape')
var rimraf = require('rimraf')
var shelljs = require('shelljs')
var fs = require('fs')
var cwd = process.cwd()

test('uses options from package.json', function (t) {
  rimraf.sync('test/fixtures/package/build')
  t.plan(1)
  shelljs.cd('test/fixtures/package/')
  shelljs.exec('npm run build')
  fs.readFile('build/ignored/index.html', 'utf8', function (err, result) {
    t.ok(err)
    rimraf.sync('build')
    shelljs.cd(cwd)
  })
})

test('cli overrides options from package.json', function (t) {
  rimraf.sync('test/fixtures/package/build')
  t.plan(1)
  shelljs.cd('test/fixtures/package/')
  shelljs.exec('npm run build-custom')
  fs.readFile('build/ignored/index.html', 'utf8', function (err, result) {
    t.error(err)
    rimraf.sync('build')
    shelljs.cd(cwd)
  })
})
