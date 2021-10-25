import * as vscode from 'vscode';
import { ci } from './ci';
import { commands } from './commands';
import { monitor } from './monitor';
import { treeDataActive } from './view/treeData';
import { wxmlClient } from './wxml/client/node';




export function activate(context: vscode.ExtensionContext) {
  console.log('wxmini-vscode-plugin active');

  monitor(context)

  wxmlClient(context)

  ci(context)

  commands(context)

  treeDataActive(context)


}
