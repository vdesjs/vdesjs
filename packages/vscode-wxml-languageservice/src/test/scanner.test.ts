

import { createScanner } from '../parser/wxmlScanner';
import { TokenType, ScannerState } from '../wxmlLanguageTypes';
import * as assert from 'assert';

suite('wxml scanner', () => {
  interface Token {
    offset: number;
    type: TokenType;
    content?: string;
  }

  function assertTokens(tests: { input: string; tokens: Token[]; }[]) {
    let scannerState = ScannerState.WithinContent;
    for (const t of tests) {
      const scanner = createScanner(t.input, 0, scannerState);
      let tokenType = scanner.scan();
      const actual: Token[] = [];
      while (tokenType !== TokenType.EOS) {
        const actualToken: Token = { offset: scanner.getTokenOffset(), type: tokenType };
        if (tokenType === TokenType.StartTag || tokenType === TokenType.EndTag) {
          actualToken.content = t.input.substr(scanner.getTokenOffset(), scanner.getTokenLength());
        }
        actual.push(actualToken);
        tokenType = scanner.scan();
      }
      assert.deepStrictEqual(actual, t.tokens);
      scannerState = scanner.getScannerState();

    }
  }

  test('Open Start Tag #1', () => {
    assertTokens([{
      input: '<abc',
      tokens: [
        { offset: 0, type: TokenType.StartTagOpen },
        { offset: 1, type: TokenType.StartTag, content: 'abc' }
      ]
    }
    ]);
  });

  test('Embedded Content #1', () => {
		assertTokens([{
			input: '<wxs module="ff">var i= 10;</wxs>',
			tokens: [
				{ offset: 0, type: TokenType.StartTagOpen },
				{ offset: 1, type: TokenType.StartTag, content: 'wxs' },
				{ offset: 4, type: TokenType.Whitespace },
				{ offset: 5, type: TokenType.AttributeName },
				{ offset: 11, type: TokenType.DelimiterAssign },
				{ offset: 12, type: TokenType.AttributeValue },
				{ offset: 16, type: TokenType.StartTagClose },
				{ offset: 17, type: TokenType.Script },
				{ offset: 27, type: TokenType.EndTagOpen },
				{ offset: 29, type: TokenType.EndTag, content: 'wxs' },
				{ offset: 32, type: TokenType.EndTagClose }
			]
		}
		]);
	});



})