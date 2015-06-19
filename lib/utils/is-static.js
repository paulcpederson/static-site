module.exports = function isStatic (ext) {
  var extensions = ['.yml', '.yaml', '.json']
  return extensions.indexOf(ext) > -1
}
