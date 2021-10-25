
import { TextDocument, Position } from '../wxmlLanguageTypes';
import { WXMLDocument } from '../parser/wxmlParser';

export function findMatchingTagPosition(
  document: TextDocument,
  position: Position,
  wxmlDocument: WXMLDocument
): Position | null {
  const offset = document.offsetAt(position);
  const node = wxmlDocument.findNodeAt(offset);

  if (!node.tag) {
    return null;
	}

	if (!node.endTagStart) {
		return null;
	}

	// Within open tag, compute close tag
	if (node.start + '<'.length <= offset && offset <= node.start + '<'.length + node.tag.length) {
		const mirrorOffset = (offset - '<'.length - node.start) + node.endTagStart + '</'.length;
		return document.positionAt(mirrorOffset);
	}

	// Within closing tag, compute open tag
	if (node.endTagStart + '</'.length <= offset && offset <= node.endTagStart + '</'.length + node.tag.length) {
		const mirrorOffset = (offset - '</'.length - node.endTagStart) + node.start + '<'.length;
		return document.positionAt(mirrorOffset);
	}

	return null;
}
