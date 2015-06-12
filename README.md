# Static Site

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]

[npm-image]: https://img.shields.io/npm/v/static-site.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/static-site
[travis-image]: https://img.shields.io/travis/paulcpederson/static-site.svg?style=flat-square
[travis-url]: https://travis-ci.org/paulcpederson/static-site

> A simple static site generator

# Use

Static Site has both a Node API, as well as a CLI.

## Node API

```
var staticSite = require('static-site')

staticSite(options, function (err, sitemap) {
  console.log(sitemap) // complete sitemap of what pages were rendered
})
```

## CLI

```
static-site --help

-b, --build             Name of build folder
-s, --source            Name of source folder
-d, --data              Name of data folder
-l, --layouts           Name of layouts folder
-i, --ignore            Array of glob patterns to ignore
-f, --files             File extensions to match
-c, --clean             Remove files generated from previous builds
-t, --templateEngine    Template engine to use for each page
```

# Options

The options for Static Site are below (with their default values).

| Option         | Default Value                   | Description |
| -------------- | ------------------------------- | ----------- |
| build          | `'build'`                       | path to build folder |
| source         | `'source'`                      | path to source folder |
| data           | `'data'`                        | path to data folder |
| layouts        | `'layouts'`                     | path to layouts folder |
| ignore         | `['assets/**']`                 | array of globs to ignore |
| files          | `['.html', '.md', '.markdown']` | array of file extentions to parse |
| clean          | `false`                         | remove all files in build folder before building |
| templateEngine | `'hogan'`                       | which template engine to use from [consolidate.js](https://github.com/tj/consolidate.js#supported-template-engines) |


# Getting started

To get started using static-site, just install it:

```
npm install static-site --save-dev
```

After that, you can add a script to your `package.json` that runs the build:


```
  "scripts": {
    "build": "static-site"
  }
```

Now you can use `npm run build` to run static site with the [default options](#options). To change the options, you can either use the [cli flags](#cli) to change them, or list them in your `package.json` under the `static-site` key:

```
  "static-site": {
    "templateEngine": 'jade',
    "build": "dist"
  }
```

Now when you build, static site will use the Jade template engine and build to a folder called `dist`.

## Front Matter

Front matter provides an easy way to add data to each page. Front matter is formatted like yaml, and surrounded by three hyphens on top and bottom:

```
---
title: 'Title of Page'
description: 'Description of Page'
arrayOfThings:
  - thing1
  - thing2
---
```

## Templates

By default, static-site uses [hogan.js](http://twitter.github.io/hogan.js/) templates, but you can use whatever template-engine your heart desires. Static Site uses [consolidate.js](https://github.com/tj/consolidate.js) to render templates, so you can use any template engine supported by consolidate (which is [a lot](https://github.com/tj/consolidate.js#supported-template-engines)).

To use a different template engine, just set the `templateEngine` option to the engine you want to use. For example, to use swig, just set `templateEngine: 'swig'`.

## Data

JSON, YML, and JavaScript are all valid data formats. To access data from a page, make sure you have a data file in the data folder like `posts.json` and then state which data you need in the `data` front matter field:

```
---
title: 'Title of Page'
description: 'Description of Page'
data:
  - posts.json
---
```

In your page, you can get this data by using the word `posts`. The variable name is always the file name without its extension.

```
{{data.posts}}
```

Yaml and JSON data files are simply static data, but JavaScript files can be anything, even asynchronous data. JavaScript data files should export a single function. That function will be called with a sitemap object, the current page, and a callback function. For example, say you had the following front matter:

```
category: Bears
data:
  - bears.js
```

If you wanted to add an array of all the posts in the 'Bears' category, you can create a `bears.js` file in the data folder that adds the data to each page. Data files are called with the site (array of pages), the particular page (object), and `done`:

```js
module.exports = function (site, page, done) {
  var bears = site.filter(function (p) {
    return p.category === 'Bears'
  })
  page.data.bears = bears
  done()
}
```

Now by adding `bears.js` to your page's metadata, you can use `{{data.bears}}` in your page.

Or, if you wanted to add a 'next' and 'previous' link to each post, you could create a data file with the following:

```js
module.exports = function (site, page, done) {

  var posts = site.filter(function (p) {
    return p.url.includes('/posts/')
  })

  var index = posts.indexOf(page)
  page.data.next = posts[index + 1] || posts[0]
  page.data.prev = posts[index - 1] || posts[posts.length - 1]

  done()
}
```

Now anything in the `posts` folder will have a `{{data.next}}` and `{{data.prev}}` key.

# Why

> There are 4 million static site generators out there, why build another one?

Totally valid point. I began this journey by looking through almost every static site generator on npm. It seemed so stupid to reinvent a wheel that seemingly everybody has invented. After trying a lot of them out, and weighing my options, I still felt that they were lacking. Not in features, but in *focus*. Most of them lock you into a particular way of working. They are immense, opinionated structures that try to do everything for you. They include a cli that generates scaffolds, a server, a file watcher, and all kinds of other features.

Static-site isn't a magic bullet. It doesn't do everything for you. It doesn't have a scaffolding command, or a server, or a cute name. Instead, it just does one thing: take a folder of files and data and compile `html` from it (even that is done in a pretty naive way...). In my mind, if you can't cover the capabilities of a module in a basic `README`, it is probably too big. Keep the thing small, focused, and flexible. Do just enough for the developer, but don't try to do everything.

## Contributing

Contributions welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

[ISC](LICENSE.md)
