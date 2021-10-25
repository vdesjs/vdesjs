import { ITagData } from "../../../wxmlLanguageTypes";

export const navigatorTags: ITagData[] = [
  {
    "name": "functional-page-navigator",
    "description": {
      "kind": "markdown",
      "value": "仅在插件中有效，用于跳转到插件功能页。"
    },
    "attributes": [
      {
        "name": "version",
        "description": "跳转到的小程序版本，线上版本必须设置为 release",
        "valueSet": "functional-page-navigator-version"
      },
      {
        "name": "name",
        "description": "要跳转到的功能页",
        "valueSet": "functional-page-navigator-name"
      },
      {
        "name": "args",
        "description": "功能页参数，参数格式与具体功能页相关"
      },
      {
        "name": "bindsuccess",
        "description": "功能页返回，且操作成功时触发， detail 格式与具体功能页相关"
      },
      {
        "name": "bindfail",
        "description": "功能页返回，且操作失败时触发， detail 格式与具体功能页相关"
      },
      {
        "name": "bindcancel",
        "description": "因用户操作从功能页返回时触发"
      }
    ]
  },
  {
    "name": "navigator",
    "description": {
      "kind": "markdown",
      "value": "页面链接。"
    },
    "attributes": [
      {
        "name": "target",
        "description": "在哪个目标上发生跳转，默认当前小程序"
      },
      {
        "name": "url",
        "description": "当前小程序内的跳转链接"
      },
      {
        "name": "open-type",
        "description": "跳转方式"
      },
      {
        "name": "delta",
        "description": "当 open-type 为 'navigateBack' 时有效，表示回退的层数"
      },
      {
        "name": "app-id",
        "description": "当target=\"miniProgram\"时有效，要打开的小程序 appId"
      },
      {
        "name": "path",
        "description": "当target=\"miniProgram\"时有效，打开的页面路径，如果为空则打开首页"
      },
      {
        "name": "extra-data",
        "description": "当target=\"miniProgram\"时有效，需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。详情"
      },
      {
        "name": "extra-data",
        "description": "当target=\"miniProgram\"时有效，需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。详情"
      },
      {
        "name": "version",
        "description": "当target=\"miniProgram\"时有效，要打开的小程序版本"
      },
      {
        "name": "short-link",
        "description": "当target=\"miniProgram\"时有效，当传递该参数后，可以不传 app-id 和 path。链接可以通过【小程序菜单】->【复制链接】获取。"
      },
      {
        "name": "hover-class",
        "description": "指定点击时的样式类，当hover-class=\"none\"时，没有点击态效果"
      },
      {
        "name": "hover-stop-propagation",
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
        "name": "bindsuccess",
        "description": "当target=\"miniProgram\"时有效，跳转小程序成功"
      },
      {
        "name": "bindfail",
        "description": "当target=\"miniProgram\"时有效，跳转小程序失败"
      },
      {
        "name": "bindcomplete",
        "description": "当target=\"miniProgram\"时有效，跳转小程序完成"

      }
    ]
  }

]