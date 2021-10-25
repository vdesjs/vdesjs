import { createActivate } from './create';
import * as vscode from 'vscode';
import { storageActive } from './storage';

export function commands(context: vscode.ExtensionContext) {
  createActivate(context)
  storageActive(context)
}