var test = require("tape");
var rimraf = require("rimraf");
var staticSite = require("..");
var fs = require("fs");

var options = {
  source: "test/fixtures/template/source",
  build: "test/fixtures/template/build",
  files: ["xml"],
};

test("swig layouts and partials", function (t) {
  rimraf.sync("test/fixtures/template/build");
  t.plan(12);
  staticSite(options, function (err, stats) {
    t.error(err);
    const indexFile = stats.pages.find((p) => p.includes("build/index.html"));
    const file = fs.readFileSync(indexFile, "utf8");
    t.ok(file.includes("title: index title"));
    t.ok(file.includes("description: index description"));
    t.ok(file.includes("partial1: index title"));
    t.ok(file.includes("partial2: index title"));
    t.ok(file.includes("thing1 thing2 thing3 "));

    const xmlFile = stats.pages.find((p) => p.includes("build/test.xml"));
    const file2 = fs.readFileSync(xmlFile, "utf8");
    t.equal(file2, "xml title");

    const childFile = stats.pages.find((p) => p.includes("test/index.html"));
    const file3 = fs.readFileSync(childFile, "utf8");
    t.ok(file3.includes("title: test title"));
    t.ok(file3.includes("description: test description"));
    t.ok(file3.includes("partial1: test title"));
    t.ok(file3.includes("partial2: test title"));
    t.ok(file3.includes("test1 test2 test3 "));
    rimraf.sync("test/fixtures/template/build");
  });
});

test("swig block disable", function (t) {
  var blockOptions = {
    source: "test/fixtures/no-block/source",
    build: "test/fixtures/no-block/build",
  };
  rimraf.sync("test/fixtures/no-block/build");
  t.plan(2);
  staticSite(blockOptions, function (err, stats) {
    t.error(err);
    var file = fs.readFileSync(stats.pages[0], "utf8");
    t.equals(file, "side-aftercontent-after");
    rimraf.sync("test/fixtures/template/build");
  });
});

test("swig markdown tag", function (t) {
  rimraf.sync("test/fixtures/markdown/build");
  var markdownOptions = {
    source: "test/fixtures/markdown/source",
    build: "test/fixtures/markdown/build",
  };
  t.plan(2);
  staticSite(markdownOptions, function (err, stats) {
    t.error(err);
    var file = fs.readFileSync(stats.pages[0], "utf8");
    t.ok(
      file.includes(
        '<span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>',
      ),
    );
    rimraf.sync("test/fixtures/markdown/build");
  });
});

var customOptions = {
  source: "test/fixtures/templateEngine/source",
  build: "test/fixtures/templateEngine/build",
  templateEngine: "test/fixtures/templateEngine/source/engine.js",
};

test("custom template engine", function (t) {
  rimraf.sync("test/fixtures/templateEngine/build");
  t.plan(2);
  staticSite(customOptions, function (err, stats) {
    t.error(err);
    var file = fs.readFileSync(stats.pages[0], "utf8");
    t.equal(file, "This is sweet.");
    rimraf.sync("test/fixtures/templateEngine/build");
  });
});
