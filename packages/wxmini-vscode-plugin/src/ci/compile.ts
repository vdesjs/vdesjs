import * as vscode from 'vscode';
import { createProject, loadMiniprogramCI, readProjectConfig } from './common';
import * as path from "path"
import * as os from "os"
import * as fs from "fs"


function showInputBox(options: {
  title?: string,
  prompt?: string,
  placeholder?: string,
  step?: number,
  totalSteps?: number
}) {
  return new Promise(resolve => {
    const inputBox = vscode.window.createInputBox();

    inputBox.title = options.title;
    inputBox.step = options.step;
    inputBox.totalSteps = options.totalSteps;
    inputBox.placeholder = options.placeholder;
    inputBox.prompt = options.prompt;
    inputBox.show();

    inputBox.onDidAccept(() => {
      resolve(inputBox.value);
      inputBox.hide();
    });
  });
};


export function compile(context: vscode.ExtensionContext) {

  const projectConfig = readProjectConfig();

    console.log("projectConfig", projectConfig)

  // 预览
  vscode.commands.registerCommand("wxml.compile.preview", async () => {
    const options = await createProject(context);
    console.log("options", options)
    const timestamp = new Date().valueOf();
    const tempImagePath = os.tmpdir() + path.sep + options.appid + timestamp + '-qrcode.jpg';

    console.log("tempImagePath", tempImagePath)


    await vscode.window.withProgress({
      title: '正在编译小程序',
      location: vscode.ProgressLocation.Notification,
      cancellable: true,
    }, async progress => {
      const ci = await loadMiniprogramCI();
      const project = new ci.Project(options);

      await ci.preview({
        project,
        desc: '',
        setting: getCompileOptions(projectConfig.setting),
        qrcodeFormat: 'base64',
        qrcodeOutputDest: tempImagePath,
        onProgressUpdate(message: { message?: string | undefined; increment?: number | undefined; }) {
          progress.report(message);
        }
      }).then(() => {
        if (!fs.existsSync(tempImagePath)) {
          vscode.window.showErrorMessage('构建失败');
          return;
        }

        const base64 = fs.readFileSync(tempImagePath, 'utf8');


        const previewPanel = vscode.window.createWebviewPanel("preview", "预览", vscode.ViewColumn.One, {
          enableScripts: true,
          retainContextWhenHidden: true
        })
        previewPanel.webview.html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                line-height: 1.6;
              }
              .title {
                cursor: default;
                text-align: center;
                font-size: 20px;
                margin-top: 30px;
              }
              .qrcode {
                display: block;
                width: 280px;
                margin: 15px auto;
                border: 1px solid #E2E2E2;
              }
              body.vscode-dark .footer {
                background-color: #232323;
                box-shadow: inset 0 5px 10px -5px #191919, 0 1px 0 0 #444;
              }
              .footer {
                cursor: default;
                box-sizing: border-box;
                width: 280px;
                margin: 0 auto;
                border-radius: 100px;
                font-size: 13px;
                text-align: center;
                padding: 7px 14px;
              }
            </style>
          </head>
          <body>
            <div class="title">微信小程序预览</div>
            <img class="qrcode" src="${base64}">
            <div class="footer">
              <div>请使用微信扫描二维码预览</div>
              <div>“${projectConfig.projectname}”</div>
            </div>
          </body>
        </html>
      `

      })

    })

    console.log("wxml.compile.preview")
  })

  // 上传
  vscode.commands.registerCommand('wxml.compile.upload', async () => {
    const options = await createProject(context);
    const previousVersion = context.workspaceState.get('previousVersion');
    const version = await showInputBox({
      title: '上传小程序',
      prompt: '版本号',
      placeholder: '请输入小程序版本号，' + (previousVersion ? '当前版本：' + previousVersion : '如：1.2.3'),
      step: 1,
      totalSteps: 2,
    });

    if (!version) {
      return;
    }

    const description = await showInputBox({
      title: '上传小程序',
      prompt: '项目备注',
      placeholder: '请输入项目备注（选填）',
      step: 2,
      totalSteps: 2,
    });

    await vscode.window.withProgress({
      title: '正在上传小程序',
      location: vscode.ProgressLocation.Notification,
      cancellable: true,
    }, async progress => {
      const ci = await loadMiniprogramCI();
      const project = new ci.Project(options);

      await ci.upload({
        project,
        version,
        desc: description || '通过%20MiniProgram%20VSCode%20Extension%20上传',
        setting: getCompileOptions(projectConfig.setting),
        onProgressUpdate(message: { message?: string | undefined; increment?: number | undefined; }) {
          progress.report(message);
        }
      }).then(() => {
        vscode.window.showInformationMessage('上传成功，可前往微信小程序后台提交审核并发布', '打开微信小程序后台').then(result => {
          switch (result) {
            case '打开微信小程序后台':
              vscode.env.openExternal(vscode.Uri.parse("https://mp.weixin.qq.com/"));
              break;
          }
        });

        context.workspaceState.update('previousVersion', version);
      }).catch((error: Error) => {
        vscode.window.showErrorMessage(error.message);
      });
    });
  });




}

function getCompileOptions(options: any) {
  return {
    es7: true,
    minify: options.minified,
    codeProtect: options.uglifyFileName,
    autoPrefixWXSS: options.postcss,
    uploadWithSourceMap: true,
  };
}
