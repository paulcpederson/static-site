#!/usr/bin/env node
var staticSite = require('../')
var defaults = require('../lib/defaults')
var color = require('cli-color')
var path = require('path')
var util = require('util')
var yargs = require('yargs')
  .usage('Usage: $0 [options]')
  .options({
    'b': {
      alias: 'build',
      type: 'string',
      default: defaults.build,
      describe: 'path to build folder'
    },
    's': {
      alias: 'source',
      type: 'string',
      default: defaults.source,
      describe: 'path to source folder'
    },
    'f': {
      alias: 'files',
      type: 'array',
      default: [],
      describe: 'array of file extensions to compile'
    },
    'i': {
      alias: 'ignore',
      type: 'array',
      default: defaults.ignore,
      describe: 'array of paths in source folder to ignore'
    },
    'h': {
      alias: 'helpers',
      type: 'array',
      default: defaults.helpers,
      describe: 'array of site helpers to run'
    },
    't': {
      alias: 'templateEngine',
      type: 'string',
      default: defaults.templateEngine,
      describe: 'template engine to use'
    },
    'v': {
      alias: 'verbose',
      type: 'boolean',
      default: false,
      describe: 'enable verbose logging'
    }
  })
  .help('help')
  .version(require(__dirname + '/../package.json').version + '\n')
  .argv

function green (message) {
  console.log(color.green(message))
}

function indent (message) {
  console.log('  ' + message)
}

staticSite(yargs, function (err, stats) {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  if (yargs.verbose) {
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
