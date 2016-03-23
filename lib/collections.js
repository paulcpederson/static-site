var minimatch = require('minimatch')

function byDate (a, b) {
  if (a.date && b.date) {
    return new Date(b.date) - new Date(a.date)
  } else {
    return 0
  }
}

module.exports = function (pages) {
  return pages.map(function (page) {
    Object.keys(page.collections || {}).forEach(function (key) {
      var glob = page.collections[key]
      var collection = pages.filter(function (p) {
        return minimatch(p.url, glob)
      }).sort(byDate)
      page.collections[key] = collection
    })
    return page
  })
}
