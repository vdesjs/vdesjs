import { ITagData } from "../../../wxmlLanguageTypes";

export const formCompoentTags: ITagData[] = [
  {
    "name": "button",
    "description": {
      "kind": "markdown",
      "value": "按钮"
    },
    "attributes": [
      {
        "name": "size",
        "description": "按钮的大小"
      },
      {
        "name": "type",
        "valueSet": "button-type",
        "description": "按钮的样式类型"
      },
      {
        "name": "plain",
        "valueSet": "b",
        "description": "按钮是否镂空，背景色透明"
      },
      {
        "name": "disabled",
        "valueSet": "b",
        "description": "是否禁用"
      },
      {
        "name": "loading",
        "valueSet": "b",
        "description": "名称前是否带 loading 图标"
      },
      {
        "name": "form-type",
        "valueSet": "form-type",
        "description": "用于 form 组件，点击分别会触发 form 组件的 submit/reset 事件"
      },
      {
        "name": "open-type",
        "valueSet": "button-open-type",
        "description": "微信开放能力"

      },
      {
        "name": "hover-class",
        "description": '指定按钮按下去的样式类。当 `hover-class="none"` 时，没有点击态效果'
      },
      {
        "name": "hover-stop-propagation",
        "valueSet": "b",
        "description": "指定是否阻止本节点的祖先节点出现点击态"
      },
      {
        "name": "hover-start-time",

        "description": "按住后多久出现点击态，单位毫秒"
      },
      {
        "name": "hover-stay-time",
        "description": "手指松开后点击态保留时间，单位毫秒"
      },
      {
        "name": "lang",
        "description": "指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。"
      },
      {
        "name": "session-from",
        "description": '会话来源，`open-type="contact"`时有效'
      },
      {
        "name": "send-message-title",
        "description": '会话内消息卡片标题，open-type="contact"时有效'
      },
      {
        "name": "send-message-path",
        "description": '会话内消息卡片点击跳转小程序路径，open-type="contact"时有效'
      },
      {
        "name": "send-message-img",
        "description": '会话内消息卡片图片，open-type="contact"时有效'
      },
      {
        "name": "bindgetuserinfo",
      },
      {
        "name": "bindcontact"
      },
      {
        "name": "bindgetphonenumber"
      },
      {
        "name": "binderror"
      },
      {
        "name": "bindopensetting"
      },
      {
        "name": "bindlaunchapp"
      }

    ]

  },
  {
    "name": "checkbox",
    "description": {
      "kind": "markdown",
      "value": "多选项目。"
    },
    "attributes": [
      {
        "name": "value",
        "description": "checkbox标识，选中时触发checkbox-group的 change 事件，并携带 checkbox 的 value"
      },
      {
        "name": "disabled",
        "description": "是否禁用"
      },
      {
        "name": "checked",
        "description": "当前是否选中，可用来设置默认选中"
      },
      {
        "name": "color",
        "description": "checkbox的颜色，同css的color"
      }
    ]
  },
  {
    "name": "checkbox-group",
    "description": "多项选择器，内部由多个checkbox组成。",
    "attributes": [
      {
        "name": "bindchange",
        "description": "checkbox-group中选中项发生改变时触发 change 事件，detail = {value:[选中的checkbox的value的数组]}"
      }
    ]
  },
  {
    "name": "editor",
    "description": {
      "kind": "markdown",
      "value": "富文本编辑器，可以对图片、文字进行编辑。"
    },
    "attributes": [
      {
        "name": "read-only",
        "description": "设置编辑器为只读"
      },
      {
        "name": "placeholder",
        "description": "提示信息"
      },
      {
        "name": "show-img-size",
        "description": "点击图片时显示图片大小控件"
      },
      {
        "name": "show-img-toolbar",
        "description": "点击图片时显示工具栏控件"
      },
      {
        "name": "show-img-resize",
        "description": "点击图片时显示修改尺寸控件"
      },
      {
        "name": "bindready",
        "description": "编辑器初始化完成时触发"
      },
      {
        "name": "bindfocus",
        "description": "编辑器聚焦时触发，event.detail = {html, text, delta}"
      },
      {
        "name": "bindblur",
        "description": "编辑器失去焦点时触发，detail = {html, text, delta}"
      },
      {
        "name": "bindinput",
        "description": "编辑器内容改变时触发，detail = {html, text, delta}"
      },
      {
        "name": "bindstatuschange",
        "description": "通过 Context 方法改变编辑器内样式时触发，返回选区已设置的样式"
      }
    ]
  },
  {
    "name": "form",
    "description": {
      "kind": "markdown",
      "value": "表单。将组件内的用户输入的switch input checkbox slider radio picker 提交。"
    },
    "attributes": [
      {
        "name": "report-submit",
        "description": "是否返回 formId 用于发送模板消息"
      },
      {
        "name": "report-submit-timeout",
        "description": "等待一段时间（毫秒数）以确认 formId 是否生效。如果未指定这个参数，formId 有很小的概率是无效的（如遇到网络失败的情况）。指定这个参数将可以检测 formId 是否有效，以这个参数的时间作为这项检测的超时时间。如果失败，将返回 requestFormId:fail 开头的 formId"
      },
      {
        "name": "bindsubmit",
        "description": "携带 form 中的数据触发 submit 事件，event.detail = {value : {'name': 'value'} , formId: ''}"
      },
      {
        "name": "bindreset",
        "description": "表单重置时会触发 reset 事件"
      }

    ]
  },
  {
    "name": "input",
    "description": {
      "kind": "markdown",
      "value": "输入框。该组件是原生组件，使用时请注意相关限制"
    },
    "attributes": [
      {
        "name": "value",
        "description": "输入框的初始内容"
      },
      {
        "name": "type",
        "description": "input 的类型"
      },
      {
        "name": "password",
        "description": "是否是密码类型"
      },
      {
        "name": "placeholder",
        "description": "输入框为空时占位符"
      },
      {
        "name": "placeholder-style",
        "description": "指定 placeholder 的样式"
      },
      {
        "name": "placeholder-class",
        "description": "指定 placeholder 的样式类"
      },
      {
        "name": "disabled",
        "description": "是否禁用"
      },
      {
        "name": "maxlength",
        "description": "最大输入长度，设置为 -1 的时候不限制最大长度"
      },
      {
        "name": "cursor-spacing",
        "description": "指定光标与键盘的距离，取 input 距离底部的距离和 cursor-spacing 指定的距离的最小值作为光标与键盘的距离"
      },
      {
        "name": "focus",
        "description": "获取焦点"
      },
      {
        "name": "confirm-type",
        "description": "设置键盘右下角按钮的文字，仅在type='text'时生效"
      },
      {
        "name": "always-embed",
        "description": "强制 input 处于同层状态，默认 focus 时 input 会切到非同层状态 (仅在 iOS 下生效)"
      },
      {
        "name": "confirm-hold",
        "description": "点击键盘右下角按钮时是否保持键盘不收起"
      },
      {
        "name": "cursor",
        "description": "指定focus时的光标位置"
      },
      {
        "name": "selection-start",
        "description": "光标起始位置，自动聚集时有效，需与selection-end搭配使用"
      },
      {
        "name": "selection-end",
        "description": "光标结束位置，自动聚集时有效，需与selection-start搭配使用"
      },
      {
        "name": "adjust-position",
        "description": "键盘弹起时，是否自动上推页面"
      },
      {
        "name": "hold-keyboard",
        "description": "focus时，点击页面的时候不收起键盘"
      },
      {
        "name": "safe-password-cert-path",
        "description": "安全键盘加密公钥的路径，只支持包内路径"
      },
      {
        "name": "safe-password-length",
        "description": "安全键盘输入密码长度"
      },
      {
        "name": "safe-password-time-stamp",
        "description": "安全键盘加密时间戳"
      },
      {
        "name": "safe-password-nonce",
        "description": "安全键盘加密盐值"
      },
      {
        "name": "safe-password-salt",
        "description": "安全键盘计算hash盐值，若指定custom-hash 则无效"
      },
      {
        "name": "safe-password-custom-hash",
        "description": "安全键盘计算hash的算法表达式，如 md5(sha1('foo' + sha256(sm3(password + 'bar'))))"
      },
      {
        "name": "bindinput",
        "description": "键盘输入时触发，event.detail = {value, cursor, keyCode}，keyCode 为键值，2.1.0 起支持，处理函数可以直接 return 一个字符串，将替换输入框的内容。"
      },
      {
        "name": "bindfocus",
        "description": "输入框聚焦时触发，event.detail = { value, height }，height 为键盘高度，在基础库 1.9.90 起支持"
      },
      {
        "name": "bindblur",
        "description": "输入框失去焦点时触发，event.detail = { value, encryptedValue, encryptError }"
      },
      {
        "name": "bindconfirm",
        "description": "点击完成按钮时触发，event.detail = { value }"
      },
      {
        "name": "bindkeyboardheightchange",
        "description": "键盘高度发生变化的时候触发此事件，event.detail = {height: height, duration: duration}"
      }
    ]
  },
  {
    "name": "keyboard-accessory",
    "description": {
      "kind": "markdown",
      "value": "设置 input / textarea 聚焦时键盘上方 cover-view / cover-image 工具栏视图"
    },
    "attributes": []
  },
  {
    "name": "label",
    "description": {
      "kind": "markdown",
      "value": "使用for属性找到对应的id，或者将控件放在该标签下，当点击时，就会触发对应的控件。 for优先级高于内部控件，内部有多个控件的时候默认触发第一个控件。 目前可以绑定的控件有：button, checkbox, radio, switch。"
    },
    "attributes": [
      {
        "name": "for",
        "description": "绑定控件的 id"
      }
    ]
  },
  {
    "name": "picker",
    "description": {
      "kind": "markdown",
      "value": "从底部弹起的滚动选择器。"
    },
    "attributes": [
      {
        "name": "header-text",
        "description": "选择器的标题，仅安卓可用"
      },
      {
        "name": "mode",
        "description": "选择器类型",
        "valueSet": "picker-mode"
      },
      {
        "name": "disabled",
        "description": "是否禁用"
      },
      {
        "name": "bindcancel",
        "description": "取消选择时触发"
      },
      {
        "name": "range"
      },
      {
        "name": "range-key"
      },
      {
        "name": "value"
      },
      {
        "name": "bindchange"
      },
      {
        "name": "bindcolumnchange"
      },
      {
        "name": "value"
      },
      {
        "name": "start"
      },
      {
        "name": "end"
      },
      {
        "name": "bindchange"
      }
    ]
  },
  {
    "name": "picker-view",
    "description": {
      "kind": "markdown",
      "value": "嵌入页面的滚动选择器。其中只可放置 picker-view-column组件，其它节点不会显示。"
    },
    "attributes": [
      {
        "name": "value",
        "description": "数组中的数字依次表示 picker-view 内的 picker-view-column 选择的第几项（下标从 0 开始），数字大于 picker-view-column 可选项长度时，选择最后一项。"
      },
      {
        "name": "indicator-style",
        "description": "设置选择器中间选中框的样式"
      },
      {
        "name": "indicator-class",
        "description": "设置选择器中间选中框的类名"
      },
      {
        "name": "mask-style",
        "description": "设置蒙层的样式"
      },
      {
        "name": "mask-class",
        "description": "设置蒙层的类名"
      },
      {
        "name": "bindchange",
        "description": "滚动选择时触发change事件，event.detail = {value}；value为数组，表示 picker-view 内的 picker-view-column 当前选择的是第几项（下标从 0 开始）"
      },
      {
        "name": "bindpickstart",
        "description": "当滚动选择开始时候触发事件"
      },
      {
        "name": "bindpickend",
        "description": "当滚动选择结束时候触发事件"
      }
    ]
  },
  {
    "name": "picker-view-column",
    "description": {
      "kind": "markdown",
      "value": "滚动选择器子项。"
    },
    "attributes": [

    ]
  },
  {
    "name": "radio",
    "description": {
      "kind": "markdown",
      "value": "单选项目"
    },
    "attributes": [
      {
        "name": "value",
        "description": "radio 标识。当该radio 选中时，radio-group 的 change 事件会携带radio的value"
      },
      {
        "name": "checked",
        "description": "当前是否选中"
      },
      {
        "name": "disabled",
        "description": "是否禁用"
      },
      {
        "name": "color",
        "description": "radio的颜色，同css的color"
      }
    ]
  },
  {
    "name": "radio-group",
    "description": {
      "kind": "markdown",
      "value": "单项选择器，内部由多个 radio 组成。"
    },
    "attributes": [
      {
        "name": "bindchange",
        "description": "	radio-group中选中项发生改变时触发 change 事件，detail = {value:[选中的radio的value的数组]}"
      }
    ]
  },
  {
    "name": "slider",
    "description": {
      "kind": "markdown",
      "value": "滑动选择器。"
    },
    "attributes": [
      {
        "name": "min",
        "description": "最小值"
      },
      {
        "name": "max",
        "description": "最大值"
      },
      {
        "name": "step",
        "description": "步长，取值必须大于 0，并且可被(max - min)整除"
      },
      {
        "name": "disabled",
        "description": "是否禁用"
      },
      {
        "name": "color",
        "description": "背景条的颜色（请使用 backgroundColor）"
      },
      {
        "name": "selected-color",
        "description": "已选择的颜色（请使用 activeColor）"
      },
      {
        "name": "activeColor",
        "description": "已选择的颜色"
      },
      {
        "name": "backgroundColor",
        "description": "背景条的颜色"
      },
      {
        "name": "block-size",
        "description": "滑块的大小，取值范围为 12 - 28"
      },
      {
        "name": "block-color",
        "description": "滑块的颜色"
      },
      {
        "name": "show-value",
        "description": "是否显示当前 value"
      },
      {
        "name": "bindchange",
        "description": "完成一次拖动后触发的事件，event.detail = {value}"
      },
      {
        "name": "bindchanging",
        "description": "拖动过程中触发的事件，event.detail = {value}"
      }
    ]
  },
  {
    "name": "switch",
    "description": {
      "kind": "markdown",
      "value": "开关选择器。"
    },
    "attributes": [
      {
        "name": "checked",
        "description": "是否选中"
      },
      {
        "name": "disabled",
        "description": "是否禁用"
      },
      {
        "name": "type",
        "description": "样式，有效值：switch, checkbox"
      },
      {
        "name": "color",
        "description": "switch 的颜色，同 css 的 color"
      },
      {
        "name": "bindchange",
        "description": "checked 改变时触发 change 事件，event.detail={ value}"
      }
    ]
  },
  {
    "name": "textarea",
    "description": {
      "kind": "markdown",
      "value": "多行输入框。该组件是原生组件，使用时请注意相关限制。"
    },
    "attributes": [
      {
        "name": "value",
        "description": "输入框的内容"
      },
      {
        "name": "placeholder",
        "description": "输入框为空时占位符"
      },
      {
        "name": "placeholder-style",
        "description": "指定 placeholder 的样式，目前仅支持color,font-size和font-weight"
      },
      {
        "name": "placeholder-class",
        "description": "指定 placeholder 的样式类"
      },
      {
        "name": "disabled",
        "description": "是否禁用"
      },
      {
        "name": "maxlength",
        "description": "最大输入长度，设置为 -1 的时候不限制最大长度"
      },
      {
        "name": "auto-focus",
        "description": "自动聚焦，拉起键盘。"
      },
      {
        "name": "focus",
        "description": "获取焦点"
      },
      {
        "name": "auto-height",
        "description": "是否自动增高，设置auto-height时，style.height不生效"
      },
      {
        "name": "fixed",
        "description": "如果 textarea 是在一个 position:fixed 的区域，需要显示指定属性 fixed 为 true"
      },
      {
        "name": "cursor-spacing",
        "description": "指定光标与键盘的距离。取textarea距离底部的距离和cursor-spacing指定的距离的最小值作为光标与键盘的距离"
      },
      {
        "name": "cursor",
        "description": "指定focus时的光标位置"
      },
      {
        "name": "show-confirm-bar",
        "description": "是否显示键盘上方带有”完成“按钮那一栏"
      },
      {
        "name": "selection-start",
        "description": "光标起始位置，自动聚集时有效，需与selection-end搭配使用"
      },
      {
        "name": "selection-end",
        "description": "光标结束位置，自动聚集时有效，需与selection-start搭配使用"
      },
      {
        "name": "adjust-position",
        "description": "键盘弹起时，是否自动上推页面"
      },
      {
        "name": "hold-keyboard",
        "description": "focus时，点击页面的时候不收起键盘"
      },
      {
        "name": "disable-default-padding",
        "description": "是否去掉 iOS 下的默认内边距"
      },
      {
        "name": "confirm-type",
        "description": "设置键盘右下角按钮的文字"
      },
      {
        "name": "confirm-hold",
        "description": "点击键盘右下角按钮时是否保持键盘不收起"
      },
      {
        "name": "bindfocus",
        "description": "输入框聚焦时触发，event.detail = { value, height }，height 为键盘高度，在基础库 1.9.90 起支持"
      },
      {
        "name": "bindblur",
        "description": "输入框失去焦点时触发，event.detail = {value, cursor}	"
      },
      {
        "name": "bindlinechange",
        "description": "输入框行数变化时调用，event.detail = {height: 0, heightRpx: 0, lineCount: 0}"
      },
      {
        "name": "bindinput",
        "description": "当键盘输入时，触发 input 事件，event.detail = {value, cursor, keyCode}，keyCode 为键值，目前工具还不支持返回keyCode参数。bindinput 处理函数的返回值并不会反映到 textarea 上"
      },
      {
        "name": "bindconfirm",
        "description": "点击完成时， 触发 confirm 事件，event.detail = {value: value}"
      },
      {
        "name": "bindkeyboardheightchange",
        "description": "键盘高度发生变化的时候触发此事件，event.detail = {height: height, duration: duration}	"
      }
    ]
  }
]