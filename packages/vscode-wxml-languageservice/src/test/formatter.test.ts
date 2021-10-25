
import { getLanguageService, TextDocument, Range } from '../wxmlLanguageService';
import * as assert from 'assert';

suite('json formatter', () => {
  function format(unformatted: string, expected: string, insertSpaces = true) {
    let range: Range | undefined = void 0;
    const uri = 'test://test.html';

    const rangeStart = unformatted.indexOf('|');
    const rangeEnd = unformatted.lastIndexOf('|');

    if (rangeStart !== -1 && rangeEnd !== -1) {
      // remove '|'
      unformatted = unformatted.substring(0, rangeStart) + unformatted.substring(rangeStart + 1, rangeEnd) + unformatted.substring(rangeEnd + 1);
      var unformattedDoc = TextDocument.create(uri, 'html', 0, unformatted);
      const startPos = unformattedDoc.positionAt(rangeStart);
      const endPos = unformattedDoc.positionAt(rangeEnd - 1);
      range = Range.create(startPos, endPos);
    }

    var document = TextDocument.create(uri, 'html', 0, unformatted);
    const edits = getLanguageService().format(document, range, { tabSize: 2, insertSpaces: insertSpaces, unformatted: '' });
    const formatted = TextDocument.applyEdits(document, edits);
    assert.equal(formatted, expected);


  }

  test('full document', () => {
    var content = [
      '<div  class = "foo">',
      '<br>',
      ' </div>'
    ].join('\n');

    var expected = [
      '<div class="foo">',
      '  <br>',
      '</div>',
    ].join('\n');

    format(content, expected);
  });
})
