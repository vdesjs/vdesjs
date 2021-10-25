const path = require('path');

module.exports = {
  input: path.resolve(__dirname, 'src/index.js'),
  output: [
    {
      file: "dist/index.js",
      format: 'cjs'
    },
    {
      file: "dist/index.es.js",
      format: "es"
    }
  ],

  plugins: [

  ]



}