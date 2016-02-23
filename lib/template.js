var Promise = require('es6-promise').Promise
var swig = require('swig')
var path = require('path')
var isMarkdown = require('./utils/is-markdown')
var MarkdownIt = require('markdown-it')
var hljs = require('highlight.js')
var extras = require('swig-extras')

var filters = ['batch', 'groupby', 'markdown', 'nl2br', 'pluck', 'split', 'trim', 'truncate']

filters.forEach(function (filter) {
  extras.useFilter(swig, filter)
})

extras.useTag(swig, 'markdown')
extras.useTag(swig, 'switch')
extras.useTag(swig, 'case')

var markdown = MarkdownIt({
  html: true,
  langPrefix: '',
  highlight: function (code, lang) {
    var highlighted = lang ? hljs.highlight(lang, code) : hljs.highlightAuto(code)
    return highlighted.value
  }
})

function swigTemplate (page) {
  var template = isMarkdown(page.file) ? markdown.render(page.content) : page.content

  if (page.template) {
    var templatePath = path.join(this.sourcePath, page.template)
    var block = page.block || 'content'
    var wrapped = '{% block ' + block + '%}' + template + '{% endblock %}'
    template = '{% extends "' + templatePath + '" %}' + wrapped
  }

  var html = swig.render(template, {
    filename: page.file,
    locals: page
  })

  return Promise.resolve({
    dest: page.dest,
    contents: html
  })
}

function custom (engine, page) {
  var _this = this
  return new Promise(function (resolve, reject) {
    try {
      var jsModule = require(engine)
    } catch (e) {
      return reject(e)
    }
    jsModule(_this.options, page.content, page, function (err, result) {
      if (err) { return reject(err) }
      return resolve({
        dest: page.dest,
        contents: result
      })
    })
  })
}

function template (context, pages) {
  var engine = context.templateEngine ? custom.bind(context, context.templateEngine) : swigTemplate.bind(context)
  var templatedPages = pages.map(engine)
  return Promise.all(templatedPages)
}

module.exports = function (context) {
  return template.bind(null, context)
}
