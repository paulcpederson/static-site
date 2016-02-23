var path = require('path')
var read = require('read-data').data
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
    var getData = isStatic(filePath) ? read : getJSData.bind(null, page)
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
      prev[curr.key] = curr.value
      return prev
    }, {})
    return page
  })
}

function data (context, pages) {
  var pagePromises = pages.map(getPageData.bind(context))
  return Promise.all(pagePromises)
}

module.exports = function (context) {
  return data.bind(null, context)
}
