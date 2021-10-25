import { ITagData } from "../../../wxmlLanguageTypes";

export const mediaCompoentTags: ITagData[] = [
  {
    "name": "audio",
    "description": {
      "kind": "markdown",
      "value": "音频。1.6.0版本开始，该组件不再维护。建议使用能力更强的 wx.createInnerAudioContext 接口"
    },
    "attributes": [
      {
        "name": "id",
        "description": "audio 组件的唯一标识符"
      },
      {
        "name": "src",
        "description": "要播放音频的资源地址"
      },
      {
        "name": "loop",
        "description": "是否循环播放"
      },
      {
        "name": "controls",
        "description": "是否显示默认控件"
      },
      {
        "name": "poster",
        "description": "默认控件上的音频封面的图片资源地址，如果 controls 属性值为 false 则设置 poster 无效"
      },
      {
        "name": "name",
        "description": "默认控件上的音频名字，如果 controls 属性值为 false 则设置 name 无效"
      },
      {
        "name": "author",
        "description": "默认控件上的作者名字，如果 controls 属性值为 false 则设置 author 无效"
      },
      {
        "name": "binderror",
        "description": "当发生错误时触发 error 事件，detail = {errMsg:MediaError.code}"
      },
      {
        "name": "bindplay",
        "description": "当开始/继续播放时触发play事件"
      },
      {
        "name": "bindpause",
        "description": "当暂停播放时触发 pause 事件"
      },
      {
        "name": "bindtimeupdate",
        "description": "当播放进度改变时触发 timeupdate 事件，detail = {currentTime, duration}"
      },
      {
        "name": "bindended",
        "description": "当播放到末尾时触发 ended 事件"
      }
    ]
  },
  {
    "name": "camera",
    "description": {
      "kind": "markdown",
      "value": "系统相机。扫码二维码功能，需升级微信客户端至6.7.3。需要用户授权 scope.camera。 2.10.0起 initdone 事件返回 maxZoom，最大变焦范围，相关接口 CameraContext.setZoom。"
    },
    "attributes": [
      {
        "name": "mode",
        "description": "应用模式，只在初始化时有效，不能动态变更",
        "valueSet": "camera-mode"
      },
      {
        "name": "resolution",
        "description": "分辨率，不支持动态修改",
        "valueSet": "camera-resolution"
      },
      {
        "name": "device-position",
        "description": "摄像头朝向",
        "valueSet": "camera-device-position"
      },
      {
        "name": "flash",
        "description": "闪光灯，值为auto, on, off",
        "valueSet": "camera-flash"
      },
      {
        "name": "frame-size",
        "description": "指定期望的相机帧数据尺寸",
        "valueSet": "camera-frame-size"
      },
      {
        "name": "bindstop",
        "description": "摄像头在非正常终止时触发，如退出后台等情况"
      },
      {
        "name": "binderror",
        "description": "用户不允许使用摄像头时触发"
      },
      {
        "name": "bindinitdone",
        "description": "相机初始化完成时触发，e.detail = {maxZoom}"
      },
      {
        "name": "bindscancode",
        "description": "在扫码识别成功时触发，仅在 mode=\"scanCode\" 时生效"
      }
    ]
  },
  {
    "name": "image",
    "description": {
      "kind": "markdown",
      "value": "图片。支持 JPG、PNG、SVG、WEBP、GIF 等格式，2.3.0 起支持云文件ID。"
    },
    "attributes": [
      {
        "name": "src",
        "description": "图片资源地址"
      },
      {
        "name": "mode",
        "description": "图片裁剪、缩放的模式",
        "valueSet": "image-mode"
      },
      {
        "name": "webp",
        "description": "默认不解析 webP 格式，只支持网络资源",
        "valueSet": "b"
      },
      {
        "name": "lazy-load",
        "description": "图片懒加载，在即将进入一定范围（上下三屏）时才开始加载"
      },
      {
        "name": "show-menu-by-longpress",
        "description": "长按图片显示发送给朋友、收藏、保存图片、搜一搜、打开名片/前往群聊/打开小程序（若图片中包含对应二维码或小程序码）的菜单"
      },
      {
        "name": "binderror",
        "description": "当错误发生时触发，event.detail = {errMsg}"
      },
      {
        "name": "bindload",
        "description": "当图片载入完毕时触发，event.detail = {height, width}"
      }
    ]
  },
  {
    "name": "live-player",
    "description": {
      "kind": "markdown",
      "value": "实时音视频播放（v2.9.1 起支持同层渲染）。"
    },
    "attributes": [
      {
        "name": "src",
        "description": "音视频地址。目前仅支持 flv, rtmp 格式"
      },
      {
        "name": "mode",
        "description": "模式",
        "valueSet": "live-player-mode"
      },
      {
        "name": "autoplay",
        "description": "自动播放"
      },
      {
        "name": "muted",
        "description": "是否静音"
      },
      {
        "name": "orientation",
        "description": "画面方向",
        "valueSet": "live-player-orientation"
      },
      {
        "name": "object-fit",
        "description": "填充模式，可选值有 contain，fillCro",
        "valueSet": "live-player-object-fit"
      },
      {
        "name": "background-mute",
        "description": "进入后台时是否静音（已废弃，默认退后台静音）"
      },
      {
        "name": "min-cache",
        "description": "最小缓冲区，单位s（RTC 模式推荐 0.2s）"
      },
      {
        "name": "max-cache",
        "description": "最大缓冲区，单位s（RTC 模式推荐 0.8s）。缓冲区用来抵抗网络波动，缓冲数据越多，网络抗性越好，但时延越大。"
      },
      {
        "name": "sound-mode",
        "description": "声音输出方式",
        "valueSet": "live-player-sound-mode"
      },
      {
        "name": "auto-pause-if-navigate",
        "description": "当跳转到本小程序的其他页面时，是否自动暂停本页面的实时音视频播放"
      },
      {
        "name": "picture-in-picture-mode",
        "description": "设置小窗模式： push, pop，空字符串或通过数组形式设置多种模式（如： [\"push\", \"pop\"]）",
        "valueSet": "live-player-picture-in-picture-mode"
      },
      {
        "name": "referrer-policy",
        "description": "格式固定为 https://servicewechat.com/{appid}/{version}/page-frame.html，其中 {appid} 为小程序的 appid，{version} 为小程序的版本号，版本号为 0 表示为开发版、体验版以及审核版本，版本号为 devtools 表示为开发者工具，其余为正式版本；",
        "valueSet": "live-player-referrer-policy"
      },
      {
        "name": "bindstatechange",
        "description": "播放状态变化事件，detail = {code}"
      },
      {
        "name": "bindfullscreenchange",
        "description": "全屏变化事件，detail = {direction, fullScreen}"
      },
      {
        "name": "bindnetstatus",
        "description": "网络状态通知，detail = {info}"
      },
      {
        "name": "bindaudiovolumenotify",
        "description": "播放音量大小通知，detail = {}"
      },
      {
        "name": "bindenterpictureinpicture",
        "description": "播放器进入小窗"
      },
      {
        "name": "bindleavepictureinpicture",
        "description": "播放器退出小窗"
      }
    ]
  },
  {
    "name": "live-pusher",
    "description": "实时音视频录制（v2.9.1 起支持同层渲染）。",
    "attributes": [
      {
        "name": "url",
        "description": "推流地址。目前仅支持 rtmp 格式"
      },
      {
        "name": "mode",
        "description": "SD（标清）, HD（高清）, FHD（超清）, RTC（实时通话）"
      },
      {
        "name": "autopush",
        "description": "自动推流"
      },
      {
        "name": "muted",
        "description": "是否静音。即将废弃，可用 enable-mic 替代"
      },
      {
        "name": "enable-camera",
        "description": "开启摄像头"
      },
      {
        "name": "auto-focus",
        "description": "自动聚集"
      },
      {
        "name": "orientation",
        "description": "画面方向",
        "valueSet": "live-pusher-orientation"
      },
      {
        "name": "beauty",
        "description": "美颜，取值范围 0-9 ，0 表示关闭"
      },
      {
        "name": "whiteness",
        "description": "美白，取值范围 0-9 ，0 表示关闭"
      },
      {
        "name": "aspect",
        "description": "宽高比，可选值有 3:4, 9:16"
      },
      {
        "name": "min-bitrate",
        "description": "最小码率"
      },
      {
        "name": "max-bitrate",
        "description": "最大码率"
      },
      {
        "name": "audio-quality",
        "description": "高音质(48KHz)或低音质(16KHz)，值为high, low"
      },
      {
        "name": "waiting-image",
        "description": "进入后台时推流的等待画面"
      },
      {
        "name": "waiting-image-hash",
        "description": "等待画面资源的MD5值"
      },
      {
        "name": "zoom",
        "description": "调整焦距"
      },
      {
        "name": "device-position",
        "description": "前置或后置，值为front, back"
      },
      {
        "name": "background-mute",
        "description": "进入后台时是否静音（已废弃，默认退后台静音）"
      },
      {
        "name": "mirror",
        "description": "设置推流画面是否镜像，产生的效果在 live-player 反应到"
      },
      {
        "name": "remote-mirror",
        "description": "同 mirror 属性，后续 mirror 将废弃"
      },
      {
        "name": "local-mirror",
        "description": "控制本地预览画面是否镜像",
        "valueSet": "live-pusher-local-mirror"
      },
      {
        "name": "audio-reverb-type",
        "description": "音频混响类型",
        "valueSet": "live-pusher-audio-reverb-type",
      },
      {
        "name": "enable-mic",
        "description": "开启或关闭麦克风"
      },
      {
        "name": "enable-agc",
        "description": "是否开启音频自动增益"
      },
      {
        "name": "enable-ans",
        "description": "是否开启音频噪声抑制"
      },
      {
        "name": "audio-volume-type",
        "description": "音量类型",
        "valueSet": "live-pusher-audio-volume-type"
      },
      {
        "name": "video-width",
        "description": "上推的视频流的分辨率宽度"
      },
      {
        "name": "video-height",
        "description": "上推的视频流的分辨率高度"
      },
      {
        "name": "beauty-style",
        "description": "设置美颜类型",
        "valueSet": "live-pusher-beauty-style"
      },
      {
        "name": "filter",
        "description": "设置色彩滤镜",
        "valueSet": "live-pusher-filter"
      },
      {
        "name": "bindstatechange",
        "description": "状态变化事件，detail = {code}"
      },
      {
        "name": "bindnetstatus",
        "description": "网络状态通知，detail = {info}"
      },
      {
        "name": "binderror",
        "description": "渲染错误事件，detail = {errMsg, errCode}"
      },
      {
        "name": "bindbgmstart",
        "description": "背景音开始播放时触发"
      },
      {
        "name": "bindbgmprogress",
        "description": "背景音进度变化时触发，detail = {progress, duration}"
      },
      {
        "name": "bindbgmcomplete",
        "description": "背景音播放完成时触发"
      },
      {
        "name": "bindaudiovolumenotify",
        "description": "返回麦克风采集的音量大小"
      }

    ]
  },
  {
    "name": "video",
    "description": {
      "kind": "markdown",
      "value": "视频（v2.4.0 起支持同层渲染）。"
    },
    "attributes": [
      {
        "name": "src",
        "description": "要播放视频的资源地址，支持网络路径、本地临时路径、云文件ID（2.3.0）"
      },
      {
        "name": "duration",
        "description": "指定视频时长"
      },
      {
        "name": "controls",
        "description": "是否显示默认播放控件（播放/暂停按钮、播放进度、时间）"
      },
      {
        "name": "danmu-list",
        "description": "弹幕列表"
      },
      {
        "name": "danmu-btn",
        "description": "是否显示弹幕按钮，只在初始化时有效，不能动态变更"
      },
      {
        "name": "enable-danmu",
        "description": "是否展示弹幕，只在初始化时有效，不能动态变更"
      },
      {
        "name": "autoplay",
        "description": "是否自动播放"
      },
      {
        "name": "loop",
        "description": "是否循环播放"
      },
      {
        "name": "muted",
        "description": "是否静音播放"
      },
      {
        "name": "initial-time",
        "description": "指定视频初始播放位置"
      },
      {
        "name": "page-gesture",
        "description": "在非全屏模式下，是否开启亮度与音量调节手势（废弃，见 vslide-gesture）"
      },
      {
        "name": "direction",
        "description": "设置全屏时视频的方向，不指定则根据宽高比自动判断",
        "valueSet": "video-direction"
      },
      {
        "name": "show-progress",
        "description": "若不设置，宽度大于240时才会显示"
      },
      {
        "name": "show-fullscreen-btn",
        "description": "是否显示全屏按钮"
      },
      {
        "name": "show-play-btn",
        "description": "是否显示视频底部控制栏的播放按钮"
      },
      {
        "name": "show-center-play-btn",
        "description": "是否显示视频中间的播放按钮"
      },
      {
        "name": "enable-progress-gesture",
        "description": "是否开启控制进度的手势"
      },
      {
        "name": "object-fit",
        "description": "当视频大小与 video 容器大小不一致时，视频的表现形式",
        "valueSet": "video-object-fit"
      },
      {
        "name": "poster",
        "description": "视频封面的图片网络资源地址或云文件ID（2.3.0）。若 controls 属性值为 false 则设置 poster 无效"
      },
      {
        "name": "show-mute-btn",
        "description": "是否显示静音按钮"
      },
      {
        "name": "title",
        "description": "视频的标题，全屏时在顶部展示"
      },
      {
        "name": "play-btn-position",
        "description": "播放按钮的位置",
        "valueSet": "video-play-btn-position"
      },
      {
        "name": "enable-play-gesture",
        "description": "是否开启播放手势，即双击切换播放/暂停"
      },
      {
        "name": "auto-pause-if-navigate",
        "description": "当跳转到本小程序的其他页面时，是否自动暂停本页面的视频播放"
      },
      {
        "name": "auto-pause-if-open-native",
        "description": "当跳转到其它微信原生页面时，是否自动暂停本页面的视频"
      },
      {
        "name": "vslide-gesture",
        "description": "在非全屏模式下，是否开启亮度与音量调节手势（同 page-gesture）"
      },
      {
        "name": "vslide-gesture-in-fullscreen",
        "description": "在全屏模式下，是否开启亮度与音量调节手势"
      },
      {
        "name": "ad-unit-id",
        "description": "视频前贴广告单元ID，更多详情可参考开放能力视频前贴广告"
      },
      {
        "name": "poster-for-crawler",
        "description": "用于给搜索等场景作为视频封面展示，建议使用无播放 icon 的视频封面图，只支持网络地址"
      },
      {
        "name": "show-casting-button",
        "description": "显示投屏按钮。安卓在同层渲染下生效，支持 DLNA 协议；iOS 支持 AirPlay 和 DLNA 协议"
      },
      {
        "name": "picture-in-picture-mode",
        "description": "设置小窗模式： push, pop，空字符串或通过数组形式设置多种模式（如： [\"push\", \"pop\"]）",
        "valueSet": "video-picture-in-picture-mode"
      },
      {
        "name": "enable-auto-rotation",
        "description": "是否开启手机横屏时自动全屏，当系统设置开启自动旋转时生效"
      },
      {
        "name": "show-screen-lock-button",
        "description": "是否显示锁屏按钮，仅在全屏时显示，锁屏后控制栏的操作"
      },
      {
        "name": "show-snapshot-button",
        "description": "是否显示截屏按钮，仅在全屏时显示"
      },
      {
        "name": "show-background-playback-button",
        "description": "是否展示后台音频播放按钮"
      },
      {
        "name": "background-poster",
        "description": "进入后台音频播放后的通知栏图标（Android 独有）"
      },
      {
        "name": "referrer-policy",
        "description": "格式固定为 https://servicewechat.com/{appid}/{version}/page-frame.html，其中 {appid} 为小程序的 appid，{version} 为小程序的版本号，版本号为 0 表示为开发版、体验版以及审核版本，版本号为 devtools 表示为开发者工具，其余为正式版本；",
        "valueSet": "video-referrer-policy"
      },
      {
        "name": "is-drm",
        "description": "是否是 DRM 视频源"
      },
      {
        "name": "provision-url",
        "description": "DRM 设备身份认证 url，仅 is-drm 为 true 时生效 (Android)"
      },
      {
        "name": "certificate-url",
        "description": "DRM 设备身份认证 url，仅 is-drm 为 true 时生效 (iOS)"
      },
      {
        "name": "license-url",
        "description": "DRM 获取加密信息 url，仅 is-drm 为 true 时生效"
      },
      {
        "name": "bindplay",
        "description": "当开始/继续播放时触发play事件"
      },
      {
        "name": "bindpause",
        "description": "当暂停播放时触发 pause 事件"
      },
      {
        "name": "bindended",
        "description": "当播放到末尾时触发 ended 事件"
      },
      {
        "name": "bindtimeupdate",
        "description": "播放进度变化时触发，event.detail = {currentTime, duration} 。触发频率 250ms 一次"
      },
      {
        "name": "bindfullscreenchange",
        "description": "视频进入和退出全屏时触发，event.detail = {fullScreen, direction}，direction 有效值为 vertical 或 horizontal"
      },
      {
        "name": "bindwaiting",
        "description": "视频出现缓冲时触发"
      },
      {
        "name": "binderror",
        "description": "视频播放出错时触发"
      },
      {
        "name": "bindprogress",
        "description": "加载进度变化时触发，只支持一段加载。event.detail = {buffered}，百分比"
      },
      {
        "name": "bindloadedmetadata",
        "description": "视频元数据加载完成时触发。event.detail = {width, height, duration}"
      },
      {
        "name": "bindcontrolstoggle",
        "description": "切换 controls 显示隐藏时触发。event.detail = {show}"
      },
      {
        "name": "bindenterpictureinpicture",
        "description": "播放器进入小窗"
      },
      {
        "name": "bindleavepictureinpicture",
        "description": "播放器退出小窗"
      },
      {
        "name": "bindseekcomplete",
        "description": "seek 完成时触发 (position iOS 单位 s, Android 单位 ms)"
      }
    ]
  },
  {
    "name": "voip-room",
    "description": {
      "kind": "markdown",
      "value": "多人音视频对话。需用户授权 scope.camera、scope.record。相关接口： wx.joinVoIPChat"
    },
    "attributes": [
      {
        "name": "openid",
        "description": "进入房间用户的 openid"
      },
      {
        "name": "mode",
        "description": "对话窗口类型，自身传入 camera，其它用户传入 video"
      },
      {
        "name": "device-position",
        "description": "仅在 mode 为 camera 时有效，前置或后置，值为front, back"
      },
      {
        "name": "binderror",
        "description": "创建对话窗口失败时触发"
      }
    ]
  }
]