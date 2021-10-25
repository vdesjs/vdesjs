import { ITagData } from "../../../wxmlLanguageTypes";

export const elseTags: ITagData[] = [
  {
    "name": "map",
    "description": {
      "kind": "markdown",
      "value": "地图（v2.7.0 起支持同层渲染，相关api wx.createMapContext。"
    },
    "attributes": [
        {
          "name": "longitude",
          "description": "中心经度"
        },
        {
          "name": "latitude",
          "description": "中心纬度"
        },
        {
          "name": "scale",
          "description": "缩放级别，取值范围为3-20"
        },
        {
          "name": "min-scale",
          "description": "最小缩放级别"
        },
        {
          "name": "max-scale",
          "description": "最大缩放级别"
        },
        {
          "name": "markers",
          "description": "标记点"
        },
        {
          "name": "covers",
          "description": "即将移除，请使用 markers"
        },
        {
          "name": "polyline",
          "description": "路线"
        },
        {
          "name": "circles",
          "description": "圆"
        },
        {
          "name": "controls",
          "description": "控件（即将废弃，建议使用 cover-view 代替）"
        },
        {
          "name": "include-points",
          "description": "缩放视野以包含所有给定的坐标点"
        },
        {
          "name": "show-location",
          "description": "显示带有方向的当前定位点"
        },
        {
          "name": "polygons",
          "description": "多边形"
        },
        {
          "name": "subkey",
          "description": "个性化地图使用的key"
        },
        {
          "name": "layer-style",
          "description": "个性化地图配置的 style，不支持动态修改"
        },
        {
          "name": "rotate",
          "description": "旋转角度，范围 0 ~ 360, 地图正北和设备 y 轴角度的夹角"
        },
        {
          "name": "skew",
          "description": "倾斜角度，范围 0 ~ 40 , 关于 z 轴的倾角"
        },
        {
          "name": "enable-3D",
          "description": "展示3D楼块(工具暂不支持)"
        },
        {
          "name": "show-compass",
          "description": "显示指南针"
        },
        {
          "name": "show-scale",
          "description": "显示比例尺，工具暂不支持"
        },
        {
          "name": "enable-overlooking",
          "description": "开启俯视"
        },
        {
          "name": "enable-zoom",
          "description": "是否支持缩放"
        },
        {
          "name": "enable-scroll",
          "description": "是否支持拖动"
        },
        {
          "name": "enable-rotate",
          "description": "是否支持旋转"
        },
        {
          "name": "enable-satellite",
          "description": "是否开启卫星图"
        },
        {
          "name": "enable-traffic",
          "description": "是否开启实时路况"
        },
        {
          "name": "enable-poi",
          "description": "是否展示 POI 点"
        },
        {
          "name": "enable-building",
          "description": "是否展示建筑物"
        },
        {
          "name": "setting",
          "description": "配置项"
        },
        {
          "name": "bindtap",
          "description": "点击地图时触发，2.9.0起返回经纬度信息"
        },
        {
          "name": "bindmarkertap",
          "description": "点击标记点时触发，e.detail = {markerId}"
        },
        {
          "name": "bindlabeltap",
          "description": "点击label时触发，e.detail = {markerId}"
        },
        {
          "name": "bindcontroltap",
          "description": "点击控件时触发，e.detail = {controlId}"
        },
        {
          "name": "bindcallouttap",
          "description": "点击标记点对应的气泡时触发e.detail = {markerId}"
        },
        {
          "name": "bindupdated",
          "description": "在地图渲染更新完成时触发"
        },
        {
          "name": "bindregionchange",
          "description": "视野发生变化时触发，"
        },
        {
          "name": "bindpoitap",
          "description": "点击地图poi点时触发，e.detail = {name, longitude, latitude}"
        },
        {
          "name": "bindanchorpointtap",
          "description" : "点击定位标时触发，e.detail = {longitude, latitude}"
        }
    ],
    "references": [
      {
        "name": "微信官方文档",
        "url": "https://developers.weixin.qq.com/miniprogram/dev/component/map.html"
      }
    ]
  },
  {
    "name": "canvas",
    "description": {
      "kind": "markdown",
      "value": "画布。2.9.0 起支持一套新 Canvas 2D 接口（需指定 type 属性）"
    },
    "attributes": [
      {
        "name": "type",
        "description": "指定 canvas 类型，支持 2d (2.9.0) 和 webgl (2.7.0)"
      },
      {
        "name": "canvas-id",
        "description": "canvas 组件的唯一标识符，若指定了 type 则无需再指定该属性"
      },
      {
        "name": "disable-scroll",
        "description": "当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新"
      },
      {
        "name": "bindtouchstart",
        "description": "手指触摸动作开始"
      },
      {
        "name": "bindtouchmove",
        "description": "手指触摸后移动"
      },
      {
        "name": "bindtouchend",
        "description": "手指触摸动作结束"
      },
      {
        "name": "bindtouchcancel",
        "description": "手指触摸动作被打断，如来电提醒，弹窗"
      },
      {
        "name": "bindlongtap",
        "description": "手指长按 500ms 之后触发，触发了长按事件后进行移动不会触发屏幕的滚动"
      },
      {
        "name": "binderror",
        "description": "当发生错误时触发 error 事件，detail = {errMsg}"
      }
    ]
  },
  {
    "name": "navigation-bar",
    "description": {
      "kind": "markdown",
      "value": "页面导航条配置节点，用于指定导航栏的一些属性。只能是 page-meta 组件内的第一个节点，需要配合它一同使用。"
    },
    "attributes": [
      {
        "name": "title",
        "description": "导航条标题"
      },
      {
        "name": "loading",
        "description": "是否在导航条显示 loading 加载提示"
      },
      {
        "name": "front-color",
        "description": "导航条前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000"
      },
      {
        "name": "background-color",
        "description": "导航条背景颜色值，有效值为十六进制颜色"
      },
      {
        "name": "color-animation-duration",
        "description": "改变导航栏颜色时的动画时长，默认为 0 （即没有动画效果）"
      },
      {
        "name": "color-animation-timing-func",
        "description": "改变导航栏颜色时的动画方式，支持 linear 、 easeIn 、 easeOut 和 easeInOut"
      }
    ]
  },
  {
    "name": "page-meta",
    "description": {
      "kind": "markdown",
      "value": "页面属性配置节点，用于指定页面的一些属性、监听页面事件。只能是页面内的第一个节点。可以配合 navigation-bar 组件一同使用。"
    },
    "attributes": [
      {
        "name": "background-text-style",
        "description": "下拉背景字体、loading 图的样式，仅支持 dark 和 light"
      },
      {
        "name": "background-color",
        "description": "窗口的背景色，必须为十六进制颜色值"
      },
      {
        "name": "background-color-top",
        "description": "顶部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持"
      },
      {
        "name": "background-color-bottom",
        "description": "底部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持"
      },
      {
        "name": "root-background-color",
        "description": "页面内容的背景色，用于页面中的空白部分和页面大小变化 resize 动画期间的临时空闲区域	"
      },
      {
        "name": "scroll-top",
        "description": "滚动位置，可以使用 px 或者 rpx 为单位，在被设置时，页面会滚动到对应位置"
      },
      {
        "name": "scroll-duration",
        "description": "滚动动画时长"
      },
      {
        "name": "page-style",
        "description": "页面根节点样式，页面根节点是所有页面节点的祖先节点，相当于 HTML 中的 body 节点"
      },
      {
        "name": "page-font-size",
        "description": "页面 page 的字体大小，可以设置为 system ，表示使用当前用户设置的微信字体大小"
      },
      {
        "name": "root-font-size",
        "description": "页面的根字体大小，页面中的所有 rem 单位，将使用这个字体大小作为参考值，即 1rem 等于这个字体大小；自小程序版本 2.11.0 起，也可以设置为 system"
      },
      {
        "name": "page-orientation",
        "description": "页面的方向，可为 auto portrait 或 landscape"
      },
      {
        "name": "bindresize",
        "description": "页面尺寸变化时会触发 resize 事件， event.detail = { size: { windowWidth, windowHeight } }"
      },
      {
        "name": "bindscroll",
        "description": "页面滚动时会触发 scroll 事件， event.detail = { scrollTop }"
      },
      {
        "name": "bindscrolldone",
        "description": "如果通过改变 scroll-top 属性来使页面滚动，页面滚动结束后会触发 scrolldone 事件"
      }
    ]
  },
  {
    "name": "wxs",
    "description": {
      "kind": "markdown",
      "value": ""
    },
    "attributes": [
      {
        "name": "src",
        "description": "引用 .wxs 文件的相对路径。仅当本标签为单闭合标签或标签的内容为空时有效。"
      },
      {
        "name": "module",
        "description": "当前 <wxs> 标签的模块名。必填字段。"
      }
    ],
    "references": [
      {
        "name": "官方文档",
        "url": "https://developers.weixin.qq.com/miniprogram/dev/reference/wxs/01wxs-module.html"
      }
    ]
  },
  {
    "name": "import",
    "description": {
      "kind": "markdown",
      "value": "import可以在该文件中使用目标文件定义的template"
    },
    "attributes": [
      {
        "name": "src",
        "description": ""
      }
    ],
    "references": [
      {
        "name": "官方文档",
        "url": "https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/import.html"
      },
    ]
  },
  {
    "name": "include",
    "description": {
      "kind": "markdown",
      "value": ""
    },
    "attributes": [
      {
        "name": "src",
        "description": ""
      }
    ],
    "references": [
      {
        "name": "官方文档",
        "url": "https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/import.html"
      }
    ]
  }
]