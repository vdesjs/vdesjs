import * as vscode from 'vscode';

interface GlobalType {
  panel: vscode.WebviewPanel | null;
}


export const store: GlobalType = {
  panel: null,
};
