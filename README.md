# Static Site

> A simple static site generator

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/static-site.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/static-site
[travis-image]: https://img.shields.io/travis/paulcpederson/static-site.svg?style=flat-square
[travis-url]: https://travis-ci.org/paulcpederson/static-site
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

## Install

```
npm install static-site -g
```

## Usage

Static Site has both a Node API, as well as a CLI.

### Node API

```js
var staticSite = require('static-site')

staticSite(options, function (err, stats) {
  console.log(stats) // {pages: [...], source: '', build: '', start: 1434175863750, end: 1434175863770, duration: 20}
})
```

### CLI

```
Usage: static-site [options]

Options:
  -b, --build           Path to build folder
  -s, --source          Path to source folder
  -f, --files           Array of file extensions to compile
  -i, --ignore          Array of paths in source folder to ignore
  -h, --helpers         Array of site helpers to run
  -t, --templateEngine  Template engine to use
  -v, --verbose         Enable verbose logging
  -w, --watch           Watch file tree for changes and rebuild
  --help                Show help
  --version             Show version number
```

### Options

The options for Static Site are below (with their default values).

| Option | Default Value | Description |
| ------ | ------------- | ----------- |
| build  | `'build'` | path to build folder |
| source | `'source'` | path to source folder |
| ignore | `[]` | array of globs to ignore (in addition to files and folders with underscores) |
| helpers | `[]` | array of helper files to run |
| files | `['html', 'md', 'markdown']` | array of file extentions to parse (in addition to default extensions) |
| templateEngine | `false` | path to custom template engine file  |

**ProTip** If you pass an option that Static Site doesn't recognize, it will add that option to each page's frontmatter. For example, if you run `static-site --production`, then in your template you can check for the `{{production}}` variable. Frontmatter will override data added with extra options, making this a good way to set default templates as well.

## Getting started

To get started using Static Site, just install it:

```
npm install static-site --save-dev
```

After that, you can add a script to your `package.json` that runs the build:

```
  "scripts": {
    "build": "static-site"
  }
```

Now you can use `npm run build` to run Static Site with the [default options](#options). To change the options, you can either use the [cli flags](#cli) to change them, or list them in your `package.json` under the `static-site` key:

```
  "static-site": {
    "templateEngine": 'my-engine.js',
    "build": "dist"
  }
```

Now when you build, Static Site will use your custom template engine and build to a folder called `dist`. Options set in the command line will override options set with via `package.json`.

## How

Static Site has five basic building blocks:

- [Front Matter](#front-matter) — data stored at the top of each page
- [Data Files](#data) — data stored in separate files (Yaml, JSON, JavaScript)
- [Helpers](#helpers) — helper functions that manipulate the site
- [Collections](#collections) — grouped pages
- [Templates](#templates) — templates for rendering page data

### Front Matter

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

Both `{{title}}` and `{{description}}` are now available to your templates as strings, while `{{arrayOfThings}}` is available as an array.
Static Site uses [gray-matter](https://www.npmjs.com/package/gray-matter) for parsing front matter which allows for quite a bit of flexibility. You can write your front matter as JSON or even CoffeeScript. To change how your front matter is interpreted, just add the language [after the first delimiter](https://www.npmjs.com/package/gray-matter#options-lang).

Static Site creates pretty urls automatically. For example, if you have a file called `about.html` it will be built to `about/index.html`. This means you can link to `/about/` which is a better url for a human being. If you'd like to turn this off for a particular page, just set `prettyUrl` to `false` in the page's frontmatter.

If you don't want pretty urls at all, you can set `prettyUrl` to `false` in the main options, or pass `--prettyUrl false` as an additional command line argument.

### Data

JSON, YML, and JavaScript are all valid data formats. Say you have a file named `posts.json` in a folder called `data`. To add that data to a page, just add the path to the file:

```
---
title: 'Title of Page'
description: 'Description of Page'
data:
  posts: data/posts.json
---
```

In your page, you can get this data by using:

```
{{data.posts}}
```

JavaScript data files should export a single function that will be called with the page and a callback function. In this way you can add asynchronous data to a page. Say for instance, you wanted to add a list of your GitHub repos to a page. First, you would add the data file to your page's frontmatter:

```
---
title: 'Title of Page'
description: 'Description of Page'
data:
  repos: data/repos.js
---
```

Then in `data/repos.js` you would use something along these lines:

```js
var request = require('request')
var options = {
  url: 'https://api.github.com/users/paulcpederson/repos',
  headers: {
    'User-Agent': 'static-site'
  }
}

module.exports = function (page, cb) {
  request(options, function (error, response, body) {
    if (error) {
      return cb(error)
    }
    return cb(null, body)
  })
}
```

Now the response of the request is available as `{{data.repos}}`.

### Helpers

Helpers add the ability to manipulate pages at a site level. Helpers are just JavaScript files which export a single function. This function will be called with the site array and an error-first callback. You can do anything you want to the site, and then send the new site to the callback. Helpers are run after data and before templates.

For an example, say you had the following front matter:

```
category: Bears
```

If you wanted to add an array of all the posts in the 'Bears' category, you can create a `helpers/bears.js` file that adds those posts as an array to the page. Helpers are called with the site (array of pages) and an error-first callback:

```js
module.exports = function (site, cb) {
  var bears = site.filter(function (p) {
    return p.category === 'Bears'
  })
  site = site.map(function (page) {
    page.bears = bears
    return page
  })
  cb(null, site)
}
```

Then, to run the helper when you build, just use the `-h` flag and pass a list of all the helpers. For the above example, you can run:

```
static-site -h helpers/bears.js
```

If you had a lot of helpers, you can put them in a folder and glob it:

```
static-site -h helpers/*.js
```

As another example, if you want to add a `next` and `prev` link to all the blog posts, you could create a helper at `helpers/next-prev.js` that looks like this:

```js
function isPost (page) {
  return page.url.indexOf('/articles/') > -1
}

module.exports = function (site, cb) {
  var posts = site.filter(isPost).sort(function (a, b) {
    return new Date(b.date) - new Date(a.date)
  })
  site = site.map(function (page) {
    if (isPost(page)) {
      var index = posts.indexOf(page)
      page.prev = posts[index + 1] || posts[0]
      page.next = posts[index - 1] || posts[posts.length - 1]
    }
  })
  cb(null, site)
}
```

Now anything in the `posts` folder will have a `{{next}}` and `{{prev}}` key holding the next or previous post.

### Collections

Because helpers that simply find all the pages with a given path are so common, static-site provides an easier way to group pages called a *collection*. For example, say you were writing an index page for a blog and you wanted to add a list of blog articles. You could write a helper to do this (like above), or you could use a collection:

```
---
title: Blog Index
collections:
  articles: /blog/*
---
```

And in your template, you'll have an array of each page one level deep as `collections.articles` which you can use in your template like:

```
{% for article in collections.articles %}
  {{article.title}}
{% endfor %}
```

Collections are automatically sorted by the `date` of each page if you've specified one. Otherwise, they'll come back in the order they appear in your file system (alphabetical).

The glob you pass to your collection will simply be checked against each page url with [minimatch](https://github.com/isaacs/minimatch). If minimatch returns true, the page will be added to the collection.

### Templates

By default, static-site uses [swig](http://node-swig.github.io/swig-templates/) templates, but you can use whatever template-engine your heart desires. To use a different template engine, just add the path to your template engine as the `templateEngine` option. The template engine file should be a module that exports a single function. While building each page Static Site will call that function with your site options, the page content, the page's data, and a callback function. For example, to use [jade](http://jade-lang.com/) instead of swig, just use:

```
var jade = require('jade')

function (options, content, data, cb) {
  var fn = jade.compile(content, {})
  var html = fn(data)
  cb(null, html)
}
```

Assuming you have that saved to a file named `render.js`, you can now run `static-site -t render.js` and your templates will now be parsed as Jade instead of swig.

#### Using Swig

You can define a template for a page inside the body of your page, for example:

```
---
title: Using native swig syntax for template extension
---
{% extends 'templates/post.html' %}
{% block content %}
  Yay! this is the content that will go in between the header and the footer.
{% endblock %}
```

However, Static-Site also sets up swig partials and templates for you via keys in the frontmatter, so you can also use a specific template on a page by pointing to it in your front matter:

```
---
template: templates/post.html
---
```

Now that page will use the post template, which could look something like this:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>{{title}}</title>
</head>
<body>
  {% include "header.html" %}
  {% block content %}{% endblock %}
  {% include "footer.html" %}
</body>
</html>
```

In your template, you'll have access to all swig [tags](http://node-swig.github.io/swig-templates/docs/tags/) and [filters](http://node-swig.github.io/swig-templates/docs/filters/). In addition, the [swig-extras](https://github.com/paularmstrong/swig-extras) library has been added, giving you access to more tags and filters like `{% markdown %}` and `|groupby`. Swig-extras is not documented well, but [the tests](https://github.com/paularmstrong/swig-extras/tree/master/tests) show example usage of these additional tags and filters.

By default, the content of the page will be inserted into the content block in the template. You can set the block name with the `block` key in your frontmatter to change the block the content will be rendered to. For example using `block: post` will instert the content into the `post` block in whatever template you are using. This is useful for layouts which extend a main layout (below).

Templates can [extend other templates](http://node-swig.github.io/swig-templates/docs/#inheritance) and [include partials](http://node-swig.github.io/swig-templates/docs/tags/#include), so you could have a main layout template you use for every page, and a dedicated post template which extends the main layout.

> `_templates/main.html`

```
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>{{title}}</title>
</head>
<body>
  {% include "header.html" %}
  {% block content %}{% endblock %}
  {% include "footer.html" %}
</body>
</html>
```

> `_templates/post.html`

```
{% extends 'layout.html' %}
{% block content %}
  {% include "post-sidebar.html" %}
  {% block post %}{% endblock %}
{% endblock %}
```

Now all of your pages which point to the post layout will get the sidebar. Those pages should use `template: _templates/post.html` and `block: post` in their frontmatter.

#### Page Properties

Inside your template you will have access to the front matter of each page, plus a few other properties of the page that Static Site gives you for free:

- `url` - the URL of the page
- `root` - relative path to the site's root
- `dest` - filepath to built file
- `file` - filepath to source file
- `isMarkdown` - whether the source file was markdown
- `content` - the actual text content of the post

## Why

> There are 4 million static site generators out there, why build another one?

Totally valid point. I began by looking through almost every Static Site generator on npm (there are hundreds, but many are undocumented or empty). Most of them are meant for large projects with hundreds of pages. They include a cli that generates scaffolds, a server and all kinds of other features.

Static-site doesn't do everything for you. It doesn't have a scaffolding command, or a server, or a cool name. And it probably won't scale up to hundreds of pages. Instead, it just does one thing: take a folder of files and data and turn it into HTML. It's up to you to figure out how to compile your Sass, or bundle JavaScript, or run a development server. It's up to you to figure out a task runner. Static Site is for developers working on small DIY projects who need a hammer, not a nail gun. I built it to use for my blog, but hopefully it is useful to you.

## Contributing

Contributions welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

[ISC](LICENSE.md)
