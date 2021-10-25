var path = require('path');

module.exports = {
  mode: 'none',
  entry: "./src/index.js",
  devtool: 'source-map',
  output: {
    library: 'wxmlBeautify',
    libraryTarget: 'umd',
    filename: 'wxml-beautify.js',
    path: path.resolve(__dirname, 'lib'),
    globalObject: "typeof self !== 'undefined' ? self : typeof windows !== 'undefined' ? window : typeof global !== 'undefined' ? global : this"

  }
}