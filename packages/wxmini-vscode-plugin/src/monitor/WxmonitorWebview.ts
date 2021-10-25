import * as vscode from 'vscode';
// @ts-ignore
import monitor from '../../.monitor/monitor.html';
import * as path from 'path';
import { store } from './store';

import { updateAppjson, workpaceListen } from './workpaceListen';


let globalHtml: string = '';


export function wxmonitorWebview(context: vscode.ExtensionContext) {


  return () => {



    store.panel = vscode.window.createWebviewPanel(
      'extension.wxmonitorPreview',
      '模拟器',
      { preserveFocus: false, viewColumn: vscode.ViewColumn.Two },
      {
        enableScripts: true
      }
    );

    const monitorDiskPath = vscode.Uri.file(path.join(context.extensionPath, '.monitor'))

    const host = store.panel.webview.asWebviewUri(monitorDiskPath)

    globalHtml = monitor.replace(
      /\/assets/g,
      host.toString() + '/assets'
    );
    console.log(globalHtml);

    store.panel.onDidDispose(() => {
      console.log('close');
      store.panel = null;
    });

    store.panel.webview.html = globalHtml;


    workpaceListen();

    updateAppjson();


  };
}
