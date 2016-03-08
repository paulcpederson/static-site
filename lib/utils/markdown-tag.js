module.exports = {
  safe: true,
  parse: function (str, line, parser, types, options) {
    parser.on('*', function () {
      throw new Error('The markdown tag does not accept arguments')
    })
    return true
  },
  compile: function (compiler, args, content, parents, options, blockName) {
    return [
      '(function () {',
      '  var __o = _output;',
      '  _output = "";',
      compiler(content, parents, options, blockName) + ';',
      '  __o += _ext.markdown(_output);',
      '  _output = __o;',
      '})();'
    ].join('\n')
  }
}
