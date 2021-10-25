import * as vscode from 'vscode';
import { wxmonitorWebview } from './WxmonitorWebview';

export function monitor(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand("wxml.showMonitor", wxmonitorWebview(context))
}