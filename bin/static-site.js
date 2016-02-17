#!/usr/bin/env node
var staticSite = require('../')
var path = require('path')
var util = require('util')
var argvParse = require('argv-parse')
var pkg = require(path.join(__dirname, '..', 'package.json'))

var argv = argvParse({
  'build': {
    alias: 'b',
    type: 'string'
  },
  'source': {
    alias: 's',
    type: 'string'
  },
  'files': {
    alias: 'f',
    type: 'array'
  },
  'ignore': {
    alias: 'i',
    type: 'array'
  },
  'helpers': {
    alias: 'h',
    type: 'array'
  },
  'templateEngine': {
    alias: 't',
    type: 'string'
  },
  'verbose': {
    alias: 'v',
    type: 'boolean'
  }
})

if (argv.help) {
  var helpText = [
    'Usage: static-site [options] \n',
    'Options:',
    '  -b, --build           Path to build folder',
    '  -s, --source          Path to source folder',
    '  -f, --files           Array of file extensions to compile',
    '  -i, --ignore          Array of paths in source folder to ignore',
    '  -h, --helpers         Array of site helpers to run',
    '  -t, --templateEngine  Template engine to use',
    '  -v, --verbose         Enable verbose logging',
    '  --version             Show version number',
    '  --help                Show help text'
  ].join('\n')
  console.log(helpText)
  process.exit(0)
}

if (argv.version) {
  console.log(pkg.version)
  process.exit(0)
}

function green (message) {
  // use green ANSI terminal code, then set it back to normal
  var greenText = util.format('\x1b[32m%s\x1b[0m', message)
  console.log(greenText)
}

function indent (message) {
  console.log('  ' + message)
}

var verbose = argv.verbose
delete argv.verbose
delete argv._

staticSite(argv, function (err, stats) {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  if (verbose) {
    green('Built the following pages:')
    var buildPath = path.join(process.cwd(), stats.build)
    stats.pages.forEach(function (page) {
      page = page.replace(buildPath, '')
      indent(page)
    })
    green('Source Folder:')
    indent(stats.source)
    green('Build Folder:')
    indent(buildPath)
  }

  var message = util.format('Built %s files in %sms', stats.pages.length, stats.duration)
  green(message)
  process.exit(0)
})
