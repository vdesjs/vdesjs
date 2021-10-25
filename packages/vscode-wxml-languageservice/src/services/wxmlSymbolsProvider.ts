
import { Location, Range, SymbolInformation, SymbolKind, TextDocument} from '../wxmlLanguageTypes';
import { WXMLDocument, Node } from '../parser/wxmlParser';

export function findDocumentSymbols(document: TextDocument, wxmlDocument: WXMLDocument): SymbolInformation[] {
	const symbols = <SymbolInformation[]>[];

	wxmlDocument.roots.forEach(node => {
		provideFileSymbolsInternal(document, node, '', symbols);
	});

	return symbols;
}

function provideFileSymbolsInternal(document: TextDocument, node: Node, container: string, symbols: SymbolInformation[]): void {

	const name = nodeToName(node);
	const location = Location.create(document.uri, Range.create(document.positionAt(node.start), document.positionAt(node.end)));
	const symbol = <SymbolInformation>{
		name: name,
		location: location,
		containerName: container,
		kind: <SymbolKind>SymbolKind.Field
	};

	symbols.push(symbol);

	node.children.forEach(child => {
		provideFileSymbolsInternal(document, child, name, symbols);
	});
}


function nodeToName(node: Node): string {
	let name = node.tag;

	if (node.attributes) {
		const id = node.attributes['id'];
		const classes = node.attributes['class'];

		if (id) {
			name += `#${id.replace(/[\"\']/g, '')}`;
		}

		if (classes) {
			name += classes.replace(/[\"\']/g, '').split(/\s+/).map(className => `.${className}`).join('');
		}
	}

	return name || '?';
}