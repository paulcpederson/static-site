var minimatch = require('minimatch')

function collect (context, pages) {
  return pages.map(function (page) {
    Object.keys(page.collections || {}).forEach(function (key) {
      var glob = page.collections[key]
      var collection = pages.filter(function (p) {
        return minimatch(p.url, glob)
      })
      page.collections[key] = collection
    })
    return page
  })
}

module.exports = function (context) {
  return collect.bind(null, context)
}
