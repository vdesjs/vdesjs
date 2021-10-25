
import { LanguageModelCache, getLanguageModelCache } from '../../languageModelCache';
import {
  CompletionItem,
  Definition, TextDocument, Range,
  CompletionList, Position,
  LanguageMode, Settings, Workspace, DocumentContext
} from '../languageModes';
import { WXMLDocumentRegions } from '../embeddedSupport';
import { FileType, RequestService } from '../../requests';
import { JavascriptLanguageService } from './javascriptLanguageService';


export function getJsBindMode(documentRegions: LanguageModelCache<WXMLDocumentRegions>, workspace: Workspace, fileSystemProvider: RequestService): LanguageMode {
  let jsDocuments = getLanguageModelCache<TextDocument>(10, 60, document => documentRegions.get(document).getEmbeddedDocument("jsBind"));

  const javascriptService = new JavascriptLanguageService();

  const mode: LanguageMode = {
    getId() {
      return "jsBind";
    },
    async doComplete(document: TextDocument, position: Position, documentContext: DocumentContext, settings?: Settings): Promise<CompletionList> {
      console.log("jsBind doComplete", document)

      let items: CompletionItem[] = []
      const jsDocument = await wxmlToJsDocument(document.uri, fileSystemProvider);
      items = javascriptService.doComplete(jsDocument!)
      return {
        isIncomplete: true,
        items
      }


    },
    async findDefinition(document: TextDocument, position: Position): Promise<Definition | null> {

      const functionNameDocument = jsDocuments.get(document);
      console.log("jsBind findDefinition", functionNameDocument)



      const jsDocument = await wxmlToJsDocument(document.uri, fileSystemProvider);

      return {
        uri: wxmlTojs(document.uri),
        range: javascriptService.findDefinition(jsDocument!, getFunctionName(functionNameDocument, position))
      }
    },


    onDocumentRemoved(document: TextDocument) {
    },
    dispose() {
    }
  }

  return mode;

}

function getFunctionName(document: TextDocument, position: Position) {

  function getChar(num: number) {
    return document.getText()[num]
  }

  const num = document.offsetAt(position);
  let leftSide = num;
  while (true) {
    if (getChar(leftSide) == " " || getChar(leftSide) == "\n") {
      leftSide++
      break;
    } else {
      leftSide--

    }
  }

  let rightSide = num;
  while (true) {
    if (getChar(rightSide) == " " || getChar(rightSide) == "\n") {
      break;
    } else {
      rightSide++

    }
  }

  const functionName = document.getText(Range.create(document.positionAt(leftSide), document.positionAt(rightSide)))
  console.log("getFunctionName", functionName)

  return functionName;

}


async function wxmlToJsDocument(uri: string, fileSystemProvider: RequestService) {
  const jsUri = wxmlTojs(uri)
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