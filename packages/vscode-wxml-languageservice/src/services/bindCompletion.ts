// import {
//   ICompletionParticipant,
//   TextDocument,
//   CompletionItemKind,
//   CompletionItem,
//   TextEdit,
//   Range,
//   Position,
//   DocumentUri,
//   FileType,
//   WxmlAttributeValueContext,
//   DocumentContext,
//   CompletionList,
// } from '../wxmlLanguageTypes';


// export class BindCompletionParticipant implements ICompletionParticipant {
//   private atributeCompletions: WxmlAttributeValueContext[] = [];

//   constructor(private readonly getContent: (uri: string, encoding?: string) => Promise<string>) {
//     console.log("bindCompletion dd")

//   }

//   public onWxmlAttributeValue(context: WxmlAttributeValueContext) {
//     console.log("bindCompletion onWxmlAttributeValue", context.attribute)
//     if (isBindAttribute(context.attribute)) {
//       this.atributeCompletions.push(context);
//     }
//   }

//   public async computeCompletions(document: TextDocument, documentContext: DocumentContext): Promise<CompletionList> {
//     const result: CompletionList = { items: [], isIncomplete: false };
//     for (const attributeCompletion of this.atributeCompletions) {
//       console.log("bindCompletion uri", document.uri)
//       result.isIncomplete = true;

//       const suggestions = await this.provideBindSuggestions();
//       for (const item of suggestions) {
//         result.items.push(item);
//       }

//     }

//     return result;

//   }

//   private async provideBindSuggestions() {
//     const result: CompletionItem[] = [];
//     result.push({
//       label: "label",
//       kind: CompletionItemKind.Function,

//     })

//     return result

//   }

// }

// export function isBindAttribute(attr: string) {
//   return /^(bind\w+)$/i.test(attr)
// }