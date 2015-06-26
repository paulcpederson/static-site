module.exports = function removeNull (obj) {
  for (var i in obj) {
    if (obj[i] === undefined) {
      delete obj[i]
    }
  }
  return obj
}
