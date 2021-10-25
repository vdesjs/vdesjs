/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageModes, Settings, LanguageModeRange, TextDocument, Range, TextEdit, FormattingOptions, Position } from './languageModes';
import { pushAll } from '../utils/arrays';
import { isEOL } from '../utils/strings';

export async function format(languageModes: LanguageModes, document: TextDocument, formatRange: Range, formattingOptions: FormattingOptions, settings: Settings | undefined, enabledModes: { [mode: string]: boolean }) {
  let result: TextEdit[] = [];

  // let endPos = formatRange.end;
  // let endOffset = document.offsetAt(endPos);
  // let content = document.getText();
  // if (endPos.character === 0 && endPos.line > 0 && endOffset !== content.length) {
  // 	// if selection ends after a new line, exclude that new line
  // 	let prevLineStart = document.offsetAt(Position.create(endPos.line - 1, 0));
  // 	while (isEOL(content, endOffset - 1) && endOffset > prevLineStart) {
  // 		endOffset--;
  // 	}
  // 	formatRange = Range.create(formatRange.start, document.positionAt(endOffset));
  // }


  // run the wxml formatter on the full range and pass the result content to the embedded formatters.
  // from the final content create a single edit
  // advantages of this approach are
  //  - correct indents in the wxml document
  //  - correct initial indent for embedded formatters
  //  - no worrying of overlapping edits

  // make sure we start in wxml
  // let allRanges = languageModes.getModesInRange(document, formatRange);
  // let i = 0;
  // let startPos = formatRange.start;
  // let isWXML = (range: LanguageModeRange) => range.mode && range.mode.getId() === 'wxml';
  // console.log("formatting allRanges: " + JSON.stringify(allRanges))

  // while (i < allRanges.length && !isWXML(allRanges[i])) {
  // 	let range = allRanges[i];
  // 	if (!range.attributeValue && range.mode && range.mode.format) {
  //     console.log("formatting setting: " + JSON.stringify(settings))

  // 		let edits = await range.mode.format(document, Range.create(startPos, range.end), formattingOptions, settings);
  // 		pushAll(result, edits);
  // 	}
  // 	startPos = range.end;
  // 	i++;
  // }
  // if (i === allRanges.length) {
  // 	return result;
  // }
  // modify the range
  // formatRange = Range.create(startPos, formatRange.end);

  // perform a wxml format and apply changes to a new document
  let wxmlMode = languageModes.getMode('wxml')!;
  let wxmlEdits = await wxmlMode.format!(document, formatRange, formattingOptions, settings);
  console.log("formatting formattingOptions & settings:", formattingOptions, settings)

  console.log("formatting wxmlEdits: " + JSON.stringify(formatRange) + " : " + JSON.stringify(wxmlEdits))

  return wxmlEdits;


  // let wxmlFormattedContent = TextDocument.applyEdits(document, wxmlEdits);
  // console.log("formatting: " + wxmlFormattedContent)

  // let newDocument = TextDocument.create(document.uri + '.tmp', document.languageId, document.version, wxmlFormattedContent);

  // try {
  //   console.log("formatting run try")

  //   // run embedded formatters on wxml formatted content: - formatters see correct initial indent
  //   let afterFormatRangeLength = document.getText().length - document.offsetAt(formatRange.end); // length of unchanged content after replace range
  //   let newFormatRange = Range.create(formatRange.start, newDocument.positionAt(wxmlFormattedContent.length - afterFormatRangeLength));
  //   let embeddedRanges = languageModes.getModesInRange(newDocument, newFormatRange);

  //   let embeddedEdits: TextEdit[] = [];

  //   for (let r of embeddedRanges) {
  //     let mode = r.mode;
  //     if (mode && mode.format && enabledModes[mode.getId()] && !r.attributeValue) {
  //       let edits = await mode.format(newDocument, r, formattingOptions, settings);
  //       for (let edit of edits) {
  //         embeddedEdits.push(edit);
  //       }
  //     }
  //   }

  //   if (embeddedEdits.length === 0) {
  //     pushAll(result, wxmlEdits);
  //     console.log("formatting result : " + JSON.stringify(result))
  //     return result;
  //   }

  //   // apply all embedded format edits and create a single edit for all changes
  //   let resultContent = TextDocument.applyEdits(newDocument, embeddedEdits);
  //   let resultReplaceText = resultContent.substring(document.offsetAt(formatRange.start), resultContent.length - afterFormatRangeLength);

  //   result.push(TextEdit.replace(formatRange, resultReplaceText));

  //   console.log("formatting result : " + result)

  //   return result;
  // } finally {

  //   languageModes.onDocumentRemoved(newDocument);
  // }

}
