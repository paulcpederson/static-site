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

staticSite(options, function (err, site, stats) {
  console.log(site)  // array of pages built
  console.log(stats) // {pages: 14, start: 1434175863750, end: 1434175863770, duration: 20}
})
```

## CLI

```
static-site --help

-b, --build             Name of build folder
-s, --source            Name of source folder
-i, --ignore            Array of glob patterns to ignore
-h, --helpers           Array of helper files to run
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
| ignore         | `['assets/**']`                 | array of globs to ignore |
| helpers          | `[]`                          | array of helper files to run |
| files          | `['html', 'md', 'markdown']`    | array of file extentions to parse |
| clean          | `false`                         | remove all files in build folder before building |
| templateEngine | `false`                       | path to templateEngine |


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

Now when you build, static site will use the Jade template engine and build to a folder called `dist`. Static Site has four basic building blocks:

- [Front Matter](#front-matter) — data stored at the top of each page
- [Data Files](#data) — data stored in separate files (Yaml, JSON, JavaScript)
- [Helpers](#helpers) — helper functions that manipulate the site
- [Templates](#templates) — templates for rendering page data

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

Both `{{title}}` and `{{description}}` are now available to your templates as strings, while `{{arrayOfThings}}` is available as an array.
Static Site uses [gray-matter](https://www.npmjs.com/package/gray-matter) for parsing front matter which allows for quite a bit of flexibility. If you want you can write your front matter as JSON or even CoffeeScript. To change how your front matter is interpretted, just add the language [after the firt delimiter](https://www.npmjs.com/package/gray-matter#options-lang).

## Data

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

JavaScript data files should export a single function that will be called with the page and a callback function. In this way you can add asynchronous data to a page. Say for instance, you wanted to add a list of your GitHub repos everytime you build the site. First, you would add the data file to your page's frontmatter:

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
var url = 'https://api.github.com/users/paulcpederson/repos'

module.exports = function (page, cb) {
  request(url, function (error, response, body) {
    if (error) {
      return cb(error)
    }
    return cb(null, body)
  })
}
```

Now the response of the request is available as `{{data.repos}}`.

## Helpers

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
  return page.url.includes('/posts/')
}

module.exports = function (site, page, done) {
  var posts = site.filter(isPost)
  site = site.map(function (page) {
    if (isPost(page)) {
      var index = posts.indexOf(page)
      page.next = posts[index + 1] || posts[0]
      page.prev = posts[index - 1] || posts[posts.length - 1]
    }
  })
  cb(null, site)
}
```

Now anything in the `posts` folder will have a `{{next}}` and `{{prev}}` key holding the next or previous post.

## Templates

By default, static-site uses [swig](http://paularmstrong.github.io/swig/) templates, but you can use whatever template-engine your heart desires. To use a different template engine, just add the path to your template engine as the `templateEngine` option. The template engine file should be a module that exports a single function. While building each page Static Site will call that function with your site options, the page content, the page's data, and a callback function. For example, to use [jade](http://jade-lang.com/) instead of swig, just use:

```
var jade = require('jade')

function (options, template, data, cb) {
  var fn = jade.compile(template, {})
  var html = fn(data)
  cb(null, html)
}
```

Assuming you have that saved to a file named `render.js`, you can now run `static-site -t render.js` and your templates will now be parsed as Jade instead of swig.

### Using Swig

Static site sets up swig partials and templates for you out of the box. Using a specific template on a page is as easy as pointing to it  in your front matter:

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

The content of the page will be inserted into the content block in the template.

Templates can also [extend other templates](http://paularmstrong.github.io/swig/docs/#inheritance) and [include partials](http://paularmstrong.github.io/swig/docs/tags/#include), so you could have a main layout template you use for every page, and a dedicated post tmeplate which extends the main layout.

> `templates/main.html`

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

> `templates/post.html`

```
{% extends 'layout.html' %}
{% include "post-sidebar.html" %}
{% block content %}{% endblock %}
```

Now all of your pages which point to the post layout will get the sidebar.

### Page Properties

Inside your template you will have access to the front matter of each page, plus a few other properties of the page that Static Site gives you for free:

- `url` - the URL of the page
- `root` - relative path to the site's root
- `dest` - filepath to built file
- `file` - filepath to source file
- `isMarkdown` - whether the source file was markdown
- `content` - the actual text content of the post

The `root` property is especially useful for things like stylesheets:

```
<link rel="stylesheet" href="{{root}}/css/screen.css">
```

# Why

> There are 4 million static site generators out there, why build another one?

Totally valid point. I began this journey by looking through almost every static site generator on npm (there are hundreds, but many are undocumented or empty). It seemed so stupid to reinvent a wheel that seemingly everybody has invented. After trying a lot of them out, and weighing my options, I still felt that they were lacking. Not in features, but in *focus*. Most of them lock you into a particular way of working. They are immense, opinionated structures that try to do everything for you. They include a cli that generates scaffolds, a server, a file watcher, and all kinds of other features.

Static-site isn't a magic bullet. It doesn't do everything for you. It doesn't have a scaffolding command, or a server, or a cute name. And it probably won't scale up to hundreds and thousands of pages. Instead, it just does one thing: take a folder of files and data and turn it into HTML. It's up to you to figure out how to preprocess your Sass, or bundle JavaScript, or run a development server. It's up to you to watch files and figure out a task runner. Static Site is for developers working on small DIY projects. Hopefully it's useful to you.

## Contributing

Contributions welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

[ISC](LICENSE.md)
