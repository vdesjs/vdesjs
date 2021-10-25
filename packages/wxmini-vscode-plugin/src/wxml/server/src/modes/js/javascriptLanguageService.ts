import { TextDocument, Range, CompletionItem, Position } from "../languageModes"
import * as acorn from "acorn"
import { CompletionItemKind } from "vscode-languageserver-types";

interface Definision {
  [key: string]: Range
}

const excludeProp = ['data', 'onLoad', 'onShow', 'onReady', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onShareTimeline', 'onAddToFavorites', 'onPageScroll', 'onResize', 'onTabItemTap', 'onSaveExitState']

export class JavascriptLanguageService {

  definision: Definision = {};

  constructor() {

  }

  doComplete(document: TextDocument): CompletionItem[] {
    const program: any = acorn.parse(document!.getText(), { ecmaVersion: 2015 })

    const node = program.body[0];


    console.log("JavascriptLanguageService", JSON.stringify(node))
    const completions: CompletionItem[] = [

    ]
    if (node.expression.callee.name == "Page") {
      const properties = node.expression.arguments[0].properties
      for (const propertie of properties) {
        if (excludeProp.indexOf(propertie.key.name) == -1) {
          const startPosition = document!.positionAt(propertie.start);
          const endPosition = document!.positionAt(propertie.end);
          this.definision[propertie.key.name] = Range.create(startPosition, endPosition)
          completions.push({
            label: propertie.key.name,
            kind: CompletionItemKind.Function
          })
        }
      }
      console.log("JavascriptLanguageService definision", this.definision)

    }

    return completions;
  }

  doCompleteWxmlData(document: TextDocument, dataExpression: string): CompletionItem[] {
    const program: any = acorn.parse(document!.getText(), { ecmaVersion: 2015 })
    const node = program.body[0];
    const completions: CompletionItem[] = [

    ]

    const dataExpressionArray = dataExpression.split(".")
    console.log("dataExpressionArray", dataExpressionArray)

    if (node.expression.callee.name == "Page") {
      const properties = node.expression.arguments[0].properties
      for (const propertie of properties) {
        if (propertie.key.name == "data") {
          let dataNode = propertie;

          for (let i = 0; i < dataExpressionArray.length - 1; i++) {
            if (dataNode.value.type == "ObjectExpression") {
              for (let j = 0; j < dataNode.value.properties.length; j++) {
                console.log("enter ObjectExpression", dataNode.value.properties[j].key.name)
                if (dataNode.value.properties[j].key.name == dataExpressionArray[i]) {
                  dataNode = dataNode.value.properties[j]
                }
              }

            } else {
              break;
            }
          }

          console.log("dataNode", dataNode)
          for (let i = 0; i < dataNode.value.properties.length; i++) {
            completions.push({
              kind: CompletionItemKind.Variable,
              label: dataNode.value.properties[i].key.name
            })
          }

        }
      }

    }
    console.log("JavascriptLanguageService doCompleteWxmlData", completions)



    return completions;

  }

  findDefinition(document: TextDocument, functionName: string): Range {

    console.log("JavascriptLanguageService findDefinition", this.definision[functionName], functionName)
    if (isEmptyObject(this.definision)) {
      this.doComplete(document);
      return this.definision[functionName];
    } else {
      return this.definision[functionName];
    }


  }

  findDefinitionWxmlData(document: TextDocument, dataExpression: string): Range {

    const program: any = acorn.parse(document!.getText(), { ecmaVersion: 2015 })
    const node = program.body[0];
    const dataExpressionArray = dataExpression.split(".")

    let range = Range.create(document.positionAt(0), document.positionAt(0))

    if (node.expression.callee.name == "Page") {
      const properties = node.expression.arguments[0].properties
      for (const propertie of properties) {
        if (propertie.key.name == "data") {
          let dataNode = propertie;

          for (let i = 0; i < dataExpressionArray.length; i++) {
            for (let j = 0; j < dataNode.value.properties.length; j++) {
              console.log("compare1", dataNode.value.properties[j].key.name, dataNode.value.properties[j].key.name.lenght, dataExpressionArray[i], dataExpressionArray[i].length)
              if (dataNode.value.properties[j].key.name === dataExpressionArray[i]) {
                console.log("enter ObjectExpression", dataNode.value.properties[j].key.name)
                dataNode = dataNode.value.properties[j]
                break;
              }
            }

          }

          console.log("dataNode", dataNode)
          range = Range.create(document.positionAt(dataNode.start), document.positionAt(dataNode.end))

        }
      }

    }

    return range;




  }



}

function isEmptyObject(obj: object) {
  for (const key in obj) {
    return false;
  }
  return true;
}