var path = require('path')
var read = require('read-data')
var forEach = require('async-foreach').forEach
var Promise = require('es6-promise').Promise

// TODO: factor this into it's own abstract util
function isStatic (ext) {
  var extensions = ['.yml', '.yaml', '.json']
  return extensions.indexOf(ext) > -1
}

// TODO: factor this into it's own abstract util
function getJSData (page, filePath, cb) {
  try {
    var jsModule = require(filePath)
  } catch (e) {
    return cb(e)
  }
  jsModule(page, function (err, output) {
    if (err) { return cb(err) }
    return cb(null, output)
  })
}

function getKeyData (page, key) {
  var filePath = path.join(this.sourcePath, page.data[key])
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
  var keys = Object.keys(page.data || {})
  var promisedKeys = keys.map(getKeyData.bind(this, page))
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
