// import { parseWxml, parseWxss } from '@vdesjs/wx-monitor';
import * as vscode from 'vscode';
import { store } from './store';


export async function updateRouteByPages(pages: string[]) {
  for (const page of pages) {


    const wxmlUri = vscode.Uri.parse(`${getWorkpacePath()}/${page}.wxml`);
    console.log(wxmlUri)
    const wxmlText = new TextDecoder().decode(
      await vscode.workspace.fs.readFile(wxmlUri)
    );

    const wxssUri = vscode.Uri.parse(`${getWorkpacePath()}/${page}.wxss`);
    const wxssText = new TextDecoder().decode(
      await vscode.workspace.fs.readFile(wxssUri)
    );

    const jsUri = vscode.Uri.parse(`${getWorkpacePath()}/${page}.js`);
    const jsText = new TextDecoder().decode(
      await vscode.workspace.fs.readFile(jsUri)
    );

    store.panel?.webview.postMessage({
      command: "updateRouter",
      data: {
        key: page,
        val: {
          path: page,
          wxml: {
            text: wxmlText
          },
          wxss: {
            text: wxssText
          },
          js: {
            text: jsText
          }
        }
      }
    })


  }


}


function getWorkpacePath() {
  return vscode.workspace.workspaceFolders?.[0].uri.path
}