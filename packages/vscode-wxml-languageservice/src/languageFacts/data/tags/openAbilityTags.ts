import { ITagData } from "../../../wxmlLanguageTypes";

export const openAbilityTags: ITagData[] = [
  {
    "name": "ad",
    "description": {
      "kind": "markdown",
      "value": "Banner 广告。"
    },
    "attributes": [
      {
        "name": "unit-id",
        "description": "广告单元id，可在小程序管理后台的流量主模块新建"
      },
      {
        "name": "ad-intervals",
        "description": "广告自动刷新的间隔时间，单位为秒，参数值必须大于等于30（该参数不传入时 Banner 广告不会自动刷新）"
      },
      {
        "name": "ad-type",
        "description": "广告类型，默认为展示banner，可通过设置该属性为video展示视频广告, grid为格子广告"
      },
      {
        "name": "ad-theme"
      },
      {
        "name": "bindload",
        "description": "广告加载成功的回调"
      },
      {
        "name": "binderror",
        "description": "广告加载失败的回调，event.detail = {errCode: 1002}"
      },
      {
        "name": "bindclose",
        "description": "广告关闭的回调"
      }
    ]
  },
  {
    "name": "ad-custom",
    "description": {
      "kind": "markdown",
      "value": "原生模板 广告。"
    },
    "attributes": [
      {
        "name": "unit-id",
        "description": "广告单元id，可在小程序管理后台的流量主模块新建"
      },
      {
        "name": "ad-intervals",
        "description": "广告自动刷新的间隔时间，单位为秒，参数值必须大于等于30（该参数不传入时 模板 广告不会自动刷新）"
      },
      {
        "name": "bindload",
        "description": "广告加载成功的回调"
      },
      {
        "name": "binderror",
        "description": "广告加载失败的回调，event.detail = {errCode: 1002}"
      }
    ]
  },
  {
    "name": "official-account",
    "description": {
      "kind": "markdown",
      "value": "公众号关注组件。当用户扫小程序码打开小程序时，开发者可在小程序内配置公众号关注组件，方便用户快捷关注公众号，可嵌套在原生组件内。"
    },
    "attributes": [
      {
        "name": "bindload",
        "description": "组件加载成功时触发"
      },
      {
        "name": "binderror",
        "description": "组件加载失败时触发"
      }
    ]
  },
  {
    "name": "open-data",
    "description": {
      "kind": "markdown",
      "value": "用于展示微信开放的数据。"
    },
    "attributes": [
      {
        "name": "type",
        "description": "开放数据类型",
        "valueSet": "open-data-type"
      },
      {
        "name": "open-gid",
        "description": "当 type=\"groupName\" 时生效, 群id"
      },
      {
        "name": "lang",
        "description": "当 type=\"user*\" 时生效，以哪种语言展示 userInfo",
        "valueSet": "lang"
      },
      {
        "name": "default-text",
        "description": "数据为空时的默认文案"
      },
      {
        "name": "default-avatar",
        "description": "用户头像为空时的默认图片，支持相对路径和网络图片路径"
      },
      {
        "name": "binderror",
        "description": "群名称或用户信息为空时触发"
      }
    ]
  },
  {
    "name": "web-view",
    "description": {
      "kind": "markdown",
      "value": "承载网页的容器。会自动铺满整个小程序页面，个人类型的小程序暂不支持使用。"
    },
    "attributes": [
      {
        "name": "src",
        "description": "webview 指向网页的链接。可打开关联的公众号的文章，其它网页需登录小程序管理后台配置业务域名。"
      },
      {
        "name": "bindmessage",
        "description": "网页向小程序 postMessage 时，会在特定时机（小程序后退、组件销毁、分享）触发并收到消息。e.detail = { data }，data是多次 postMessage 的参数组成的数组"
      },
      {
        "name": "bindload",
        "description": "网页加载成功时候触发此事件。e.detail = { src }"
      },
      {
        "name": "binderror",
        "description": "网页加载失败的时候触发此事件。e.detail = { src }"
      }
    ]
  }
]