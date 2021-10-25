import * as vscode from 'vscode';








class WxminiViewProvider implements vscode.TreeDataProvider<ToolItem> {
  onDidChangeTreeData?: vscode.Event<void | ToolItem | null | undefined> | undefined;
  getTreeItem(element: ToolItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;


  }
  getChildren(element?: ToolItem): vscode.ProviderResult<ToolItem[]> {

    const treeItem: ToolItem[] = []
    treeItem.push(new ToolItem("wxml.showMonitor", "打开模拟器"))
    treeItem.push(new ToolItem("wxml.compile.preview", "预览"))
    treeItem.push(new ToolItem("wxml.compile.upload", "上传"))
    treeItem.push(new ToolItem("wxml.storage.clear", "清除密钥"))
    return treeItem;

  }

}

class ToolItem extends vscode.TreeItem {

  constructor(public commandStr: string, public title: string) {
    super(title, vscode.TreeItemCollapsibleState.None)
    super.command = {
      command: commandStr,
      title
    };
  }
}

export function treeDataActive(context: vscode.ExtensionContext) {

  vscode.window.registerTreeDataProvider("wxmini-view", new WxminiViewProvider())

}