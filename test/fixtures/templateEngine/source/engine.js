module.exports = function (options, template, data, cb) {
  var html = template.replace('~~thing~~', data.thing)
  cb(null, html)
}
