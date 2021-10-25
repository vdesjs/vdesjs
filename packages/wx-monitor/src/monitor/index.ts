import { Page } from '@/compile';
import KBoneUI from '@vdesjs/kbone-ui';
import { h } from '../compile/wxml/h';
import { store } from '../compile/store';
import "./compoents/index";
import "./message"

KBoneUI.register({
  components: 'all', // 默认为全组件均可使用
  // components: ['wx-input', 'mp-dialog'], // 可声明要使用哪些组件
  mode: 'open', // Web components 的模式，默认为 open，不建议改动
  style: {
    // 需要注入到 Web components 组件里的样式，默认为空
    'wx-input': `.green {color: green;}`, // 注入给 placeholder-class 使用
    'wx-textarea': `.green {color: green;}`, // 注入给 placeholder-class 使用
    'mp-badge': `.blue {background: blue;}` // 注入给 ext-class 使用
  }
});


// @ts-ignore
window.h = h;
// @ts-ignore
window.Page = Page
// @ts-ignore
window.store = store
