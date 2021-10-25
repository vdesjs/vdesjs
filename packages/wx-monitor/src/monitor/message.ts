import { PageRouterData } from "@/compile";
import { store } from "../compile/store";
import { parseWxml } from '../compile/wxml/wxmlParse';
import { parseWxss } from '../compile/wxss/parseWxss';


window.addEventListener('message', async (event) => {
  const message = event.data;
  if (message.command == 'updateWxml') {
    console.log('updateWxml', message.data.page);

    const wxmlText = message.data.text;
    let hfunc = parseWxml(wxmlText, 'render');
    hfunc = hfunc + '\n render()'

    store.globalRouter.routers[message.data.page].wxml = {
      hfunc
    };

    refreshWxml(message.data.page);
  }

  if (message.command == 'updateWxss') {
    console.log('updateWxss', message.data.page);

    const res = await parseWxss(message.data.text)

    store.globalRouter.routers[message.data.page].wxss = {
      cssText: res.css
    };
    refreshStyle(message.data.page);


  }

  if (message.command == 'updateJs') {
    console.log('updateJs', message.data.page);
    store.globalRouter.routers[message.data.page].js = {
      jsText: message.data.text
    };

    refreshJs(message.data.page);
    refreshWxml(message.data.page);
  }

  // if (message.command == 'refresh') {
  //   console.log('refresh');
  // }

  if (message.command == 'updateRouter') {
    console.log('updateRouter', message.data.key, message.data.val);

    let hfunc = parseWxml(message.data.val.wxml.text, 'render');
    hfunc = hfunc + '\n render()'
    console.log("hfunc", hfunc)

    const res = await parseWxss(message.data.val.wxss.text)
    const cssText = res.css

    const jsText = message.data.val.js.text

    const pageData: PageRouterData = {
      path: message.data.key,
      wxml: {
        hfunc
      },
      wxss: {
        cssText
      },
      js: {
        jsText
      }

    }

    updateRouter(message.data.key, pageData);

    console.log(store.globalRouter);
  }
});

function updateRouter(key: string, val: PageRouterData) {
  store.globalRouter.routers[key] = val;

  // pages中的第一个元素作为首页
  if (store.globalRouter.stack.length == 0) {
    store.globalRouter.stack.push(store.globalRouter.routers[key].path);
    refresh(key);
  }else if (getStackTopPage().path == key) {
    refresh(key);
  }
}

function refresh(page: string) {
  refreshJs(page);
  refreshWxml(page);
  refreshStyle(page);
}

function refreshJs(page: string) {
  const topPage = getStackTopPage()
  if (topPage.path == page) {
    console.log("run js", page)
    eval(topPage.js.jsText);
  }
}

function refreshWxml(page: string) {
  const topPage = getStackTopPage()
  if (topPage.path == page) {
    const contentEle = document.querySelector('#content');
    // 清空界面
    contentEle.innerHTML = '';
    console.log("run wxml", page)
    contentEle.append(eval(topPage.wxml.hfunc));
  }
}

function refreshStyle(page: string) {
  const topPage = getStackTopPage()

  if (topPage.path == page) {
    let style: any = document.querySelector('#wxss');
    if (style == null) {
      style = document.createElement('style');
      style.id = 'wxss';
      style.type = 'text/css';
      const head = document.head || document.getElementsByTagName('head')[0];
      head.appendChild(style);
    }

    if (style.styleSheet) {
      // This is required for IE8 and below.
      style.styleSheet.cssText = topPage.wxss.cssText;
    } else {
      style.innerHTML = '';
      style.appendChild(document.createTextNode(topPage.wxss.cssText));
    }
  }
}


function getStackTopPage() {
  const topPage = store.globalRouter.stack[store.globalRouter.stack.length - 1];
  const router = store.globalRouter.routers[topPage];

  return router;

}