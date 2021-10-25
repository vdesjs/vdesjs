

import {
  Connection, TextDocuments, InitializeParams, InitializeResult, RequestType,
  DocumentRangeFormattingRequest, Disposable, TextDocumentPositionParams, ServerCapabilities,
  ConfigurationRequest, ConfigurationParams, DidChangeWorkspaceFoldersNotification,
  DocumentColorRequest, ColorPresentationRequest, TextDocumentSyncKind, NotificationType, RequestType0, DocumentFormattingRequest, FormattingOptions, TextEdit
} from 'vscode-languageserver';

import {
  getLanguageModes, LanguageModes, Settings, TextDocument, Position, Diagnostic, WorkspaceFolder, ColorInformation,
  Range, DocumentLink, SymbolInformation, TextDocumentIdentifier
} from './modes/languageModes';

import { format } from './modes/formatting';
import { pushAll } from './utils/arrays';
import { getDocumentContext } from './utils/documentContext';


import { URI } from 'vscode-uri';
import { formatError, runSafe } from './utils/runner';

import { getFoldingRanges } from './modes/wxmlFolding';
import { fetchWXMLDataProviders } from './customData';
import { getSelectionRanges } from './modes/selectionRanges';
import { SemanticTokenProvider, newSemanticTokenProvider } from './modes/semanticTokens';

import { RequestService, getRequestService } from './requests';

namespace CustomDataChangedNotification {
  export const type: NotificationType<string[]> = new NotificationType('wxml/customDataChanged');
}

namespace TagCloseRequest {
  export const type: RequestType<TextDocumentPositionParams, string | null, any> = new RequestType('wxml/tag');
}

interface SemanticTokenParams {
  textDocument: TextDocumentIdentifier;
  ranges?: Range[];
}
namespace SemanticTokenRequest {
  export const type: RequestType<SemanticTokenParams, number[] | null, any> = new RequestType('wxml/semanticTokens');
}
namespace SemanticTokenLegendRequest {
  export const type: RequestType0<{ types: string[]; modifiers: string[] } | null, any> = new RequestType0('wxml/semanticTokenLegend');
}

export interface RuntimeEnvironment {
  file?: RequestService;
  http?: RequestService
  configureHttpRequests?(proxy: string, strictSSL: boolean): void;
  readonly timer: {
    setImmediate(callback: (...args: any[]) => void, ...args: any[]): Disposable;
    setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable;
  }
}



export function startServer(connection: Connection, runtime: RuntimeEnvironment) {
  const documents = new TextDocuments(TextDocument);
  documents.listen(connection);

  let workspaceFolders: WorkspaceFolder[] = [];

  let languageModes: LanguageModes;

  let clientSnippetSupport = false;
  let dynamicFormatterRegistration = false;
  let scopedSettingsSupport = false;
  let workspaceFoldersSupport = false;
  let foldingRangeLimit = Number.MAX_VALUE;

  const notReady = () => Promise.reject('Not Ready');
  let requestService: RequestService = { getContent: notReady, stat: notReady, readDirectory: notReady };

  let globalSettings: Settings = {};
  let documentSettings: { [key: string]: Thenable<Settings> } = {};

  documents.onDidClose(e => {
    delete documentSettings[e.document.uri];
  });

  function getDocumentSettings(textDocument: TextDocument, needsDocumentSettings: () => boolean): Thenable<Settings | undefined> {
    if (scopedSettingsSupport && needsDocumentSettings()) {
      let promise = documentSettings[textDocument.uri];
      if (!promise) {
        const scopeUri = textDocument.uri;
        const configRequestParam: ConfigurationParams = { items: [{ scopeUri, section: 'css' }, { scopeUri, section: 'wxml' }, { scopeUri, section: 'javascript' }] };
        promise = connection.sendRequest(ConfigurationRequest.type, configRequestParam).then(s => {
          console.log("wxmlServer s", s)

          return {
            css: s[0], wxml: s[1], javascript: s[2]
          }
        });

        // const configRequestParam: ConfigurationParams = { items: [{ scopeUri, section: 'wxml' }, { scopeUri, section: 'javascript' }] };
        // promise = connection.sendRequest(ConfigurationRequest.type, configRequestParam).then(s => ({ wxml: s[1], javascript: s[2] }));


        documentSettings[textDocument.uri] = promise;
      }
      return promise;
    }
    return Promise.resolve(undefined);
  }

  connection.onInitialize((params: InitializeParams): InitializeResult => {
    const initializationOptions = params.initializationOptions;
    workspaceFolders = (<any>params).workspaceFolders;
    if (!Array.isArray(workspaceFolders)) {
      workspaceFolders = [];
      if (params.workspaceFolders?.[0].uri) {
        workspaceFolders.push({ name: '', uri: URI.file(params.workspaceFolders?.[0].uri).toString() });
      }
    }

    requestService = getRequestService(initializationOptions?.handledSchemas || ['file'], connection, runtime);

    const workspace = {
      get settings() { return globalSettings; },
      get folders() { return workspaceFolders; }
    };


    languageModes = getLanguageModes(initializationOptions?.embeddedLanguages || { css: true, javascript: true }, workspace, params.capabilities, requestService);



    const dataPaths: string[] = initializationOptions?.dataPaths || [];
    fetchWXMLDataProviders(dataPaths, requestService).then(dataProviders => {
      languageModes.updateDataProviders(dataProviders);
    });

    documents.onDidClose(e => {
      languageModes.onDocumentRemoved(e.document);
    });
    connection.onShutdown(() => {
      languageModes.dispose();
    });

    function getClientCapability<T>(name: string, def: T) {
      const keys = name.split('.');
      let c: any = params.capabilities;
      for (let i = 0; c && i < keys.length; i++) {
        if (!c.hasOwnProperty(keys[i])) {
          return def;
        }
        c = c[keys[i]];
      }
      return c;
    }

    clientSnippetSupport = getClientCapability('textDocument.completion.completionItem.snippetSupport', false);
    dynamicFormatterRegistration = getClientCapability('textDocument.rangeFormatting.dynamicRegistration', false) && (typeof initializationOptions?.provideFormatter !== 'boolean');
    scopedSettingsSupport = getClientCapability('workspace.configuration', false);
    workspaceFoldersSupport = getClientCapability('workspace.workspaceFolders', false);
    foldingRangeLimit = getClientCapability('textDocument.foldingRange.rangeLimit', Number.MAX_VALUE);


    const capabilities: ServerCapabilities = {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: clientSnippetSupport ? { resolveProvider: true, triggerCharacters: ['.', ':', '<', '"', '=', '/'] } : undefined,
      hoverProvider: true,
      documentHighlightProvider: true,
      documentRangeFormattingProvider: true,
      // documentFormattingProvider: true,
      documentLinkProvider: { resolveProvider: false },
      documentSymbolProvider: true,
      definitionProvider: true,
      signatureHelpProvider: { triggerCharacters: ['('] },
      referencesProvider: true,
      colorProvider: {},
      foldingRangeProvider: true,
      selectionRangeProvider: true,
      renameProvider: true,
      linkedEditingRangeProvider: true
    };

    return { capabilities };


  })

  connection.onInitialized(() => {
    if (workspaceFoldersSupport) {
      connection.client.register(DidChangeWorkspaceFoldersNotification.type);

      connection.onNotification(DidChangeWorkspaceFoldersNotification.type, e => {
        const toAdd = e.event.added;
        const toRemove = e.event.removed;
        const updatedFolders = [];
        if (workspaceFolders) {
          for (const folder of workspaceFolders) {
            if (!toRemove.some(r => r.uri === folder.uri) && !toAdd.some(r => r.uri === folder.uri)) {
              updatedFolders.push(folder);
            }
          }
        }
        workspaceFolders = updatedFolders.concat(toAdd);
        documents.all().forEach(triggerValidation);
      });
    }
  });

  let formatterRegistrations: Thenable<Disposable>[] | null = null;

  connection.onDidChangeConfiguration((change) => {
    console.log("connection.onDidChangeConfiguration" + JSON.stringify(change.settings))

    globalSettings = change.settings;
    documentSettings = {}; // reset all document settings
    documents.all().forEach(triggerValidation);

    const enableFormatter = globalSettings && globalSettings.wxml && globalSettings.wxml.format && globalSettings.wxml.format.enable;
    console.log("connection.onDidChangeConfiguration enableFormatter: " + enableFormatter)
    if (enableFormatter) {
      if (!formatterRegistrations) {
        const documentSelector = [{ language: 'wxml' }];

        console.log("connection.onDidChangeConfiguration regist wxml format")

        formatterRegistrations = [
          connection.client.register(DocumentRangeFormattingRequest.type, { documentSelector }),
          // connection.client.register(DocumentFormattingRequest.type, { documentSelector })
        ];
      }
    } else if (formatterRegistrations) {
      formatterRegistrations.forEach(p => p.then(r => r.dispose()));
      formatterRegistrations = null;
    }
  });

  const pendingValidationRequests: { [uri: string]: Disposable } = {};
  const validationDelayMs = 500;

  documents.onDidChangeContent(change => {
    console.log("documents.onDidChangeContent")

    triggerValidation(change.document);
  });


  documents.onDidClose(event => {
    cleanPendingValidation(event.document);
    connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
  });

  function cleanPendingValidation(textDocument: TextDocument): void {
    const request = pendingValidationRequests[textDocument.uri];
    if (request) {
      request.dispose();
      delete pendingValidationRequests[textDocument.uri];
    }
  }

  function triggerValidation(textDocument: TextDocument): void {
    cleanPendingValidation(textDocument);
    pendingValidationRequests[textDocument.uri] = runtime.timer.setTimeout(() => {
      delete pendingValidationRequests[textDocument.uri];
      validateTextDocument(textDocument);
    }, validationDelayMs);
  }

  function isValidationEnabled(languageId: string, settings: Settings = globalSettings) {
    const validationSettings = settings && settings.wxml && settings.wxml.validate;
    if (validationSettings) {
      return languageId === 'css' && validationSettings.styles !== false || languageId === 'javascript' && validationSettings.scripts !== false;
    }
    return true;
  }

  async function validateTextDocument(textDocument: TextDocument) {
    try {
      const version = textDocument.version;
      const diagnostics: Diagnostic[] = [];
      if (textDocument.languageId === 'wxml') {
        const modes = languageModes.getAllModesInDocument(textDocument);
        const settings = await getDocumentSettings(textDocument, () => modes.some(m => !!m.doValidation));
        const latestTextDocument = documents.get(textDocument.uri);
        if (latestTextDocument && latestTextDocument.version === version) { // check no new version has come in after in after the async op
          for (const mode of modes) {
            if (mode.doValidation && isValidationEnabled(mode.getId(), settings)) {
              pushAll(diagnostics, await mode.doValidation(latestTextDocument, settings));
            }
          }
          connection.sendDiagnostics({ uri: latestTextDocument.uri, diagnostics });
        }
      }
    } catch (e) {
      connection.console.error(formatError(`Error while validating ${textDocument.uri}`, e));
    }
  }

  connection.onCompletion(async (textDocumentPosition, token) => {
    console.log("connection.onCompletion")
    return runSafe(runtime, async () => {
      const document = documents.get(textDocumentPosition.textDocument.uri);
      if (!document) {
        return null;
      }
      const mode = languageModes.getModeAtPosition(document, textDocumentPosition.position);
      if (!mode || !mode.doComplete) {
        return { isIncomplete: true, items: [] };
      }
      const doComplete = mode.doComplete;

      if (mode.getId() !== 'wxml') {
        /* __GDPR__
          "wxml.embbedded.complete" : {
            "languageId" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
          }
         */
        connection.telemetry.logEvent({ key: 'wxml.embbedded.complete', value: { languageId: mode.getId() } });
      }

      const settings = await getDocumentSettings(document, () => doComplete.length > 2);
      const documentContext = getDocumentContext(document.uri, workspaceFolders);
      return doComplete(document, textDocumentPosition.position, documentContext, settings);

    }, null, `Error while computing completions for ${textDocumentPosition.textDocument.uri}`, token);
  });

  connection.onCompletionResolve((item, token) => {
    return runSafe(runtime, async () => {
      const data = item.data;
      if (data && data.languageId && data.uri) {
        const mode = languageModes.getMode(data.languageId);
        const document = documents.get(data.uri);
        if (mode && mode.doResolve && document) {
          return mode.doResolve(document, item);
        }
      }
      return item;
    }, item, `Error while resolving completion proposal`, token);
  });

  connection.onHover((textDocumentPosition, token) => {
    return runSafe(runtime, async () => {
      const document = documents.get(textDocumentPosition.textDocument.uri);
      if (document) {
        const mode = languageModes.getModeAtPosition(document, textDocumentPosition.position);
        const doHover = mode?.doHover;
        if (doHover) {
          const settings = await getDocumentSettings(document, () => doHover.length > 2);
          return doHover(document, textDocumentPosition.position, settings);
        }
      }
      return null;
    }, null, `Error while computing hover for ${textDocumentPosition.textDocument.uri}`, token);
  });


  connection.onDocumentHighlight((documentHighlightParams, token) => {
    return runSafe(runtime, async () => {
      const document = documents.get(documentHighlightParams.textDocument.uri);
      if (document) {
        const mode = languageModes.getModeAtPosition(document, documentHighlightParams.position);
        if (mode && mode.findDocumentHighlight) {
          return mode.findDocumentHighlight(document, documentHighlightParams.position);
        }
      }
      return [];
    }, [], `Error while computing document highlights for ${documentHighlightParams.textDocument.uri}`, token);
  });


  connection.onDefinition((definitionParams, token) => {
    return runSafe(runtime, async () => {
      const document = documents.get(definitionParams.textDocument.uri);
      if (document) {
        const mode = languageModes.getModeAtPosition(document, definitionParams.position);
        if (mode && mode.findDefinition) {
          return mode.findDefinition(document, definitionParams.position);
        }
      }
      return [];
    }, null, `Error while computing definitions for ${definitionParams.textDocument.uri}`, token);
  });

  connection.onReferences((referenceParams, token) => {
    return runSafe(runtime, async () => {
      const document = documents.get(referenceParams.textDocument.uri);
      if (document) {
        const mode = languageModes.getModeAtPosition(document, referenceParams.position);
        if (mode && mode.findReferences) {
          return mode.findReferences(document, referenceParams.position);
        }
      }
      return [];
    }, [], `Error while computing references for ${referenceParams.textDocument.uri}`, token);
  });

  connection.onSignatureHelp((signatureHelpParms, token) => {
    return runSafe(runtime, async () => {
      const document = documents.get(signatureHelpParms.textDocument.uri);
      if (document) {
        const mode = languageModes.getModeAtPosition(document, signatureHelpParms.position);
        if (mode && mode.doSignatureHelp) {
          return mode.doSignatureHelp(document, signatureHelpParms.position);
        }
      }
      return null;
    }, null, `Error while computing signature help for ${signatureHelpParms.textDocument.uri}`, token);
  });

  async function onFormat(textDocument: TextDocumentIdentifier, range: Range | undefined, options: FormattingOptions): Promise<TextEdit[] | undefined> {
    const document = documents.get(textDocument.uri);
    if (document) {
      let settings = await getDocumentSettings(document, () => true);
      if (!settings) {
        settings = globalSettings;
      }
      const enabledModes = { javascript: true, css: true };

      return format(languageModes, document, range ?? getFullRange(document), options, settings, enabledModes);
    }
    return [];
  }

  connection.onDocumentRangeFormatting((formatParams, token) => {
    console.log("connection.onDocumentRangeFormatting:", formatParams)
    return runSafe(runtime, () => onFormat(formatParams.textDocument, formatParams.range, formatParams.options), [], `Error while formatting range for ${formatParams.textDocument.uri}`, token);
  });

  // connection.onDocumentFormatting((formatParams, token) => {
  //   console.log("connection.onDocumentFormatting")
  //   return runSafe(runtime, () => onFormat(formatParams.textDocument, undefined, formatParams.options), [], `Error while formatting ${formatParams.textDocument.uri}`, token);
  // });

  connection.onDocumentLinks((documentLinkParam, token) => {
    return runSafe(runtime, async () => {
      const document = documents.get(documentLinkParam.textDocument.uri);
      const links: DocumentLink[] = [];
      if (document) {
        const documentContext = getDocumentContext(document.uri, workspaceFolders);
        for (const m of languageModes.getAllModesInDocument(document)) {
          if (m.findDocumentLinks) {
            pushAll(links, await m.findDocumentLinks(document, documentContext));
          }
        }
      }
      return links;
    }, [], `Error while document links for ${documentLinkParam.textDocument.uri}`, token);
  });

  connection.onDocumentSymbol((documentSymbolParms, token) => {
    return runSafe(runtime, async () => {
      const document = documents.get(documentSymbolParms.textDocument.uri);
      const symbols: SymbolInformation[] = [];
      if (document) {
        for (const m of languageModes.getAllModesInDocument(document)) {
          if (m.findDocumentSymbols) {
            pushAll(symbols, await m.findDocumentSymbols(document));
          }
        }
      }
      return symbols;
    }, [], `Error while computing document symbols for ${documentSymbolParms.textDocument.uri}`, token);
  });

  connection.onRequest(DocumentColorRequest.type, (params, token) => {
    return runSafe(runtime, async () => {
      const infos: ColorInformation[] = [];
      const document = documents.get(params.textDocument.uri);
      if (document) {
        for (const m of languageModes.getAllModesInDocument(document)) {
          if (m.findDocumentColors) {
            pushAll(infos, await m.findDocumentColors(document));
          }
        }
      }
      return infos;
    }, [], `Error while computing document colors for ${params.textDocument.uri}`, token);
  });

  connection.onRequest(ColorPresentationRequest.type, (params, token) => {
    return runSafe(runtime, async () => {
      const document = documents.get(params.textDocument.uri);
      if (document) {
        const mode = languageModes.getModeAtPosition(document, params.range.start);
        if (mode && mode.getColorPresentations) {
          return mode.getColorPresentations(document, params.color, params.range);
        }
      }
      return [];
    }, [], `Error while computing color presentations for ${params.textDocument.uri}`, token);
  });

  connection.onRequest(TagCloseRequest.type, (params, token) => {

    return runSafe(runtime, async () => {
      console.log("connection.onRequest uri" + params.textDocument.uri)
      const document = documents.get(params.textDocument.uri);
      if (document) {
        console.log("connection.onRequest document")
        const pos = params.position;
        if (pos.character > 0) {
          const mode = languageModes.getModeAtPosition(document, Position.create(pos.line, pos.character - 1));
          console.log("connection.onRequest mode" + mode)

          if (mode && mode.doAutoClose) {
            return mode.doAutoClose(document, pos);
          }
        }
      }
      return null;
    }, null, `Error while computing tag close actions for ${params.textDocument.uri}`, token);
  });

  connection.onFoldingRanges((params, token) => {
    return runSafe(runtime, async () => {
      const document = documents.get(params.textDocument.uri);
      if (document) {
        return getFoldingRanges(languageModes, document, foldingRangeLimit, token);
      }
      return null;
    }, null, `Error while computing folding regions for ${params.textDocument.uri}`, token);
  });

  connection.onSelectionRanges((params, token) => {
    return runSafe(runtime, async () => {
      const document = documents.get(params.textDocument.uri);
      if (document) {
        return getSelectionRanges(languageModes, document, params.positions);
      }
      return [];
    }, [], `Error while computing selection ranges for ${params.textDocument.uri}`, token);
  });

  connection.onRenameRequest((params, token) => {
    return runSafe(runtime, async () => {
      const document = documents.get(params.textDocument.uri);
      const position: Position = params.position;

      if (document) {
        const mode = languageModes.getModeAtPosition(document, params.position);

        if (mode && mode.doRename) {
          return mode.doRename(document, position, params.newName);
        }
      }
      return null;
    }, null, `Error while computing rename for ${params.textDocument.uri}`, token);
  });

  connection.languages.onLinkedEditingRange((params, token) => {
    return <any> /* todo remove when microsoft/vscode-languageserver-node#700 fixed */ runSafe(runtime, async () => {
      const document = documents.get(params.textDocument.uri);
      if (document) {
        const pos = params.position;
        if (pos.character > 0) {
          const mode = languageModes.getModeAtPosition(document, Position.create(pos.line, pos.character - 1));
          if (mode && mode.doLinkedEditing) {
            const ranges = await mode.doLinkedEditing(document, pos);
            if (ranges) {
              return { ranges };
            }
          }
        }
      }
      return null;
    }, null, `Error while computing synced regions for ${params.textDocument.uri}`, token);
  });

  let semanticTokensProvider: SemanticTokenProvider | undefined;
  function getSemanticTokenProvider() {
    if (!semanticTokensProvider) {
      semanticTokensProvider = newSemanticTokenProvider(languageModes);
    }
    return semanticTokensProvider;
  }

  connection.onRequest(SemanticTokenRequest.type, (params, token) => {
    return runSafe(runtime, async () => {
      const document = documents.get(params.textDocument.uri);
      if (document) {
        return getSemanticTokenProvider().getSemanticTokens(document, params.ranges);
      }
      return null;
    }, null, `Error while computing semantic tokens for ${params.textDocument.uri}`, token);
  });

  connection.onRequest(SemanticTokenLegendRequest.type, token => {
    return runSafe(runtime, async () => {
      return getSemanticTokenProvider().legend;
    }, null, `Error while computing semantic tokens legend`, token);
  });

  connection.onNotification(CustomDataChangedNotification.type, dataPaths => {
    fetchWXMLDataProviders(dataPaths, requestService).then(dataProviders => {
      languageModes.updateDataProviders(dataProviders);
    });
  });

  connection.listen();





}


function getFullRange(document: TextDocument): Range {
  return Range.create(Position.create(0, 0), document.positionAt(document.getText().length));
}

