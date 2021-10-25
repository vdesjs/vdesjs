import * as vscode from 'vscode';
import * as path from "path"
import * as fs from "fs";
import * as pageTemplate from "./template/page"
import * as componentTemplate from "./template/component"
import { getCurrentFolderPath } from '../utils/path';
import { updateJSON } from '../utils/json';






function validate(name: string) {
  if (/^[a-zA-Z0-9-\/]+$/.test(name)) return null;
  return '名称只能包含数字、字母、中划线、路径分隔符';
}

type createType = "page" | "component";

function create(type: createType, pageName: string, dirPath: vscode.Uri) {
  console.log("dirPath", dirPath)
  const template = type == "page" ? pageTemplate : componentTemplate;
  const name = type == "page" ? "页面" : "组件";
  const pageNameArr = pageName.split("/");
  if (pageNameArr.length == 1) {
    pageNameArr[1] = "index"
  }
  pageName = pageNameArr.join("/")

  console.log(`${dirPath.fsPath}/${pageName.substr(0, pageName.lastIndexOf("/"))}`)

  fs.mkdirSync(`${dirPath.fsPath}/${pageName.substr(0, pageName.lastIndexOf("/"))}`, { recursive: true })

  for (let ext in template) {
    const filePath = `${dirPath.fsPath}/${pageName}.${ext}`;
    console.log(filePath)
    if (fs.existsSync(filePath)) {
      vscode.window.showErrorMessage(name + ' ' + pageName + ' 已存在');
      return;
    }

    // @ts-ignore
    fs.writeFileSync(filePath, template[ext].trim());
  }

  if (type == "page") {
    const projectPath = getCurrentFolderPath();
    let currentPath = dirPath.path;

    while (
      !fs.existsSync(currentPath + "/" + 'app.json') &&
      currentPath !== projectPath
    ) {
      currentPath = currentPath.split("/").slice(0, -1).join("/");
    }

    const appConfigFile = currentPath + "/" + 'app.json';

    if (fs.existsSync(vscode.Uri.file(appConfigFile).fsPath)) {
      let pagePath = dirPath.path
        .replace(currentPath, '')
        .slice(1);

      pagePath = pagePath + '/' + pageName;

      updateJSON(vscode.Uri.file(appConfigFile).fsPath, 'pages', pagePath, 'push');
    }

  }
  vscode.window.showInformationMessage(name + ' ' + pageName + ' 创建成功');

}

export function createActivate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand("wxml.create.page", (e) => {
    console.log(e)
    const uri = vscode.Uri.file(e.fsPath);

    vscode.window.showInputBox({
      prompt: "页面名称",
      placeHolder: "请输入路径",
      validateInput: validate
    }).then(value => {
      if (value) {
        create("page", value!, uri)

      }


    })
  })

  vscode.commands.registerCommand("wxml.create.component", (e) => {
    const uri = vscode.Uri.file(e.fsPath);
    vscode.window.showInputBox({
      prompt: "组件名称",
      placeHolder: "请输入路径",
      validateInput: validate
    }).then(value => {
      if (value) {
        create("component", value!, uri)

      }

    })

  })
}