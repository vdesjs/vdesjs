import { ITagData } from "../../../wxmlLanguageTypes";

// 视图容器 源数据：https://developers.weixin.qq.com/miniprogram/dev/component/cover-image.html
export const viewContainerTags: ITagData[] = [
  {
    "name": "cover-image",
    "description": {
      "kind": "markdown",
      "value": "覆盖在原生组件之上的图片视图。"
    },
    "attributes": [
      {
        "name": "src",
        "description": "图标路径，支持临时路径、网络地址（1.6.0起支持）、云文件ID"
      },
      {
        "name": "referrer-policy",
        "description": "格式固定为 https://servicewechat.com/{appid}/{version}/page-frame.html，其中 {appid} 为小程序的 appid，{version} 为小程序的版本号，版本号为 0 表示为开发版、体验版以及审核版本，版本号为 devtools 表示为开发者工具，其余为正式版本；",
        "valueSet": "referrer-policy"
      },
      {
        "name": "bindload",
        "description": "图片加载成功时触发"
      },
      {
        "name": "binderror",
        "description": "图片加载失败时触发"
      }
    ],

  },
  {
    "name": "cover-view",
    "description": {
      "kind": "markdown",
      "value": "覆盖在原生组件之上的文本视图。"
    },
    "attributes": [
      {
        "name": "scroll-top",
        "description": "设置顶部滚动偏移量，仅在设置了 overflow-y: scroll 成为滚动元素后生效"
      },
    ]
  },
  {
    "name": "match-media",
    "description": {
      "kind": "markdown",
      "value": "media query 匹配检测节点。可以指定一组 media query 规则，满足时，这个节点才会被展示。"
    },
    "attributes": [
      {
        "name": "min-width",
        "description": "页面最小宽度（ px 为单位）"
      },
      {
        "name": "max-width",
        "description": "页面最大宽度（ px 为单位）"
      },
      {
        "name": "width",
        "description": "页面宽度（ px 为单位）"
      },
      {
        "name": "min-height",
        "description": "页面最小高度（ px 为单位）"
      },
      {
        "name": "max-height",
        "description": "页面最大高度（ px 为单位）"
      },
      {
        "name": "height",
        "description": "页面高度（ px 为单位）"
      },
      {
        "name": "orientation",
        "description": "屏幕方向（ landscape 或 portrait ）"
      }
    ]
  },
  {
    "name": "movable-area",
    "description": {
      "kind": "markdown",
      "value": "movable-view的可移动区域。"
    },
    "attributes": [
      {
        "name": "scale-area",
        "description": "当里面的movable-view设置为支持双指缩放时，设置此值可将缩放手势生效区域修改为整个movable-area"
      },
    ]
  },
  {
    "name": "movable-view",
    "description": {
      "kind": "markdown",
      "value": "可移动的视图容器，在页面中可以拖拽滑动。movable-view必须在 movable-area 组件中，并且必须是直接子节点，否则不能移动。"
    },
    "attributes": [
      {
        "name": "direction",
        "description": "movable-view的移动方向，属性值有all、vertical、horizontal、none"
      },
      {
        "name": "inertia",
        "description": "movable-view是否带有惯性"
      },
      {
        "name": "out-of-bounds",
        "description": "超过可移动区域后，movable-view是否还可以移动"
      },
      {
        "name": "x",
        "description": "定义x轴方向的偏移，如果x的值不在可移动范围内，会自动移动到可移动范围；改变x的值会触发动画；单位支持px（默认）、rpx；"
      },
      {
        "name": "y",
        "description": "定义y轴方向的偏移，如果y的值不在可移动范围内，会自动移动到可移动范围；改变y的值会触发动画；单位支持px（默认）、rpx；"
      },
      {
        "name": "damping",
        "description": "阻尼系数，用于控制x或y改变时的动画和过界回弹的动画，值越大移动越快"
      },
      {
        "name": "friction",
        "description": "摩擦系数，用于控制惯性滑动的动画，值越大摩擦力越大，滑动越快停止；必须大于0，否则会被设置成默认值"
      },
      {
        "name": "disabled",
        "description": "是否禁用"
      },
      {
        "name": "scale",
        "description": "是否支持双指缩放，默认缩放手势生效区域是在movable-view内"
      },
      {
        "name": "scale-min",
        "description": "定义缩放倍数最小值",
      },
      {
        "name": "scale-max",
        "description": "定义缩放倍数最大值"
      },
      {
        "name": "scale-value",
        "description": "定义缩放倍数，取值范围为 0.5 - 10"
      },
      {
        "name": "animation",
        "description": "是否使用动画"
      },
      {
        "name": "bindchange",
        "description": "拖动过程中触发的事件，event.detail = {x, y, source}"
      },
      {
        "name": "bindscale",
        "description": "缩放过程中触发的事件，event.detail = {x, y, scale}，x和y字段在2.1.0之后支持"
      },
      {
        "name": "htouchmove",
        "description": "初次手指触摸后移动为横向的移动时触发，如果catch此事件，则意味着touchmove事件也被catch"
      },
      {
        "name": "vtouchmove",
        "description": "初次手指触摸后移动为纵向的移动时触发，如果catch此事件，则意味着touchmove事件也被catch"
      }
    ]
  },
  {
    "name": "page-container",
    "description": {
      "kind": "markdown",
      "value": "页面容器。"
    },
    "attributes": [
      {
        "name": "show",
        "description": "是否显示容器组件"
      },
      {
        "name": "duration",
        "description": "动画时长，单位毫秒"
      },
      {
        "name": "z-index",
        "description": "z-index 层级"
      },
      {
        "name": "overlay",
        "description": "是否显示遮罩层"
      },
      {
        "name": "position",
        "description": "弹出位置，可选值为 top bottom right center"
      },
      {
        "name": "round",
        "description": "是否显示圆角"
      },
      {
        "name": "close-on-slideDown",
        "description": "是否在下滑一段距离后关闭"
      },
      {
        "name": "overlay-style",
        "description": "自定义遮罩层样式"
      },
      {
        "name": "custom-style",
        "description": "自定义弹出层样式"
      },
      {
        "name": "bind:beforeenter",
        "description": "进入前触发"
      },
      {
        "name": "bind:enter",
        "description": "进入中触发"
      },
      {
        "name": "bind:afterenter",
        "description": "进入后触发"
      },
      {
        "name": "bind:beforeleave",
        "description": "离开前触发"
      },
      {
        "name": "bind:leave",
        "description": "离开中触发"
      },
      {
        "name": "bind:afterleave",
        "description": "离开后触发"
      },
      {
        "name": "bind:clickoverlay",
        "description": "点击遮罩层时触发"
      }
    ],
  },
  {
    "name": "scroll-view",
    "description": {
      "kind": "markdown",
      "value": "可滚动视图区域。"
    },
    "attributes": [
      {
        "name": "scroll-x",
        "description": "允许横向滚动"
      },
      {
        "name": "scroll-y",
        "description": "允许纵向滚动"
      },
      {
        "name": "upper-threshold",
        "description": "距顶部/左边多远时，触发 scrolltoupper 事件"
      },
      {
        "name": "lower-threshold",
        "description": "距底部/右边多远时，触发 scrolltolower 事件"
      },
      {
        "name": "scroll-top",
        "description": "设置竖向滚动条位置"
      },
      {
        "name": "scroll-left",
        "description": "设置横向滚动条位置"
      },
      {
        "name": "scroll-into-view",
        "description": "值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素"
      },
      {
        "name": "scroll-with-animation",
        "description": "在设置滚动条位置时使用动画过渡"
      },
      {
        "name": "enable-back-to-top",
        "description": "iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向"
      },
      {
        "name": "enable-flex",
        "description": "启用 flexbox 布局。开启后，当前节点声明了 display: flex 就会成为 flex container，并作用于其孩子节点。"
      },
      {
        "name": "scroll-anchoring",
        "description": "开启 scroll anchoring 特性，即控制滚动位置不随内容变化而抖动，仅在 iOS 下生效，安卓下可参考 CSS overflow-anchor 属性。"
      },
      {
        "name": "refresher-enabled",
        "description": "开启自定义下拉刷新"
      },
      {
        "name": "refresher-threshold",
        "description": "设置自定义下拉刷新阈值"
      },
      {
        "name": "refresher-default-style",
        "description": "设置自定义下拉刷新默认样式，支持设置 black | white | none， none 表示不使用默认样式"
      },
      {
        "name": "refresher-background",
        "description": "设置自定义下拉刷新区域背景颜色"
      },
      {
        "name": "refresher-triggered",
        "description": "设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发"
      },
      {
        "name": "enhanced",
        "description": "启用 scroll-view 增强特性，启用后可通过 ScrollViewContext 操作 scroll-view"
      },
      {
        "name": "bounces",
        "description": "iOS 下 scroll-view 边界弹性控制 (同时开启 enhanced 属性后生效)"
      },
      {
        "name": "show-scrollbar",
        "description": "滚动条显隐控制 (同时开启 enhanced 属性后生效)"
      },
      {
        "name": "paging-enabled",
        "description": "分页滑动效果 (同时开启 enhanced 属性后生效)"
      },
      {
        "name": "fast-deceleration",
        "description": "滑动减速速率控制 (同时开启 enhanced 属性后生效)"
      },
      {
        "name": "binddragstart",
        "description": "滑动开始事件 (同时开启 enhanced 属性后生效) detail { scrollTop, scrollLeft }"
      },
      {
        "name": "binddragging",
        "description": "滑动事件 (同时开启 enhanced 属性后生效) detail { scrollTop, scrollLeft }"
      },
      {
        "name": "binddragend",
        "description": "滑动结束事件 (同时开启 enhanced 属性后生效) detail { scrollTop, scrollLeft, velocity }"
      },
      {
        "name": "bindscrolltoupper",
        "description": "滚动到顶部/左边时触发"
      },
      {
        "name": "bindscrolltolower",
        "description": "滚动到底部/右边时触发"
      },
      {
        "name": "bindscroll",
        "description": "滚动时触发，event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}"
      },
      {
        "name": "bindrefresherpulling",
        "description": "自定义下拉刷新控件被下拉"
      },
      {
        "name": "bindrefresherrefresh",
        "description": "自定义下拉刷新被触发"
      },
      {
        "name": "bindrefresherrestore",
        "description": "自定义下拉刷新被复位"
      },
      {
        "name": "bindrefresherabort",
        "description": "自定义下拉刷新被中止"
      }
    ]

  },
  {
    "name": "share-element",
    "description": {
      "kind": "markdown",
      "value": "共享元素"
    },
    "attributes": [
      {
        "name": "key",
        "description": "映射标记"
      },
      {
        "name": "transform",
        "description": "是否进行动画"
      },
      {
        "name": "duration",
        "description": "动画时长，单位毫秒"
      },
      {
        "name": "easing-function",
        "description": "css缓动函数"
      }
    ]
  },
  {
    "name": "swiper",
    "description": {
      "kind": "markdown",
      "value": "滑块视图容器。其中只可放置swiper-item组件，否则会导致未定义的行为"
    },
    "attributes": [
      {
        "name": "indicator-dots",
        "description": "是否显示面板指示点"
      },
      {
        "name": "indicator-color",
        "description": "指示点颜色"
      },
      {
        "name": "indicator-active-color",
        "description": "当前选中的指示点颜色"
      },
      {
        "name": "autoplay",
        "description": "是否自动切换"
      },
      {
        "name": "current",
        "description": "当前所在滑块的 index"
      },
      {
        "name": "interval",
        "description": "自动切换时间间隔"
      },
      {
        "name": "duration",
        "description": "滑动动画时长"
      },
      {
        "name": "circular",
        "description": "是否采用衔接滑动"
      },
      {
        "name": "vertical",
        "description": "滑动方向是否为纵向"
      },
      {
        "name": "previous-margin",
        "description": "前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值"
      },
      {
        "name": "next-margin",
        "description": "后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值"
      },
      {
        "name": "snap-to-edge",
        "description": "当 swiper-item 的个数大于等于 2，关闭 circular 并且开启 previous-margin 或 next-margin 的时候，可以指定这个边距是否应用到第一个、最后一个元素"
      },
      {
        "name": "display-multiple-items",
        "description": "同时显示的滑块数量"
      },
      {
        "name": "easing-function",
        "description": "指定 swiper 切换缓动动画类型"
      },
      {
        "name": "bindchange",
        "description": "current 改变时会触发 change 事件，event.detail = {current, source}"
      },
      {
        "name": "bindtransition",
        "description": "swiper-item 的位置发生改变时会触发 transition 事件，event.detail = {dx: dx, dy: dy}"
      },
      {
        "name": "bindanimationfinish",
        "description": "动画结束时会触发 animationfinish 事件，event.detail 同上"
      }

    ]
  },
  {
    "name": "swiper-item",
    "description": {
      "kind": "markdown",
      "value": "仅可放置在swiper组件中，宽高自动设置为100%。"
    },
    "attributes": [
      {
        "name": "item-id",
        "description": "该 swiper-item 的标识符"
      },
      {
        "name": "skip-hidden-item-layout",
        "description": "是否跳过未显示的滑块布局，设为 true 可优化复杂情况下的滑动性能，但会丢失隐藏状态滑块的布局信息"
      }
    ]

  },
  {
    "name": "view",
    "description": {
      "kind": "markdown",
      "value": "视图容器",
    },
    "attributes": [
      {
        "name": "hover-class",
        "description": {
          "kind": "markdown",
          "value": '指定按下去的样式类。当 `hover-class="none"` 时，没有点击态效果'
        }
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
      }
    ],
    "references": [
      {
        "name": "微信官方文档",
        "url": "https://developers.weixin.qq.com/miniprogram/dev/component/view.html"
      }
    ]
  },
]