/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from 'vscode-nls';
const localize = nls.loadMessageBundle();

import {
  languages, ExtensionContext, Position, TextDocument, Range, CompletionItem, CompletionItemKind, SnippetString, workspace, extensions,
  Disposable, FormattingOptions, CancellationToken, ProviderResult, TextEdit, CompletionContext, CompletionList, SemanticTokensLegend,
  DocumentSemanticTokensProvider, DocumentRangeSemanticTokensProvider, SemanticTokens, window, commands
} from 'vscode';
import {
  LanguageClientOptions, RequestType, TextDocumentPositionParams, DocumentRangeFormattingParams,
  DocumentRangeFormattingRequest, ProvideCompletionItemsSignature, TextDocumentIdentifier, RequestType0, Range as LspRange, NotificationType, CommonLanguageClient
} from 'vscode-languageclient';
import { activateTagClosing } from './tagClosing';
import { RequestService } from './requests';
import { getCustomDataSource } from './customData';

namespace CustomDataChangedNotification {
  export const type: NotificationType<string[]> = new NotificationType('wxml/customDataChanged');
}

namespace TagCloseRequest {
  export const type: RequestType<TextDocumentPositionParams, string, any> = new RequestType('wxml/tag');
}
// experimental: semantic tokens
interface SemanticTokenParams {
  textDocument: TextDocumentIdentifier;
  ranges?: LspRange[];
}
namespace SemanticTokenRequest {
  export const type: RequestType<SemanticTokenParams, number[] | null, any> = new RequestType('wxml/semanticTokens');
}
namespace SemanticTokenLegendRequest {
  export const type: RequestType0<{ types: string[]; modifiers: string[] } | null, any> = new RequestType0('wxml/semanticTokenLegend');
}

namespace SettingIds {
  export const linkedEditing = 'editor.linkedEditing';
  export const formatEnable = 'wxml.format.enable';

}

export interface TelemetryReporter {
  sendTelemetryEvent(eventName: string, properties?: {
    [key: string]: string;
  }, measurements?: {
    [key: string]: number;
  }): void;
}

export type LanguageClientConstructor = (name: string, description: string, clientOptions: LanguageClientOptions) => CommonLanguageClient;

export interface Runtime {
  TextDecoder: { new(encoding?: string): { decode(buffer: ArrayBuffer): string; } };
  fs?: RequestService;
  telemetry?: TelemetryReporter;
  readonly timer: {
    setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable;
  }
}

export function startClient(context: ExtensionContext, newLanguageClient: LanguageClientConstructor, runtime: Runtime) {
  console.log("startClient")
  let toDispose = context.subscriptions;


  let documentSelector = ['wxml'];
  let embeddedLanguages = { css: true, javascript: true };

  let rangeFormatting: Disposable | undefined = undefined;

  const customDataSource = getCustomDataSource(context.subscriptions);

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    documentSelector,
    synchronize: {
      configurationSection: ['wxml', 'css', 'javascript'], // the settings to synchronize
    },
    initializationOptions: {
      embeddedLanguages,
      handledSchemas: ['file'],
      provideFormatter: false, // tell the server to not provide formatting capability and ignore the `html.format.enable` setting.
    },
    middleware: {
      // testing the replace / insert mode
      provideCompletionItem(document: TextDocument, position: Position, context: CompletionContext, token: CancellationToken, next: ProvideCompletionItemsSignature): ProviderResult<CompletionItem[] | CompletionList> {
        function updateRanges(item: CompletionItem) {
          const range = item.range;
          if (range instanceof Range && range.end.isAfter(position) && range.start.isBeforeOrEqual(position)) {
            item.range = { inserting: new Range(range.start, position), replacing: range };
          }
        }
        function updateProposals(r: CompletionItem[] | CompletionList | null | undefined): CompletionItem[] | CompletionList | null | undefined {
          if (r) {
            (Array.isArray(r) ? r : r.items).forEach(updateRanges);
          }
          return r;
        }
        const isThenable = <T>(obj: ProviderResult<T>): obj is Thenable<T> => obj && (<any>obj)['then'];

        const r = next(document, position, context, token);
        if (isThenable<CompletionItem[] | CompletionList | null | undefined>(r)) {
          return r.then(updateProposals);
        }
        return updateProposals(r);
      }
    }
  };

  // Create the language client and start the client.
  let client = newLanguageClient('wxml', localize('wxmlserver.name', 'WXML Language Server'), clientOptions);
  client.registerProposedFeatures();

  let disposable = client.start();
  toDispose.push(disposable);
  client.onReady().then(() => {
    console.log("client.onReady().then")

    client.sendNotification(CustomDataChangedNotification.type, customDataSource.uris);
    customDataSource.onDidChange(() => {
      client.sendNotification(CustomDataChangedNotification.type, customDataSource.uris);
    });

    let tagRequestor = (document: TextDocument, position: Position) => {
      let param = client.code2ProtocolConverter.asTextDocumentPositionParams(document, position);
      return client.sendRequest(TagCloseRequest.type, param);
    };
    disposable = activateTagClosing(tagRequestor, { wxml: true }, 'wxml.autoClosingTags', runtime);
    toDispose.push(disposable);

    disposable = client.onTelemetry(e => {
      runtime.telemetry?.sendTelemetryEvent(e.key, e.data);
    });
    toDispose.push(disposable);

    toDispose.push({ dispose: () => rangeFormatting && rangeFormatting.dispose() });

    client.sendRequest(SemanticTokenLegendRequest.type).then(legend => {
      if (legend) {
        const provider: DocumentSemanticTokensProvider & DocumentRangeSemanticTokensProvider = {
          provideDocumentSemanticTokens(doc) {
            const params: SemanticTokenParams = {
              textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(doc),
            };
            return client.sendRequest(SemanticTokenRequest.type, params).then(data => {
              return data && new SemanticTokens(new Uint32Array(data));
            });
          },
          provideDocumentRangeSemanticTokens(doc, range) {
            const params: SemanticTokenParams = {
              textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(doc),
              ranges: [client.code2ProtocolConverter.asRange(range)]
            };
            return client.sendRequest(SemanticTokenRequest.type, params).then(data => {
              return data && new SemanticTokens(new Uint32Array(data));
            });
          }
        };
        toDispose.push(languages.registerDocumentSemanticTokensProvider(documentSelector, provider, new SemanticTokensLegend(legend.types, legend.modifiers)));
      }
    });
  });




}
