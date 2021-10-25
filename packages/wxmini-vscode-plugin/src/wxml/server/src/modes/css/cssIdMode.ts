
import { LanguageModelCache, getLanguageModelCache } from '../../languageModelCache';
import { CompletionItemKind } from 'vscode-languageserver-types';
import { FileType, RequestService } from '../../requests';
import {
  CompletionItem,
  Definition, TextDocument, Range,
  CompletionList, Position,
  LanguageMode, Settings, Workspace, DocumentContext
} from '../languageModes';
import { WXMLDocumentRegions } from '../embeddedSupport';
const css = require('css');



export function getCssIdMode(documentRegions: LanguageModelCache<WXMLDocumentRegions>, fileSystemProvider: RequestService): LanguageMode {
  let cssClassDocuments = getLanguageModelCache<TextDocument>(10, 60, document => documentRegions.get(document).getEmbeddedDocument("cssId"));
  const mode: LanguageMode = {
    getId() {
      return "cssId";
    },
    async doComplete(document: TextDocument, position: Position, documentContext: DocumentContext, settings?: Settings): Promise<CompletionList> {
      console.log("CssIdMode doComplete")
      const wxssDocument = await wxmlToWxssDocument(document.uri, fileSystemProvider)

      let items = getCompletionItem(wxssDocument!)

      return {
        isIncomplete: true,
        items
      }

    },
    async findDefinition(document: TextDocument, position: Position): Promise<Definition | null> {
      const idName = getIdName(cssClassDocuments.get(document), position)
      const wxssDocument = await wxmlToWxssDocument(document.uri, fileSystemProvider)

      const range = getDefinition(wxssDocument!, idName)

      console.log("CssIdMode findDefinition", idName)
      return {
        uri: wxmlToWxss(document.uri),
        range
      }
    },

    onDocumentRemoved(document: TextDocument) {
    },
    dispose() {
    }
  }

  return mode;

}

function wxmlToWxss(uri: string) {
  const wxssUri = uri.replace('.wxml', '.wxss')

  return wxssUri;

}

function getCompletionItem(wxssDocument: TextDocument) {
  const cssAst = css.parse(wxssDocument?.getText()!)
  const idReg = /^#\w*$/;

  let items: CompletionItem[] = []
  for (const rule of cssAst.stylesheet.rules) {
    console.log("CssIdMode getCompletionItem", rule.selectors)
    for (const select of rule.selectors) {
      console.log(select)
      if (idReg.test(select)) {
        console.log("CssIdMode getCompletionItem class", select.substr(1))
        items.push({
          label: select.substr(1),
          kind: CompletionItemKind.Variable
        })
      }
    }
  }
  return items;

}

function getDefinition(wxssDocument: TextDocument, idName: string) {
  const cssAst = css.parse(wxssDocument?.getText()!)
  let range = Range.create(Position.create(0, 0), Position.create(0, 0));
  for (const rule of cssAst.stylesheet.rules) {
    console.log("CssIdMode getCompletionItem", rule.selectors)
    for (const select of rule.selectors) {
      console.log(select)
      if (select.substr(1) == idName) {
        range = Range.create(Position.create(rule.position.start.line, rule.position.start.column), Position.create(rule.position.end.line, rule.position.end.column))
      }
    }
  }

  return range;

}

function getIdName(document: TextDocument, position: Position) {

  function getChar(num: number) {
    return document.getText()[num]
  }

  const num = document.offsetAt(position);
  let leftSide = num - 1;
  while (true) {
    if (getChar(leftSide) == " " || getChar(leftSide) == "\n") {
      leftSide++
      console.log("leftSide", leftSide, getChar(leftSide))
      break;
    } else {
      leftSide--

    }
  }

  let rightSide = num;
  while (true) {
    if (getChar(rightSide) == " " || getChar(rightSide) == "\n") {
      console.log("rightSide", rightSide, getChar(rightSide))
      break;
    } else {
      rightSide++

    }
  }

  const idName = document.getText(Range.create(document.positionAt(leftSide), document.positionAt(rightSide)))
  console.log("getIdName", idName, idName.length)

  return idName;

}


async function wxmlToWxssDocument(uri: string, fileSystemProvider: RequestService) {
  const wxssUri = wxmlToWxss(uri)
  const stat = await fileSystemProvider.stat(wxssUri)
  if (stat.type == FileType.File) {
    const wxssContent = await fileSystemProvider.getContent(wxssUri);
    const wxssDocument = TextDocument.create(wxssUri, "cssId", 0, wxssContent)
    return wxssDocument;
  }

}