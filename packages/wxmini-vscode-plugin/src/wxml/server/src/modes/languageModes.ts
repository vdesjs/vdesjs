import { getCSSLanguageService } from 'vscode-css-languageservice';
import {
  DocumentContext, getLanguageService as getWXMLanguageService, IWXMLDataProvider, ClientCapabilities
} from '@vdesjs/vscode-wxml-languageservice';
import {
  SelectionRange,
  CompletionItem, CompletionList, Definition, Diagnostic, DocumentHighlight, DocumentLink, FoldingRange, FormattingOptions,
  Hover, Location, Position, Range, SignatureHelp, SymbolInformation, TextEdit,
  Color, ColorInformation, ColorPresentation, WorkspaceEdit,
  WorkspaceFolder
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { getLanguageModelCache, LanguageModelCache } from '../languageModelCache';

import { getDocumentRegions, WXMLDocumentRegions } from './embeddedSupport';
import { getWXMLMode } from './wxmlMode';

import { RequestService } from '../requests';
import { getCSSMode } from './cssMode';
import { getJsBindMode } from './js/jsBindMode';
import { getCssClassMode } from './css/cssClassMode';
import { getWxmlDataMode } from './wxmlDataMode';
import { getCssIdMode } from './css/cssIdMode';
import { getJavaScriptMode } from './javascriptMode';



export {
  WorkspaceFolder, CompletionItem, CompletionList, CompletionItemKind, Definition, Diagnostic, DocumentHighlight, DocumentHighlightKind,
  DocumentLink, FoldingRange, FoldingRangeKind, FormattingOptions,
  Hover, Location, Position, Range, SignatureHelp, SymbolInformation, SymbolKind, TextEdit,
  Color, ColorInformation, ColorPresentation, WorkspaceEdit,
  SignatureInformation, ParameterInformation, DiagnosticSeverity,
  SelectionRange, TextDocumentIdentifier
} from 'vscode-languageserver';


export { ClientCapabilities, DocumentContext, LanguageService, WXMLDocument, WXMLFormatConfiguration, TokenType } from '@vdesjs/vscode-wxml-languageservice';

export { TextDocument } from 'vscode-languageserver-textdocument';

export interface Settings {
  css?: any;
  wxml?: any;
  javascript?: any;
}

export interface Workspace {
  readonly settings: Settings;
  readonly folders: WorkspaceFolder[];
}

export interface SemanticTokenData {
  start: Position;
  length: number;
  typeIdx: number;
  modifierSet: number;
}

export interface LanguageMode {
  getId(): string;
  getSelectionRange?: (document: TextDocument, position: Position) => Promise<SelectionRange>;
  doValidation?: (document: TextDocument, settings?: Settings) => Promise<Diagnostic[]>;
  doComplete?: (document: TextDocument, position: Position, documentContext: DocumentContext, settings?: Settings) => Promise<CompletionList>;
  doResolve?: (document: TextDocument, item: CompletionItem) => Promise<CompletionItem>;
  doHover?: (document: TextDocument, position: Position, settings?: Settings) => Promise<Hover | null>;
  doSignatureHelp?: (document: TextDocument, position: Position) => Promise<SignatureHelp | null>;
  doRename?: (document: TextDocument, position: Position, newName: string) => Promise<WorkspaceEdit | null>;
  doLinkedEditing?: (document: TextDocument, position: Position) => Promise<Range[] | null>;
  findDocumentHighlight?: (document: TextDocument, position: Position) => Promise<DocumentHighlight[]>;
  findDocumentSymbols?: (document: TextDocument) => Promise<SymbolInformation[]>;
  findDocumentLinks?: (document: TextDocument, documentContext: DocumentContext) => Promise<DocumentLink[]>;
  findDefinition?: (document: TextDocument, position: Position) => Promise<Definition | null>;
  findReferences?: (document: TextDocument, position: Position) => Promise<Location[]>;
  format?: (document: TextDocument, range: Range, options: FormattingOptions, settings?: Settings) => Promise<TextEdit[]>;
  findDocumentColors?: (document: TextDocument) => Promise<ColorInformation[]>;
  getColorPresentations?: (document: TextDocument, color: Color, range: Range) => Promise<ColorPresentation[]>;
  doAutoClose?: (document: TextDocument, position: Position) => Promise<string | null>;
  findMatchingTagPosition?: (document: TextDocument, position: Position) => Promise<Position | null>;
  getFoldingRanges?: (document: TextDocument) => Promise<FoldingRange[]>;
  onDocumentRemoved(document: TextDocument): void;
  getSemanticTokens?(document: TextDocument): Promise<SemanticTokenData[]>;
  getSemanticTokenLegend?(): { types: string[], modifiers: string[] };
  dispose(): void;
}

export interface LanguageModes {
  updateDataProviders(dataProviders: IWXMLDataProvider[]): void;
  getModeAtPosition(document: TextDocument, position: Position): LanguageMode | undefined;
  getModesInRange(document: TextDocument, range: Range): LanguageModeRange[];
  getAllModes(): LanguageMode[];
  getAllModesInDocument(document: TextDocument): LanguageMode[];
  getMode(languageId: string): LanguageMode | undefined;
  onDocumentRemoved(document: TextDocument): void;
  dispose(): void;
}

export interface LanguageModeRange extends Range {
  mode: LanguageMode | undefined;
  attributeValue?: boolean;
}


export function getLanguageModes(supportedLanguages: { [languageId: string]: boolean; }, workspace: Workspace, clientCapabilities: ClientCapabilities, requestService: RequestService): LanguageModes {
  const wxmlLanguageService = getWXMLanguageService({ clientCapabilities, fileSystemProvider: requestService });
  const cssLanguageService = getCSSLanguageService({ clientCapabilities, fileSystemProvider: requestService });

  let documentRegions = getLanguageModelCache<WXMLDocumentRegions>(10, 60, document => getDocumentRegions(wxmlLanguageService, document));


  let modelCaches: LanguageModelCache<any>[] = [];
  modelCaches.push(documentRegions);

  let modes = Object.create(null);
  modes['wxml'] = getWXMLMode(wxmlLanguageService, workspace);
  modes['wxmlData'] = getWxmlDataMode(documentRegions, requestService);

  if (supportedLanguages['css']) {
    modes['css'] = getCSSMode(cssLanguageService, documentRegions, workspace);
    modes['cssClass'] = getCssClassMode(documentRegions, requestService);
    modes['cssId'] = getCssIdMode(documentRegions, requestService)
  }
  if (supportedLanguages['javascript']) {
    modes['javascript'] = getJavaScriptMode(documentRegions, 'javascript', workspace);
    modes['jsBind'] = getJsBindMode(documentRegions, workspace, requestService);
  }

  return {
    async updateDataProviders(dataProviders: IWXMLDataProvider[]): Promise<void> {
      wxmlLanguageService.setDataProviders(true, dataProviders);
    },
    getModeAtPosition(document: TextDocument, position: Position): LanguageMode | undefined {
      let languageId = documentRegions.get(document).getLanguageAtPosition(position);
      if (languageId) {
        return modes[languageId];
      }
      return undefined;
    },
    getModesInRange(document: TextDocument, range: Range): LanguageModeRange[] {
      return documentRegions.get(document).getLanguageRanges(range).map(r => {
        return <LanguageModeRange>{
          start: r.start,
          end: r.end,
          mode: r.languageId && modes[r.languageId],
          attributeValue: r.attributeValue
        };
      });
    },
    getAllModesInDocument(document: TextDocument): LanguageMode[] {
      let result = [];
      for (let languageId of documentRegions.get(document).getLanguagesInDocument()) {
        let mode = modes[languageId];
        if (mode) {
          result.push(mode);
        }
      }
      return result;
    },
    getAllModes(): LanguageMode[] {
      let result = [];
      for (let languageId in modes) {
        let mode = modes[languageId];
        if (mode) {
          result.push(mode);
        }
      }
      return result;
    },
    getMode(languageId: string): LanguageMode {
      return modes[languageId];
    },
    onDocumentRemoved(document: TextDocument) {
      modelCaches.forEach(mc => mc.onDocumentRemoved(document));
      for (let mode in modes) {
        modes[mode].onDocumentRemoved(document);
      }
    },
    dispose(): void {
      modelCaches.forEach(mc => mc.dispose());
      modelCaches = [];
      for (let mode in modes) {
        modes[mode].dispose();
      }
      modes = {};
    }
  };
}
