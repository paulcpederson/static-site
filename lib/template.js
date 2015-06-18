var Promise = require('es6-promise').Promise
var cons = require('consolidate')

cons.swig('views/page.html', { user: 'tobi' })
  .then(function (html) {
    console.log(html);
  })
  .catch(function (err) {
    throw err;
  });

function template (pages) {
  return Promise.resolve(pages)
}

module.exports = template
