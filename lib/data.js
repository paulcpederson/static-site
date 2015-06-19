var path = require('path')
var read = require('read-data')
var forEach = require('async-foreach').forEach
var Promise = require('es6-promise').Promise
var tryRequire = require('./utils/try-require')
var isStatic = require('./utils/is-static')

function getJSData (page, filePath, cb) {
  return tryRequire(filePath, [page], cb)
}

function getKeyData (page, key) {
  var sourcePath = this.sourcePath
  var filePath = path.join(sourcePath, page.data[key])
  return new Promise(function (resolve, reject) {
    var ext = path.extname(filePath)
    var getData = isStatic(ext) ? read : getJSData.bind(null, page)
    getData(filePath, function (err, output) {
      if (err) { return reject(err) }
      return resolve({key: key, value: output})
    })
  })
}

function getPageData (page) {
  var _this = this
  var keys = Object.keys(page.data || {})
  var promisedKeys = keys.map(getKeyData.bind(_this, page))
  return Promise.all(promisedKeys).then(function (dataArray) {
    page.data = dataArray.reduce(function (prev, curr) {
      prev[current.key] = current.value
      return prev
    }, {})
    return page
  })
}

function data (pages) {
  var _this = this
  return Promise.all(pages.map(getPageData.bind(_this)))
}

module.exports = data
