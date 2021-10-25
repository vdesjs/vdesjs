# WXMINI-VSCODE-PLUGIN
> 微信小程序vscode插件, [跳转至vscode插件市场](https://marketplace.visualstudio.com/items?itemName=china-bin.wxmini-vscode-plugin)

## 必读

* 使用前请使用`yarn add -D @types/wechat-miniprogram`安装小程序的js提示。

# 插件功能指南：

## 提示

### 标签名、属性名、属性值补全
键入`<`时,触发标签补全提示，键入`空格`触发标签对应的属性名补全，当属性为集合类型时，键入`上下键`选择值
![动图](https://raw.githubusercontent.com/vdesjs/vdesjs/master/packages/docs/resources/tag.gif)

### 以`bind`开头的补全提示与定义跳转
当属性名以bind开头时，会去读取当前编辑的wxml对应同名的js文件中找到除Page生命周期之外的函数用于自动补全。`ctrl + 鼠标单击`可跳转到对应的js函数之上。
![动图](https://raw.githubusercontent.com/vdesjs/vdesjs/master/packages/docs/resources/bind.gif)

### `class` 或 `id` 属性名的值补全提示与定义跳转
当属性名为`class` 或 `id` 时，会读取当前编辑的wxml对应同名的wxss文件找类选择器用于自动补全。`ctrl + 鼠标单击`可跳转到对应的wxss类选择器中。
![动图](https://raw.githubusercontent.com/vdesjs/vdesjs/master/packages/docs/resources/class.gif)
![动图](https://raw.githubusercontent.com/vdesjs/vdesjs/master/packages/docs/resources/id.gif)

### `{{*}}`补全提示与定义跳转
当在 `{{*}}`表达式中，会去当前编辑的wxml对应的同名的js文件找到data中的属性用于自动补全。`ctrl + 鼠标当前`可跳转到对应的data属性上。
![动图](https://raw.githubusercontent.com/vdesjs/vdesjs/master/packages/docs/resources/wxmlData.gif)


### json提示
插件会对app.json、sitemap.json、/**/*.json这些文件进行提示。

## 功能
![界面](https://raw.githubusercontent.com/vdesjs/vdesjs/master/packages/docs/resources/surface.png)



### 打开模拟器
打开wxml文件时，点击右上角的`打开模拟器`按钮即可在右边打开模拟器。当键入`ctrl+s(保存当前文档)`时，右侧的模拟器会自动刷新。[模拟器详情](https://github.com/vdesjs/vdesjs/tree/master/packages/wx-monitor)

ps: 模拟器可能会有不完善的地方，欢迎反馈问题。
### 预览、上传、清除密钥
这些功能的实现采用微信官方提供的[ci工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)。

![预览](https://raw.githubusercontent.com/vdesjs/vdesjs/master/packages/docs/resources/yl.gif)

