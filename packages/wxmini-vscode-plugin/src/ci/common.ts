import * as vscode from 'vscode';
import * as path from "path"
import * as fs from "fs"
import { getCurrentFolderPath } from '../utils/path';
import { readJSON } from '../utils/json';

export function loadMiniprogramCI() {

  return require("miniprogram-ci")
}

interface IProject {
  appid: string
  type: string
  projectPath: string
  privateKeyPath: string
}


export function createProject(context: vscode.ExtensionContext): Promise<IProject> {
  const privateKeyPath: string | undefined = context.workspaceState.get('privateKeyPath');



  const rootPath = getCurrentFolderPath();
  const projectConfig = readProjectConfig();

  console.log("projectConfig", projectConfig)

  const options = {
    appid: projectConfig.appid,
    type: projectConfig.compileType === 'miniprogram' ? 'miniProgram' : 'miniProgramPlugin',
    projectPath: getMiniProgramRootPath(rootPath, projectConfig.miniprogramRoot),
    ignores: ['node_modules/**/*'],
  };
  if (!projectConfig) {
    return Promise.reject('未找到 project.config.json 文件');
  }

  if (privateKeyPath && fs.existsSync(privateKeyPath)) {
    return Promise.resolve({
      ...options,
      privateKeyPath,
    });
  }

  return new Promise((resolve, reject) => {
    vscode.window.showInformationMessage('请选择代码上传密钥文件，代码上传密钥可以在微信小程序后台“开发”-“开发设置”功能生成并下载，并关闭 IP 白名单', '打开微信小程序后台', '查看详细说明').then(result => {
      switch (result) {
        case '打开微信小程序后台':
          vscode.env.openExternal(vscode.Uri.parse("https://mp.weixin.qq.com/"));
          break;
        case '查看详细说明':
          vscode.env.openExternal(vscode.Uri.parse("https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html"));
          break;
      }
    });
    vscode.window.showOpenDialog({
      canSelectMany: false,
      filters: {
        '代码上传密钥文件': ['key'],
      },
      openLabel: '选择',
    }).then(result => {
      if (Array.isArray(result)) {
        const keyFile = result[0].fsPath;
        context.workspaceState.update('privateKeyPath', keyFile);

        resolve({
          ...options,
          privateKeyPath: keyFile,
        });
      } else {
        reject();
      }
    });
  });







}

function getMiniProgramRootPath(rootPath: string, relativePath: string) {
  if (relativePath) {
    return vscode.Uri.file(path.resolve(rootPath, relativePath)).fsPath;
  }

  return vscode.Uri.file(rootPath).fsPath;
}


export function readProjectConfig() {
  const rootPath = getCurrentFolderPath();
  const projectFilePath = vscode.Uri.file(rootPath + "/" + 'project.config.json').fsPath;

  if (fs.existsSync(projectFilePath)) {
    return readJSON(projectFilePath);
  }

  return null;
}


