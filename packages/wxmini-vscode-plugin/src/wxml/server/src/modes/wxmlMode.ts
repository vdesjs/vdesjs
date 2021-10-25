
import { getLanguageModelCache } from '../languageModelCache';
import {
	LanguageService as WXMLLanguageService, WXMLDocument, DocumentContext, FormattingOptions,
	WXMLFormatConfiguration, SelectionRange,
	TextDocument, Position, Range, FoldingRange,
	LanguageMode, Workspace, Settings
} from './languageModes';

export function getWXMLMode(wxmlLanguageService: WXMLLanguageService, workspace: Workspace): LanguageMode {
	let wxmlDocuments = getLanguageModelCache<WXMLDocument>(10, 60, document => wxmlLanguageService.parseWXMLDocument(document));
	return {
		getId() {
			return 'wxml';
		},
		async getSelectionRange(document: TextDocument, position: Position): Promise<SelectionRange> {
			return wxmlLanguageService.getSelectionRanges(document, [position])[0];
		},
		doComplete(document: TextDocument, position: Position, documentContext: DocumentContext, settings = workspace.settings) {
      console.log("doComplete" + JSON.stringify(settings.wxml))
			let options = settings && settings.wxml && settings.wxml.suggest;
			let doAutoComplete = settings && settings.wxml && settings.wxml.autoClosingTags;
			// if (doAutoComplete) {
			// 	options.hideAutoCompleteProposals = true;
			// }

			const wxmlDocument = wxmlDocuments.get(document);
			let completionList = wxmlLanguageService.doComplete2(document, position, wxmlDocument, documentContext, options);
			return completionList;
		},
		async doHover(document: TextDocument, position: Position, settings?: Settings) {
			return wxmlLanguageService.doHover(document, position, wxmlDocuments.get(document), settings?.wxml?.hover);
		},
		async findDocumentHighlight(document: TextDocument, position: Position) {
			return wxmlLanguageService.findDocumentHighlights(document, position, wxmlDocuments.get(document));
		},
		async findDocumentLinks(document: TextDocument, documentContext: DocumentContext) {
			return wxmlLanguageService.findDocumentLinks(document, documentContext);
		},
		async findDocumentSymbols(document: TextDocument) {
			return wxmlLanguageService.findDocumentSymbols(document, wxmlDocuments.get(document));
		},
		async format(document: TextDocument, range: Range, formatParams: FormattingOptions, settings = workspace.settings) {
			let formatSettings: WXMLFormatConfiguration = settings && settings.wxml && settings.wxml.format;
			if (formatSettings) {
				formatSettings = merge(formatSettings, {});
			} else {
				formatSettings = {};
			}
			if (formatSettings.contentUnformatted) {
				formatSettings.contentUnformatted = formatSettings.contentUnformatted + ',script';
			} else {
				formatSettings.contentUnformatted = 'script';
			}
			formatSettings = merge(formatParams, formatSettings);
			return wxmlLanguageService.format(document, range, formatSettings);
		},
		async getFoldingRanges(document: TextDocument): Promise<FoldingRange[]> {
			return wxmlLanguageService.getFoldingRanges(document  );
		},
		async doAutoClose(document: TextDocument, position: Position) {
      console.log("wxmlMode doAutoClose")
			let offset = document.offsetAt(position);
			let text = document.getText();
			if (offset > 0 && text.charAt(offset - 1).match(/[>\/]/g)) {


        const compleText = wxmlLanguageService.doTagComplete(document, position, wxmlDocuments.get(document));
        console.log("wxmlMode doAutoClose wxmlLanguageService.doTagComplete: " + compleText)
				return compleText
			}
			return null;
		},
		async doRename(document: TextDocument, position: Position, newName: string) {
			const wxmlDocument = wxmlDocuments.get(document);
			return wxmlLanguageService.doRename(document, position, newName, wxmlDocument);
		},
		async onDocumentRemoved(document: TextDocument) {
			wxmlDocuments.onDocumentRemoved(document);
		},
		async findMatchingTagPosition(document: TextDocument, position: Position) {
			const wxmlDocument = wxmlDocuments.get(document);
			return wxmlLanguageService.findMatchingTagPosition(document, position, wxmlDocument);
		},
		async doLinkedEditing(document: TextDocument, position: Position) {
			const wxmlDocument = wxmlDocuments.get(document);
			return wxmlLanguageService.findLinkedEditingRanges(document, position, wxmlDocument);
		},
		dispose() {
			wxmlDocuments.dispose();
		}
	};
}

function merge(src: any, dst: any): any {
	for (const key in src) {
		if (src.hasOwnProperty(key)) {
			dst[key] = src[key];
		}
	}
	return dst;
}
