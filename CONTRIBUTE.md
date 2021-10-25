# 贡献指南

## 提交规范
### 格式
```js
<type>: <subject> [(issureID)]
```
例子:
```js
git commit -m "fix: 修复了xxxx问题 (#1)"
```
### type
type的可选范围：
* feat 新功能
* fix 修复bug
* docs 文档更新
* test 测试内容提交
* chore 构建相关
* version 版本更新

### subject
描述此次提交

### issureID
如果有issureID请填写




## 贡献指引
### [vscode插件贡献](packages/wxmini-vscode-plugin)
> wxmini-vscode-plugin整体是采用[Language Server Protocol](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)设计的，这种方式将相对吃cpu资源的语言解析服务提取为一个单独的进程。

运行vscode插件，请使用vscode单独打开`packages/wxmini-vscode-plugin`，然后左侧切换`Run and Debug`选项卡，点击`Client + Server`运行调试插件


1. 标签名、属性名、属性值代码位置[点击跳转](packages/vscode-wxml-languageservice/src/languageFacts/data/index.ts)


### [模拟器贡献](packages/wx-monitor)

修改模拟器代码后，记得前往`wxmini-vscode-plugin`中运行`yarn update:monitor`更新模拟器后，启动vscode插件验证修改。