import { ITagData } from "../../../wxmlLanguageTypes";

export const basicContentTags: ITagData[] = [
  {
    "name": "icon",
    "description": {
      "kind": "markdown",
      "value": "图标。组件属性的长度单位默认为px，2.4.0起支持传入单位(rpx/px)。"
    },
    "attributes": [
      {
        "name": "type",
        "description": "icon的类型，有效值：success, success_no_circle, info, warn, waiting, cancel, download, search, clear",
      },
      {
        "name": "size",
        "description": "icon的大小"
      },
      {
        "name": "color",
        "description": "icon的颜色，同css的color"
      }
    ]
  },
  {
    "name": "progress",
    "description": {
      "kind": "markdown",
      "value": "进度条。组件属性的长度单位默认为px，2.4.0起支持传入单位(rpx/px)。"
    },
    "attributes": [
      {
        "name": "percent",
        "description": "百分比0~100"
      },
      {
        "name": "show-info",
        "description": "在进度条右侧显示百分比"
      },
      {
        "name": "border-radius",
        "description": "圆角大小"
      },
      {
        "name": "font-size",
        "description": "右侧百分比字体大小"
      },
      {
        "name": "stroke-width",
        "description": "进度条线的宽度"
      },
      {
        "name": "color",
        "description": "进度条颜色（请使用activeColor）"
      },
      {
        "name": "activeColor",
        "description": "已选择的进度条的颜色"
      },
      {
        "name": "backgroundColor",
        "description": "未选择的进度条的颜色"
      },
      {
        "name": "active",
        "description": "进度条从左往右的动画"
      },
      {
        "name": "active-mode",
        "description": "backwards: 动画从头播；forwards：动画从上次结束点接着播"
      },
      {
        "name": "duration",
        "description": "进度增加1%所需毫秒数"
      },
      {
        "name": "bindactiveend",
        "description": "动画完成事件"
      }
    ]
  },
  {
    "name": "rich-text",
    "description": {
      "kind": "markdown",
      "value": "富文本。"
    },
    "attributes": [
      {
        "name": "nodes",
        "description": "节点列表/HTML String"
      },
      {
        "name": "space",
        "description": "显示连续空格"
      }
    ]
  },
  {
    "name": "text",
    "description": {
      "kind": "markdown",
      "value": "文本"
    },
    "attributes": [
      {
        "name": "selectable",
        "description": "文本是否可选 (已废弃)"
      },
      {
        "name": "user-select",
        "description": "文本是否可选，该属性会使文本节点显示为 inline-block"
      },
      {
        "name": "space",
        "description": "显示连续空格"
      },
      {
        "name": "decode",
        "description": "是否解码"
      }
    ]
  }
]