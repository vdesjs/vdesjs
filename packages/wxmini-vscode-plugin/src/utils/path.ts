import * as vscode from 'vscode';

export function getCurrentFolderPath() {
  return Array.isArray(vscode.workspace.workspaceFolders)
    ? vscode.workspace.workspaceFolders[0].uri.path
    : '';
}
