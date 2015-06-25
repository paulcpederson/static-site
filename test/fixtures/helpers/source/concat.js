module.exports = function (site, cb) {
  site = site.map(function (page) {
    page.oneAndTwo = page.one + page.two
    return page
  })
  cb(null, site)
}
