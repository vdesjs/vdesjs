import * as vscode from 'vscode';


export function storageActive(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand("wxml.storage.clear", (e) => {
    context.workspaceState.update("privateKeyPath", "")
    vscode.window.showInformationMessage("清除成功")
  })
}