import { createScanner } from './parser/wxmlScanner';
import { parse } from './parser/wxmlParser';
import { WXMLCompletion } from './services/wxmlCompletion';
import { WXMLHover } from './services/wxmlHover';
import { format } from './services/wxmlFormatter';
import { findDocumentLinks } from './services/wxmlLinks';
import { findDocumentHighlights } from './services/wxmlHighlighting';
import { findDocumentSymbols } from './services/wxmlSymbolsProvider';
import { doRename } from './services/wxmlRename';
import { findMatchingTagPosition } from './services/wxmlMatchingTagPosition';
import { findLinkedEditingRanges } from './services/wxmlLinkedEditing';


import {
	Scanner, WXMLDocument, CompletionConfiguration, ICompletionParticipant, WXMLFormatConfiguration, DocumentContext,
	IWXMLDataProvider, WXMLDataV1, LanguageServiceOptions, TextDocument, SelectionRange, WorkspaceEdit,
	Position, CompletionList, Hover, Range, SymbolInformation, TextEdit, DocumentHighlight, DocumentLink, FoldingRange, HoverSettings
} from './wxmlLanguageTypes';
import { getFoldingRanges } from './services/wxmlFolding';
import { getSelectionRanges } from './services/wxmlSelectionRange';

import { WXMLDataProvider } from './languageFacts/dataProvider';
import { WXMLDataManager } from './languageFacts/dataManager';
import { wxmlData } from './languageFacts/data';

export * from './wxmlLanguageTypes';

export interface LanguageService {
	setDataProviders(useDefaultDataProvider: boolean, customDataProviders: IWXMLDataProvider[]): void;
	createScanner(input: string, initialOffset?: number): Scanner;
	parseWXMLDocument(document: TextDocument): WXMLDocument;
	findDocumentHighlights(document: TextDocument, position: Position, htmlDocument: WXMLDocument): DocumentHighlight[];
	doComplete(document: TextDocument, position: Position, htmlDocument: WXMLDocument, options?: CompletionConfiguration): CompletionList;
	doComplete2(document: TextDocument, position: Position, htmlDocument: WXMLDocument, documentContext: DocumentContext, options?: CompletionConfiguration): Promise<CompletionList>;
	setCompletionParticipants(registeredCompletionParticipants: ICompletionParticipant[]): void;
	doHover(document: TextDocument, position: Position, htmlDocument: WXMLDocument, options?: HoverSettings): Hover | null;
	format(document: TextDocument, range: Range | undefined, options: WXMLFormatConfiguration): TextEdit[];
	findDocumentLinks(document: TextDocument, documentContext: DocumentContext): DocumentLink[];
	findDocumentSymbols(document: TextDocument, htmlDocument: WXMLDocument): SymbolInformation[];
	doTagComplete(document: TextDocument, position: Position, htmlDocument: WXMLDocument): string | null;
	getFoldingRanges(document: TextDocument, context?: { rangeLimit?: number }): FoldingRange[];
	getSelectionRanges(document: TextDocument, positions: Position[]): SelectionRange[];
	doRename(document: TextDocument, position: Position, newName: string, htmlDocument: WXMLDocument): WorkspaceEdit | null;
	findMatchingTagPosition(document: TextDocument, position: Position, htmlDocument: WXMLDocument): Position | null;
	/** Deprecated, Use findLinkedEditingRanges instead */
	findOnTypeRenameRanges(document: TextDocument, position: Position, htmlDocument: WXMLDocument): Range[] | null;
	findLinkedEditingRanges(document: TextDocument, position: Position, htmlDocument: WXMLDocument): Range[] | null;
}

const defaultLanguageServiceOptions = {};

export function getLanguageService(options: LanguageServiceOptions = defaultLanguageServiceOptions): LanguageService {
	const dataManager = new WXMLDataManager(options);

	const wxmlHover = new WXMLHover(options, dataManager);
	const wxmlCompletion = new WXMLCompletion(options, dataManager);

	return {
		setDataProviders: dataManager.setDataProviders.bind(dataManager),
		createScanner,
		parseWXMLDocument: document => parse(document.getText()),
		doComplete: wxmlCompletion.doComplete.bind(wxmlCompletion),
		doComplete2: wxmlCompletion.doComplete2.bind(wxmlCompletion),
		setCompletionParticipants: wxmlCompletion.setCompletionParticipants.bind(wxmlCompletion),
		doHover: wxmlHover.doHover.bind(wxmlHover),
		format,
		findDocumentHighlights,
		findDocumentLinks,
		findDocumentSymbols,
		getFoldingRanges,
		getSelectionRanges,
		doTagComplete: wxmlCompletion.doTagComplete.bind(wxmlCompletion),
		doRename,
		findMatchingTagPosition,
		findOnTypeRenameRanges: findLinkedEditingRanges,
		findLinkedEditingRanges
	};
}

export function newWXMLDataProvider(id: string, customData: WXMLDataV1): IWXMLDataProvider {
	return new WXMLDataProvider(id, customData);
}

export function getDefaultWXMLDataProvider(): IWXMLDataProvider {
	return newWXMLDataProvider('default', wxmlData);
}