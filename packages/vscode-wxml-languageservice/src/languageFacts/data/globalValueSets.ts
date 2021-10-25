import { IValueSet } from "../../wxmlLanguageTypes";


export const globalValueSets: IValueSet[] = [
  {
    "name": "b",
    "values": [
      {
        "name": "true"
      },
      {
        "name": "false"
      }
    ]
  },
  {
    "name": "lang",
    "values": [
      {
        "name": "en",
        "description": "英文"
      },
      {
        "name": "zh_CN",
        "description": "简体中文"
      },
      {
        "name": "zh_TW",
        "description": "繁体中文"
      }
    ]
  },
  {
    "name": "form-type",
    "values": [
      {
        "name": "submit"
      },
      {
        "name": "reset"
      }
    ],
  },
  {
    "name": "button-type",
    "values": [
      {
        "name": "primary",

      },
      {
        "name": "default"
      },
      {
        "name": "warn"
      }
    ],
  },
  {
    "name": "button-open-type",
    "values": [
      {
        "name": "contact",
        "description": "打开客服会话，如果用户在会话中点击消息卡片后返回小程序，可以从 bindcontact 回调中获得具体信息，具体说明 （小程序插件中不能使用）"
      },
      {
        "name": "share",
        "description": "触发用户转发，使用前建议先阅读使用指引"
      },
      {
        "name": "getPhoneNumber",
        "description": "获取用户手机号，可以从bindgetphonenumber回调中获取到用户信息，具体说明 （小程序插件中不能使用）"
      },
      {
        "name": "getUserInfo",
        "description": "获取用户信息，可以从bindgetuserinfo回调中获取到用户信息 （小程序插件中不能使用）"
      },
      {
        "name": "launchApp",
        "description": "打开APP，可以通过app-parameter属性设定向APP传的参数具体说明"
      },
      {
        "name": "openSetting",
        "description": "打开授权设置页"
      },
      {
        "name": "feedback",
        "description": "打开“意见反馈”页面，用户可提交反馈内容并上传日志，开发者可以登录小程序管理后台后进入左侧菜单“客服反馈”页面获取到反馈内容"
      }
    ]
  },
  {
    "name": "image-mode",
    "values": [
      {
        "name": "scaleToFill",
        "description": "缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素"
      },
      {
        "name": "aspectFit",
        "description": "缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。"
      },
      {
        "name": "aspectFill",
        "description": "缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。"
      },
      {
        "name": "widthFix",
        "description": "缩放模式，宽度不变，高度自动变化，保持原图宽高比不变"
      },
      {
        "name": "heightFix",
        "description": "缩放模式，高度不变，宽度自动变化，保持原图宽高比不变"
      },
      {
        "name": "top",
        "description": "裁剪模式，不缩放图片，只显示图片的顶部区域"
      },
      {
        "name": "bottom",
        "description": "裁剪模式，不缩放图片，只显示图片的底部区域"
      },
      {
        "name": "center",
        "description": "裁剪模式，不缩放图片，只显示图片的中间区域"
      },
      {
        "name": "left",
        "description": "裁剪模式，不缩放图片，只显示图片的左边区域"
      },
      {
        "name": "right",
        "description": "裁剪模式，不缩放图片，只显示图片的右边区域"
      },
      {
        "name": "top left",
        "description": "裁剪模式，不缩放图片，只显示图片的左上边区域"
      },
      {
        "name": "top right",
        "description": "裁剪模式，不缩放图片，只显示图片的右上边区域"
      },
      {
        "name": "bottom left",
        "description": "裁剪模式，不缩放图片，只显示图片的左下边区域"
      },
      {
        "name": "bottom right",
        "description": "裁剪模式，不缩放图片，只显示图片的右下边区域"
      }
    ]
  },
  {
    "name": "referrer-policy",
    "values": [
      {
        "name": "origin",
        "description": "发送完整的referrer",

      },
      {
        "name": "no-referrer",
        "description": "不发送"
      }
    ]
  },
  {
    "name": "picker-mode",
    "values": [
      {
        "name": "selector",
        "description": "普通选择器"
      },
      {
        "name": "multiSelector",
        "description": "多列选择器"
      },
      {
        "name": "time",
        "description": "时间选择器"
      },
      {
        "name": "date",
        "description": "日期选择器"
      },
      {
        "name": "region",
        "description": "省市区选择器"
      }
    ]
  },
  {
    "name": "functional-page-navigator-version",
    "values": [
      {
        "name": "develop",
        "description": "开发版"
      },
      {
        "name": "trial",
        "description": "体验版"
      },
      {
        "name": "release",
        "description": "正式版"
      }
    ]
  },
  {
    "name": "functional-page-navigator-name",
    "values": [
      {
        "name": "loginAndGetUserInfo",
        "description": "用户信息功能页"
      },
      {
        "name": "requestPayment",
        "description": "支付功能页"
      },
      {
        "name": "chooseAddress",
        "description": "收货地址功能页"
      },
      {
        "name": "chooseInvoice",
        "description": "获取发票功能页"
      },
      {
        "name": "chooseInvoiceTitle",
        "description": "获取发票抬头功能页"
      }
    ]
  },
  {
    "name": "live-player-mode",
    "values": [
      {
        "name": "live",
        "description": "直播"
      },
      {
        "name": "RTC",
        "description": "实时通话，该模式时延更低"
      }
    ]
  },
  {
    "name": "live-player-orientation",
    "values": [
      {
        "name": "vertical",
        "description": "竖直"
      },
      {
        "name": "horizontal",
        "description": "水平"
      }
    ]
  },
  {
    "name": "live-player-object-fit",
    "values": [
      {
        "name": "contain",
        "description": "图像长边填满屏幕，短边区域会被填充⿊⾊"
      },
      {
        "name": "fillCrop",
        "description": "图像铺满屏幕，超出显示区域的部分将被截掉"
      }
    ]
  },
  {
    "name": "live-player-sound-mode",
    "values": [
      {
        "name": "speaker",
        "description": "扬声器"
      },
      {
        "name": "ear",
        "description": "听筒"
      }
    ]
  },
  {
    "name": "live-player-picture-in-picture-mode",
    "values": [
      {
        "name": "[]",
        "description": "取消小窗"
      },
      {
        "name": "push",
        "description": "路由 push 时触发小窗"
      },
      {
        "name": "pop",
        "description": "路由 pop 时触发小窗"
      }
    ]
  },
  {
    "name": "live-player-referrer-policy",
    "values": [
      {
        "name": "origin",
        "description": "发送完整的referrer"
      },
      {
        "name": "no-referrer",
        "description": "不发送"
      }
    ]
  },
  {
    "name": "live-pusher-orientation",
    "values": [
      {
        "name": "vertical",
        "description": "竖直"
      },
      {
        "name": "horizontal",
        "description": "水平"
      },
    ]
  },
  {
    "name": "live-pusher-local-mirror",
    "values": [
      {
        "name": "auto",
        "description": "前置摄像头镜像，后置摄像头不镜像"
      },
      {
        "name": "enable",
        "description": "前后置摄像头均镜像"
      },
      {
        "name": "disable",
        "description": "前后置摄像头均不镜像"
      }
    ]
  },
  {
    "name": "live-pusher-audio-reverb-type",
    "values": [
      {
        "name": "0",
        "description": "关闭"
      },
      {
        "name": "1",
        "description": "KTV"
      },
      {
        "name": "2",
        "description": "小房间"
      },
      {
        "name": "3",
        "description": "大会堂"
      },
      {
        "name": "4",
        "description": "低沉"
      },
      {
        "name": "5",
        "description": "洪亮"
      },
      {
        "name": "6",
        "description": "金属声"
      },
      {
        "name": "7",
        "description": "磁性"
      }
    ]
  },
  {
    "name": "live-pusher-audio-volume-type",
    "values": [
      {
        "name": "auto",
        "description": "自动"
      },
      {
        "name": "media",
        "description": "媒体音量"
      },
      {
        "name": "voicecall",
        "description": "通话音量"
      }
    ]
  },
  {
    "name": "live-pusher-beauty-style",
    "values": [
      {
        "name": "smooth",
        "description": "光滑美颜"
      },
      {
        "name": "nature",
        "description": "自然美颜"
      }
    ]
  },
  {
    "name": "live-pusher-filter",
    "values": [
      {
        "name": "standard",
        "description": "标准"
      },
      {
        "name": "pink",
        "description": "粉嫩"
      },
      {
        "name": "nostalgia",
        "description": "怀旧"
      },
      {
        "name": "blues",
        "description": "蓝调"
      },
      {
        "name": "romantic",
        "description": "浪漫"
      },
      {
        "name": "cool",
        "description": "清凉"
      },
      {
        "name": "fresher",
        "description": "清新"
      },
      {
        "name": "solor",
        "description": "日系"
      },
      {
        "name": "aestheticism",
        "description": "唯美"
      },
      {
        "name": "whitening",
        "description": "美白"
      },
      {
        "name": "cerisered",
        "description": "樱红"
      }
    ]
  },
  {
    "name": "video-direction",
    "values": [
      {
        "name": "0",
        "description": "正常竖向"
      },
      {
        "name": "90",
        "description": "屏幕逆时针90度"
      },
      {
        "name": "-90",
        "description": "屏幕顺时针90度"
      }
    ]
  },
  {
    "name": "video-object-fit",
    "values": [
      {
        "name": "contain",
        "description": "包含"
      },
      {
        "name": "fill",
        "description": "填充"
      },
      {
        "name": "cover",
        "description": "覆盖"
      }

    ]
  },
  {
    "name": "video-play-btn-position",
    "values": [
      {
        "name": "bottom",
        "description": "controls bar上"
      },
      {
        "name": "center",
        "description": "视频中间"
      }
    ]
  },
  {
    "name": "video-picture-in-picture-mode",
    "values": [
      {
        "name": "[]",
        "description": "取消小窗"
      },
      {
        "name": "push",
        "description": "路由 push 时触发小窗"
      },
      {
        "name": "pop",
        "description": "路由 pop 时触发小窗"
      }
    ]
  },
  {
    "name": "video-referrer-policy",
    "values": [
      {
        "name": "origin",
        "description": "发送完整的referrer"
      },
      {
        "name": "no-referrer",
        "description": ""
      }
    ]
  },
  {
    "name": "open-data-type",
    "values": [
      {
        "name": "groupName",
        "description": "拉取群名称"
      },
      {
        "name": "userNickName",
        "description": "用户昵称"
      },
      {
        "name": "userAvatarUrl",
        "description": "用户头像"
      },
      {
        "name": "userGender",
        "description": "用户性别"
      },
      {
        "name": "userCity",
        "description": "用户所在城市"
      },
      {
        "name": "userProvince",
        "description": "用户所在省份"
      },
      {
        "name": "userCountry",
        "description": "用户所在国家"
      },
      {
        "name": "userLanguage",
        "description": "用户的语言"
      }

    ]
  },
  {
    "name": "camera-mode",
    "values": [
      {
        "name": "normal",
        "description": "相机模式"
      },
      {
        "name": "scanCode",
        "description": "扫码模式"
      }
    ]
  },
  {
    "name": "camera-resolution",
    "values": [
      {
        "name": "low",
        "description": "低"
      },
      {
        "name": "medium",
        "description": "中"
      },
      {
        "name": "high",
        "description": "高"
      }
    ]
  },
  {
    "name": "camera-device-position",
    "values": [
      {
        "name": "front",
        "description": "前置"
      },
      {
        "name": "back",
        "description": "后置"
      },
    ]
  },
  {
    "name": "camera-flash",
    "values": [
      {
        "name": "auto",
        "description": "自动"
      },
      {
        "name": "on",
        "description": "打开"
      },
      {
        "name": "off",
        "description": "关闭"
      },
      {
        "name": "torch",
        "description": "常亮"
      }
    ]
  },
  {
    "name": "camera-frame-size",
    "values": [
      {
        "name": "small",
        "description": "小尺寸帧数据"
      },
      {
        "name": "medium",
        "description": "中尺寸帧数据"
      },
      {
        "name": "large",
        "description": "大尺寸帧数据"
      }
    ]
  }

]
