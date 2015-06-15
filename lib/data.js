var path = require('path')
var read = require('read-data')
var forEach = require('async-foreach').forEach
var Promise = require('es6-promise').Promise

function isStatic (ext) {
  var extentions = ['.yml', '.yaml', '.json']
  return extensions.indexOf(ext) > -1
}

function getJSData (filePath, pages, page, options, cb) {
  var fullPath = path.join(process.cwd(), options.source, filePath)
  try {
    var jsModule = require(fullPath)
  } catch (e) {
    return cb(e)
  }
  jsModule(pages, page, function (err, output) {
    if (err) { return cb(err) }
    return cb(null, output)
  })
}

function getStaticData (filePath, options, cb) {
  var fullPath = path.join(process.cwd(), options.source, filePath)
  read(fullPath, function (err, output) {
    if (err) { return cb(err) }
    return cb(null, output)
  })
}

function getKeyData (pages, page, key, cb) {
  var datum = page.data[key]
  var _this = this
  if (typeof datum === 'string') {
    var ext = path.extname(datum)
    if (isStatic(ext)) {
      getStaticData(datum, _this.options, function (err, output) {
        if (err) { return cb(err) }
        return cb(null, output)
      })
    } else if (ext === '.js') {
      getJSData(datum, pages, page, _this.options, function (err, output) {
        if (err) { return cb(err) }
        return cb(null, output)
      })
    }
  } else {
    cb(null, datum)
  }
}

function getPageData (pages, page) {
  var getKey = getKeyData.bind(this, pages, page)
  return new Promise (function (resolve, reject) {
    var allData = {}
    page.data = page.data || {}
    var keys = Object.keys(page.data)
    forEach(keys, function (key, i) {
      var done = this.async()
      getKey(key, function (err, output) {
        if (err) {
          reject(err, err.stack)
          return done()
        }
        allData[key] = output
        done()
      })
    }, function (successful, arr) {
      page.data = allData
      resolve(page)
    })
  })
}

function data (pages) {
  var getPage = getPageData.bind(this, pages)
  var pagesWithData = pages.map(getPage)
  return Promise.all(pagesWithData)
}

module.exports = data
