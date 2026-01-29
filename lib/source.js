var path = require("path");
var glob = require("glob");
var defaults = require("./defaults");

async function source(context) {
  var files = defaults.files.concat(context.options.files);
  var ext = "*.{" + files.join(",") + "}";
  var pattern = path.join(context.sourcePath, "**", ext);
  var ignores = context.options.ignore.map(function (ignore) {
    return path.resolve(context.sourcePath, ignore, "**");
  });
  var defaultIgnore = [path.join(context.sourcePath, "_*/**")];
  var options = { ignore: ignores.concat(defaultIgnore) };
  return glob.glob(pattern, options);
}

module.exports = source;
