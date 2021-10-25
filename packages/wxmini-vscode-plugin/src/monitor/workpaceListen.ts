import * as vscode from 'vscode';
import { store } from './store';
import { updateRouteByPages } from './router';

export function workpaceListen() {


  vscode.workspace.onDidDeleteFiles((e) => {
    console.log('onDidDeleteFiles', e);
  });

  vscode.workspace.onDidCreateFiles((e) => {
    console.log('onDidCreateFiles', e);
  });

  vscode.workspace.onDidRenameFiles((e) => {
    console.log('onDidRenameFiles', e);
  });

  vscode.workspace.onDidSaveTextDocument((e) => {
    console.log('onDidSaveTextDocument', e, store.panel);

    if (store.panel != null) {

      if (vscode.workspace.asRelativePath(e.uri) == 'app.json') {
        updateAppjson();
      }

      if (e.languageId == 'wxml') {
        vscode.workspace.fs.readFile(e.uri).then((uni8Array) => {
          console.log(getPage(e.uri));
          const wxmlText = new TextDecoder().decode(uni8Array);
          store.panel?.webview.postMessage({
            command: 'updateWxml',
            data: {
              page: getPage(e.uri),
              text: wxmlText
            }
          });
        });
      }

      if (e.languageId == 'css') {
        vscode.workspace.fs.readFile(e.uri).then((unit8Array) => {
          const wxssText = new TextDecoder().decode(unit8Array);
          console.log("wxssText", wxssText)
          store.panel?.webview.postMessage({
            command: 'updateWxss',
            data: {
              page: getPage(e.uri),
              text: wxssText
            }
          });

        });
      }

      if (e.languageId == 'javascript') {
        vscode.workspace.fs.readFile(e.uri).then((unit8Array) => {
          const jsText = new TextDecoder().decode(unit8Array);
          store.panel?.webview.postMessage({
            command: "updateJs",
            data: {
              page: getPage(e.uri),
              text: jsText
            }
          })

        })
      }
    }
  });
}

function getPage(uri: vscode.Uri) {
  let path = vscode.workspace.asRelativePath(uri);
  path = path.split('.')[0];

  return path;
}


export function updateAppjson() {
  console.log("updateAppjson")

  vscode.workspace.findFiles("app.json").then(async (uris) => {
    const appjsonUri = uris[0]
    const unit8Array = await vscode.workspace.fs.readFile(appjsonUri);
    const appjson = JSON.parse(new TextDecoder().decode(unit8Array));
    console.log(appjson);
    await updateRouteByPages(appjson.pages);

  })




}
