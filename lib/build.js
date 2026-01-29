var mkdirp = require("mkdirp");
var fs = require("fs");
var path = require("path");

function writeFile(page) {
  return new Promise(async function (resolve, reject) {
    try {
      var dir = path.dirname(page.dest);
      await mkdirp.mkdirp(dir);
      fs.writeFile(page.dest, page.contents, function (err) {
        if (err) {
          return reject(err);
        }
        return resolve(page.dest);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function build(context, pages) {
  var builtPages = pages.map(writeFile);
  return Promise.all(builtPages);
}

module.exports = function (context) {
  return build.bind(null, context);
};
