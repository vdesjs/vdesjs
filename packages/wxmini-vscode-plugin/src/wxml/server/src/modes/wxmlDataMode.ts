

import { LanguageModelCache, getLanguageModelCache } from '../languageModelCache';
import {
  CompletionItem,
  Definition, TextDocument, Range,
  CompletionList, Position,
  LanguageMode, Settings, Workspace, DocumentContext
} from './languageModes';
import { FileType, RequestService } from '../requests';
import { JavascriptLanguageService } from './js/javascriptLanguageService';
import { WXMLDocumentRegions } from './embeddedSupport';


export function getWxmlDataMode(documentRegions: LanguageModelCache<WXMLDocumentRegions>, fileSystemProvider: RequestService): LanguageMode {
  let wxmlDataDocuments = getLanguageModelCache<TextDocument>(10, 60, document => documentRegions.get(document).getEmbeddedDocument("wxmlData"));
  const javascriptService = new JavascriptLanguageService();
  const mode: LanguageMode = {
    getId() {
      return "wxmlData";
    },
    async doComplete(document: TextDocument, position: Position, documentContext: DocumentContext, settings?: Settings): Promise<CompletionList> {
      console.log("wxmlDataMode doComplete", wxmlDataDocuments.get(document))
      const dataExpression = getDataExpression(wxmlDataDocuments.get(document), position)

      const jsDocument = await wxmlToJsDocument(document.uri, fileSystemProvider)

      let items: CompletionItem[] = []
      items = javascriptService.doCompleteWxmlData(jsDocument!, dataExpression)
      // let items = getCompletionItem(wxssDocument!)

      return {
        isIncomplete: items.length == 0 ? false : true,
        items
      }

    },
    async findDefinition(document: TextDocument, position: Position): Promise<Definition | null> {

      const dataExpression = getDataExpression(wxmlDataDocuments.get(document), position)
      console.log("wxmlDataMode findDefinition", dataExpression)

      const jsDocument = await wxmlToJsDocument(document.uri, fileSystemProvider)

      const range = javascriptService.findDefinitionWxmlData(jsDocument!, dataExpression)

      return {
        uri: wxmlTojs(document.uri),
        range: range
      }
    },

    onDocumentRemoved(document: TextDocument) {
    },
    dispose() {
    }
  }

  return mode;

}

function getDataExpression(document: TextDocument, position: Position) {

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

  const dataExpression = document.getText(Range.create(document.positionAt(leftSide), document.positionAt(rightSide)))
  console.log("getdataExpression", dataExpression, dataExpression.length)

  return dataExpression;

}


async function wxmlToJsDocument(uri: string, fileSystemProvider: RequestService) {
  const jsUri = wxmlTojs(uri)
  console.log("javascriptMode doComplete", jsUri)
  const stat = await fileSystemProvider.stat(jsUri)
  if (stat.type == FileType.File) {
    const jsContetnt = await fileSystemProvider.getContent(jsUri);
    const jsDocument = TextDocument.create(jsUri, "javascript", 0, jsContetnt)
    return jsDocument;
  }

}


function wxmlTojs(uri: string) {
  const jsUri = uri.replace('.wxml', '.js')

  return jsUri;

}