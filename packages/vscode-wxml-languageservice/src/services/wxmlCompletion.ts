
import { WXMLDocument, Node } from '../parser/wxmlParser';
import { createScanner } from '../parser/wxmlScanner';
import {
  CompletionConfiguration, ICompletionParticipant, ScannerState, TokenType, LanguageServiceOptions, DocumentContext,
  Position, CompletionList, CompletionItemKind, Range, TextEdit, InsertTextFormat, CompletionItem, MarkupKind, TextDocument
} from '../wxmlLanguageTypes';

import * as nls from 'vscode-nls';

import { isLetterOrDigit, endsWith, startsWith } from '../utils/strings';
import { WXMLDataManager } from '../languageFacts/dataManager';
import { isVoidElement } from '../languageFacts/fact';
import { isDefined } from '../utils/object';
import { generateDocumentation } from '../languageFacts/dataProvider';
import { PathCompletionParticipant } from './pathCompletion';

export class WXMLCompletion {
  completionParticipants: ICompletionParticipant[];
  private supportsMarkdown: boolean | undefined;

  constructor(private lsOptions: LanguageServiceOptions, private dataManager: WXMLDataManager) {
    this.completionParticipants = [];
  }

  setCompletionParticipants(registeredCompletionParticipants: ICompletionParticipant[]) {
    this.completionParticipants = registeredCompletionParticipants || [];
  }

  public async doComplete2(document: TextDocument, position: Position, wxmlDocument: WXMLDocument, documentContext: DocumentContext, settings?: CompletionConfiguration): Promise<CompletionList> {
    if (!this.lsOptions.fileSystemProvider || !this.lsOptions.fileSystemProvider.readDirectory) {
      return this.doComplete(document, position, wxmlDocument, settings);
    }

    const pathCompletion: PathCompletionParticipant = new PathCompletionParticipant(this.lsOptions.fileSystemProvider.readDirectory);


    const contributedParticipants = this.completionParticipants;
    this.completionParticipants = [pathCompletion as ICompletionParticipant].concat(contributedParticipants);

    const result = this.doComplete(document, position, wxmlDocument, settings);
    try {
      const pathCompletionResult = await pathCompletion.computeCompletions(document, documentContext);

      return {
        isIncomplete: result.isIncomplete || pathCompletionResult.isIncomplete,
        items: pathCompletionResult.items.concat(result.items)
      };
    } finally {
      this.completionParticipants = contributedParticipants;
    }
  }

  doComplete(document: TextDocument, position: Position, wxmlDocument: WXMLDocument, settings?: CompletionConfiguration): CompletionList {
    const result = this._doComplete(document, position, wxmlDocument, settings);
    return this.convertCompletionList(result);
  }

  private _doComplete(document: TextDocument, position: Position, wxmlDocument: WXMLDocument, settings?: CompletionConfiguration): CompletionList {
    const result: CompletionList = {
      isIncomplete: false,
      items: []
    };
    const completionParticipants = this.completionParticipants;
    const dataProviders = this.dataManager.getDataProviders().filter(p => p.isApplicable(document.languageId) && (!settings || settings[p.getId()] !== false));
    const doesSupportMarkdown = this.doesSupportMarkdown();

    const text = document.getText();
    const offset = document.offsetAt(position);

    const node = wxmlDocument.findNodeBefore(offset);
    if (!node) {
      return result;
    }

    const scanner = createScanner(text, node.start);
    let currentTag: string = '';
    let currentAttributeName: string;

    function getReplaceRange(replaceStart: number, replaceEnd: number = offset): Range {
      if (replaceStart > offset) {
        replaceStart = offset;
      }
      return { start: document.positionAt(replaceStart), end: document.positionAt(replaceEnd) };
    }

    function collectOpenTagSuggestions(afterOpenBracket: number, tagNameEnd?: number): CompletionList {
      const range = getReplaceRange(afterOpenBracket, tagNameEnd);
      dataProviders.forEach((provider) => {
        provider.provideTags().forEach(tag => {
          result.items.push({
            label: tag.name,
            kind: CompletionItemKind.Property,
            documentation: generateDocumentation(tag, undefined, doesSupportMarkdown),
            textEdit: TextEdit.replace(range, tag.name),
            insertTextFormat: InsertTextFormat.PlainText
          });
        });
      });
      return result;
    }

    function getLineIndent(offset: number) {
      let start = offset;
      while (start > 0) {
        const ch = text.charAt(start - 1);
        if ("\n\r".indexOf(ch) >= 0) {
          return text.substring(start, offset);
        }
        if (!isWhiteSpace(ch)) {
          return null;
        }
        start--;
      }
      return text.substring(0, offset);
    }

    function collectCloseTagSuggestions(afterOpenBracket: number, inOpenTag: boolean, tagNameEnd: number = offset): CompletionList {
      const range = getReplaceRange(afterOpenBracket, tagNameEnd);
      const closeTag = isFollowedBy(text, tagNameEnd, ScannerState.WithinEndTag, TokenType.EndTagClose) ? '' : '>';
      let curr: Node | undefined = node;
      if (inOpenTag) {
        curr = curr.parent; // don't suggest the own tag, it's not yet open
      }
      while (curr) {
        const tag = curr.tag;
        if (tag && (!curr.closed || curr.endTagStart && (curr.endTagStart > offset))) {
          const item: CompletionItem = {
            label: '/' + tag,
            kind: CompletionItemKind.Property,
            filterText: '/' + tag,
            textEdit: TextEdit.replace(range, '/' + tag + closeTag),
            insertTextFormat: InsertTextFormat.PlainText
          };
          const startIndent = getLineIndent(curr.start);
          const endIndent = getLineIndent(afterOpenBracket - 1);
          if (startIndent !== null && endIndent !== null && startIndent !== endIndent) {
            const insertText = startIndent + '</' + tag + closeTag;
            item.textEdit = TextEdit.replace(getReplaceRange(afterOpenBracket - 1 - endIndent.length), insertText);
            item.filterText = endIndent + '</' + tag;
          }
          result.items.push(item);
          return result;
        }
        curr = curr.parent;
      }
      if (inOpenTag) {
        return result;
      }

      dataProviders.forEach(provider => {
        provider.provideTags().forEach(tag => {
          result.items.push({
            label: '/' + tag.name,
            kind: CompletionItemKind.Property,
            documentation: generateDocumentation(tag, undefined, doesSupportMarkdown),
            filterText: '/' + tag.name + closeTag,
            textEdit: TextEdit.replace(range, '/' + tag.name + closeTag),
            insertTextFormat: InsertTextFormat.PlainText
          });
        });
      });
      return result;
    }

    function collectAutoCloseTagSuggestion(tagCloseEnd: number, tag: string): CompletionList {
      if (settings && settings.hideAutoCompleteProposals) {
        return result;
      }
      if (!isVoidElement(tag)) {
				const pos = document.positionAt(tagCloseEnd);
				result.items.push({
					label: '</' + tag + '>',
					kind: CompletionItemKind.Property,
					filterText: '</' + tag + '>',
					textEdit: TextEdit.insert(pos, '$0</' + tag + '>'),
					insertTextFormat: InsertTextFormat.Snippet
				});
			}

      return result;
    }

    function collectTagSuggestions(tagStart: number, tagEnd: number): CompletionList {
      collectOpenTagSuggestions(tagStart, tagEnd);
      collectCloseTagSuggestions(tagStart, true, tagEnd);
      return result;
    }

    function getExistingAttributes(): { [attribute: string]: boolean } {
      const existingAttributes = Object.create(null);
      node.attributeNames.forEach(attribute => {
        existingAttributes[attribute] = true;
      });
      return existingAttributes;
    }

    function collectAttributeNameSuggestions(nameStart: number, nameEnd: number = offset): CompletionList {
      let replaceEnd = offset;
      while (replaceEnd < nameEnd && text[replaceEnd] !== '<') { // < is a valid attribute name character, but we rather assume the attribute name ends. See #23236.
        replaceEnd++;
      }
      const currentAttribute = text.substring(nameStart, nameEnd);
      const range = getReplaceRange(nameStart, replaceEnd);
      const value = isFollowedBy(text, nameEnd, ScannerState.AfterAttributeName, TokenType.DelimiterAssign) ? '' : '="$1"';

      const seenAttributes = getExistingAttributes();
      // include current typing attribute
      seenAttributes[currentAttribute] = false;

      dataProviders.forEach(provider => {
        provider.provideAttributes(currentTag).forEach(attr => {
          if (seenAttributes[attr.name]) {
            return;
          }
          seenAttributes[attr.name] = true;

          let codeSnippet = attr.name;
          let command;
          if (attr.valueSet !== 'v' && value.length) {
            codeSnippet = codeSnippet + value;
            if (attr.valueSet) {
              command = {
                title: 'Suggest',
                command: 'editor.action.triggerSuggest'
              };
            } else if (attr.name === 'style' || attr.name === 'class' || attr.name === 'id') {
              command = {
                title: 'Suggest',
                command: 'editor.action.triggerSuggest'
              };
            } else if ( /^(bind\w+)$/i.test(attr.name)) {
              command = {
                title: 'Suggest',
                command: 'editor.action.triggerSuggest'
              };
            }
          }

          result.items.push({
            label: attr.name,
            kind: attr.valueSet === 'handler' ? CompletionItemKind.Function : CompletionItemKind.Value,
            documentation: generateDocumentation(attr, undefined, doesSupportMarkdown),
            textEdit: TextEdit.replace(range, codeSnippet),
            insertTextFormat: InsertTextFormat.Snippet,
            command
          });
        });
      });
      collectDataAttributesSuggestions(range, seenAttributes);
      return result;
    }

    function collectDataAttributesSuggestions(range: Range, seenAttributes: { [attribute: string]: boolean }) {

      const dataAttr = 'data-';
      const dataAttributes: { [name: string]: string } = {};

      dataAttributes[dataAttr] = `${dataAttr}$1="$2"`;

      function addNodeDataAttributes(node: Node) {
        node.attributeNames.forEach(attr => {
          if (startsWith(attr, dataAttr) && !dataAttributes[attr] && !seenAttributes[attr]) {
            dataAttributes[attr] = attr + '="$1"';
          }
        });
        node.children.forEach(child => addNodeDataAttributes(child));
      }

      if (wxmlDocument) {
        wxmlDocument.roots.forEach(root => addNodeDataAttributes(root));
      }
      Object.keys(dataAttributes).forEach(attr => result.items.push({
        label: attr,
        kind: CompletionItemKind.Value,
        textEdit: TextEdit.replace(range, dataAttributes[attr]),
        insertTextFormat: InsertTextFormat.Snippet
      }));
    }

    function collectAttributeValueSuggestions(valueStart: number, valueEnd: number = offset): CompletionList {
      console.log("wxmlCompletion collectAttributeValueSuggestions")
      let range: Range;
      let addQuotes: boolean;
      let valuePrefix: string;
      if (offset > valueStart && offset <= valueEnd && isQuote(text[valueStart])) {
        // inside quoted attribute
        const valueContentStart = valueStart + 1;
        let valueContentEnd = valueEnd;
        // valueEnd points to the char after quote, which encloses the replace range
        if (valueEnd > valueStart && text[valueEnd - 1] === text[valueStart]) {
          valueContentEnd--;
        }

        const wsBefore = getWordStart(text, offset, valueContentStart);
        const wsAfter = getWordEnd(text, offset, valueContentEnd);
        range = getReplaceRange(wsBefore, wsAfter);
        valuePrefix = offset >= valueContentStart && offset <= valueContentEnd ? text.substring(valueContentStart, offset) : '';
        addQuotes = false;
      } else {
        range = getReplaceRange(valueStart, valueEnd);
        valuePrefix = text.substring(valueStart, offset);
        addQuotes = true;
      }

      if (completionParticipants.length > 0) {
        const tag = currentTag.toLowerCase();
        const attribute = currentAttributeName.toLowerCase();
        const fullRange = getReplaceRange(valueStart, valueEnd);
        for (const participant of completionParticipants) {
          if (participant.onWxmlAttributeValue) {
            console.log("wxmlCompletion", participant)
            participant.onWxmlAttributeValue({ document, position, tag, attribute, value: valuePrefix, range: fullRange });
          }
        }
      }

      dataProviders.forEach(provider => {
        provider.provideValues(currentTag, currentAttributeName).forEach(value => {
          const insertText = addQuotes ? '"' + value.name + '"' : value.name;

          result.items.push({
            label: value.name,
            filterText: insertText,
            kind: CompletionItemKind.Unit,
            documentation: generateDocumentation(value, undefined, doesSupportMarkdown),
            textEdit: TextEdit.replace(range, insertText),
            insertTextFormat: InsertTextFormat.PlainText
          });
        });
      });
      return result;
    }

    function scanNextForEndPos(nextToken: TokenType): number {
      if (offset === scanner.getTokenEnd()) {
        token = scanner.scan();
        if (token === nextToken && scanner.getTokenOffset() === offset) {
          return scanner.getTokenEnd();
        }
      }
      return offset;
    }

    function collectInsideContent(): CompletionList {
      for (const participant of completionParticipants) {
        if (participant.onWxmlContent) {
          participant.onWxmlContent({ document, position });
        }
      }

      return result;

    }





    let token = scanner.scan();

    while (token !== TokenType.EOS && scanner.getTokenOffset() <= offset) {
      switch (token) {
        case TokenType.StartTagOpen:
          if (scanner.getTokenEnd() === offset) {
            const endPos = scanNextForEndPos(TokenType.StartTag);
            return collectTagSuggestions(offset, endPos);
          }
          break;
        case TokenType.StartTag:
          if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
            return collectOpenTagSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
          }
          currentTag = scanner.getTokenText();
          break;
        case TokenType.AttributeName:
          if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
            return collectAttributeNameSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
          }
          currentAttributeName = scanner.getTokenText();
          break;
        case TokenType.DelimiterAssign:
          if (scanner.getTokenEnd() === offset) {
            const endPos = scanNextForEndPos(TokenType.AttributeValue);
            return collectAttributeValueSuggestions(offset, endPos);
          }
          break;
        case TokenType.AttributeValue:
          if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
            return collectAttributeValueSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
          }
          break;
        case TokenType.Whitespace:
          if (offset <= scanner.getTokenEnd()) {
            switch (scanner.getScannerState()) {
              case ScannerState.AfterOpeningStartTag:
                const startPos = scanner.getTokenOffset();
                const endTagPos = scanNextForEndPos(TokenType.StartTag);
                return collectTagSuggestions(startPos, endTagPos);
              case ScannerState.WithinTag:
              case ScannerState.AfterAttributeName:
                return collectAttributeNameSuggestions(scanner.getTokenEnd());
              case ScannerState.BeforeAttributeValue:
                return collectAttributeValueSuggestions(scanner.getTokenEnd());
              case ScannerState.AfterOpeningEndTag:
                return collectCloseTagSuggestions(scanner.getTokenOffset() - 1, false);
              case ScannerState.WithinContent:
                return collectInsideContent();
            }
          }
          break;
        case TokenType.EndTagOpen:
          if (offset <= scanner.getTokenEnd()) {
            const afterOpenBracket = scanner.getTokenOffset() + 1;
            const endOffset = scanNextForEndPos(TokenType.EndTag);
            return collectCloseTagSuggestions(afterOpenBracket, false, endOffset);
          }
          break;
        case TokenType.EndTag:
          if (offset <= scanner.getTokenEnd()) {
            let start = scanner.getTokenOffset() - 1;
            while (start >= 0) {
              const ch = text.charAt(start);
              if (ch === '/') {
                return collectCloseTagSuggestions(start, false, scanner.getTokenEnd());
              } else if (!isWhiteSpace(ch)) {
                break;
              }
              start--;
            }
          }
          break;
        case TokenType.StartTagClose:
          if (offset <= scanner.getTokenEnd()) {
            if (currentTag) {
              return collectAutoCloseTagSuggestion(scanner.getTokenEnd(), currentTag);
            }
          }
          break;

        case TokenType.Content:
          if (offset <= scanner.getTokenEnd()) {
            return collectInsideContent();
          }
          break;
        default:
          if (offset <= scanner.getTokenEnd()) {
            return result;
          }
          break;
      }
      token = scanner.scan();
    }

    return result;
  }

  doTagComplete(document: TextDocument, position: Position, wxmlDocument: WXMLDocument): string | null {
    const offset = document.offsetAt(position);
    if (offset <= 0) {
      return null;
    }
    const char = document.getText().charAt(offset - 1);
    if (char === '>') {
      const node = wxmlDocument.findNodeBefore(offset);
      if (node && node.tag && !isVoidElement(node.tag) && node.start < offset && (!node.endTagStart || node.endTagStart > offset)) {
        const scanner = createScanner(document.getText(), node.start);
        let token = scanner.scan();
        while (token !== TokenType.EOS && scanner.getTokenEnd() <= offset) {
          if (token === TokenType.StartTagClose && scanner.getTokenEnd() === offset) {
            return `$0</${node.tag}>`;
          }
          token = scanner.scan();
        }
      }

    } else if (char === '/') {
      let node: Node | undefined = wxmlDocument.findNodeBefore(offset);
      while (node && node.closed && !(node.endTagStart && (node.endTagStart > offset))) {
        node = node.parent;
      }
      if (node && node.tag) {
        const scanner = createScanner(document.getText(), node.start);
        let token = scanner.scan();
        while (token !== TokenType.EOS && scanner.getTokenEnd() <= offset) {
          if (token === TokenType.EndTagOpen && scanner.getTokenEnd() === offset) {
            return `${node.tag}>`;
          }
          token = scanner.scan();
        }
      }
    }
    return null;
  }

  private convertCompletionList(list: CompletionList) {
    if (!this.doesSupportMarkdown()) {
      list.items.forEach(item => {
        if (item.documentation && typeof item.documentation !== 'string') {
          item.documentation = {
            kind: 'plaintext',
            value: item.documentation.value
          };
        }
      });
    }

    return list;
  }

  private doesSupportMarkdown(): boolean {
    if (!isDefined(this.supportsMarkdown)) {
      if (!isDefined(this.lsOptions.clientCapabilities)) {
        this.supportsMarkdown = true;
        return this.supportsMarkdown;
      }

      const documentationFormat = this.lsOptions.clientCapabilities.textDocument?.completion?.completionItem?.documentationFormat;
      this.supportsMarkdown = Array.isArray(documentationFormat) && documentationFormat.indexOf(MarkupKind.Markdown) !== -1;
    }
    return <boolean>this.supportsMarkdown;
  }



}



function isQuote(s: string): boolean {
  return /^["']*$/.test(s);
}

function isWhiteSpace(s: string): boolean {
  return /^\s*$/.test(s);
}

function isFollowedBy(s: string, offset: number, intialState: ScannerState, expectedToken: TokenType) {
  const scanner = createScanner(s, offset, intialState);
  let token = scanner.scan();
  while (token === TokenType.Whitespace) {
    token = scanner.scan();
  }
  return token === expectedToken;
}

function getWordStart(s: string, offset: number, limit: number): number {
  while (offset > limit && !isWhiteSpace(s[offset - 1])) {
    offset--;
  }
  return offset;
}

function getWordEnd(s: string, offset: number, limit: number): number {
  while (offset < limit && !isWhiteSpace(s[offset])) {
    offset++;
  }
  return offset;
}
