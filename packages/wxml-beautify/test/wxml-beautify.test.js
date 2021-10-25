const wxmlBeautify = require('../src/index');
var assert = require('assert');

function wxmlTest(obj) {
  it(obj.info, () => {
    assert.equal(wxmlBeautify.wxml(obj.input.join("\n"), {
      indent_size: 2
    }), obj.output.join("\n"));
  });
}

describe('wxml-beautify', () => {
  wxmlTest({
    info: "basic",
    input: [
      "<div>   dd    </div>"
    ],
    output: [
      "<div> dd </div>"
    ]
  });

  wxmlTest({
    info: "wxs",
    input: [
      "<wxs>",
      "</wxs>"
    ],
    output: [
      "<wxs>",
      "</wxs>"
    ]
  });


  wxmlTest({
    info: "wxs module.export",
    input: [
      "<wxs>",
      "module.exports = {",
      `ff: 'ff'`,
      "}",
      "</wxs>"
    ],
    output: [
      "<wxs>",
      "  module.exports = {",
      `    ff: 'ff'`,
      "  }",
      "</wxs>"
    ]
  });




});
