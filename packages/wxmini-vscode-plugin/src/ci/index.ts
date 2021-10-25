
import * as vscode from 'vscode';
import { compile } from './compile';

export function ci(context: vscode.ExtensionContext) {
  compile(context)

}