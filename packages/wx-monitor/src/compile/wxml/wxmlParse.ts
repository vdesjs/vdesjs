import {html2json} from "./parser/html2json"
import { tagMapping } from './tag-mapping';
let reURL = /^(https?):\/\/.+$/;



interface NodeType {
  node?: 'element' | 'root' | 'text';
  text?: string;
  tag?: string;
  attr?: object;
  child: NodeType[];
}

export function parseWxml(wxml: string, fnName: string) {
  return walk(html2json(minifier(wxml)), fnName);
}

function minifier(wxml: string) {
  return wxml
    .replace(/>\s+|\s+</g, (m) => {
      return m.trim();
    })
    .replace(/<!--[\s\S]*?-->/g, '');
}

function checkIsArray(json) {
  let count = 0;
  if (!json.child) return false;
  for (let i = 0, len = json.child.length; i < len; i++) {
    let tagItem = json.child[i];
    let tagName = tagItem.tag;

    if (tagName) {
      count++;
    }
    if (count > 1) {
      return true;
    }
  }

  return false;
}

function walk(node, fnName) {
  return `function ${fnName}() {
    return ${_walk(node)}

  }`;
}

function _walk(node: NodeType, currentIndex?: number, children?: object) {
  let c = '';
  let isArray = checkIsArray(node);
  let result = '';

  if (node.node == 'text') {
    let text = node.text
    if (text != '') {
      return `\`${bracesText(text)}\``;
    }
  } else if (node.child) {
    node.child.forEach((childNode, index, arr) => {
      c += _walk(childNode, index, arr);
      if (childNode.node !== 'text') {
        let next = arr[index + 1];
        if (
          !(
            next &&
            next.attr &&
            (next.attr['wx:elif'] || next.attr.hasOwnProperty('wx:else'))
          )
        ) {
          c += ',';
        }
      } else {
        c += ',';
      }
    });

    if (c.endsWith(',')) {
      c = c.substr(0, c.length - 1);
    }
  }

  if (node.node === 'root') {
    return c;
  }

  if (node.attr) {
    let ifCond = '';
    let isThree = false;

    let ifAttr = node.attr['wx:if'] || node.attr['wx:elif'];
    if (ifAttr) {
      let cond = ifAttr;
      let next = children[currentIndex + 1];

      if (
        next &&
        next.attr &&
        (next.attr['wx:elif'] || next.attr.hasOwnProperty('wx:else'))
      ) {
        // 从{{var}}提取出var
        ifCond = cond.substr(2, cond.length - 4) + '?';
        isThree = true;
      } else {
        ifCond = cond.substr(2, cond.length - 4) + '&&';
      }
      delete node.attr['wx:if'];
      delete node.attr['wx:elif'];
    }

    if (node.attr.hasOwnProperty('wx:else')) {
      delete node.attr['wx:else'];
    }

    let forAttr = node.attr['wx:for'];
    if (forAttr) {
      let str = forAttr;
      str = str.substr(2, str.length - 4);
      let index = node.attr['wx:for-index'] || 'index';
      let item = node.attr['wx:for-item'] || 'item';

      let current = `${str}.map((${item},${index})=>{
        return h('${tagMapping(node.tag)}',${stringify(
        node.attr,
        tagMapping(node.tag)
      )},
          ${c}
        )
        })`;
      delete node.attr['wx:for'];
      delete node.attr['wx:for-items'];
      delete node.attr['wx:for-index'];
      delete node.attr['wx:for-item'];

      result = `${ifCond} ${current}`;
    } else if (node.tag == 'block') {
      result = isArray ? `${ifCond} [${c}]` : `${ifCond} ${c}`;
    } else {
      result = `${ifCond}h('${tagMapping(node.tag)}',${stringify(
        node.attr,
        tagMapping(node.tag)
      )},[${c}])`;
    }

    if (isThree) {
      result += ':';
    }
  } else {
    result = `h('${tagMapping(node.tag)}',${stringify(
      node.attr,
      tagMapping(node.tag)
    )},[${c}])`;
  }

  return result;
}

function stringify(attr: object, tag: string) {
  if (attr) {
    let result = '{';
    let keys = Object.keys(attr);
    let maxIndex = keys.length - 1;
    let isImg = tag === 'img';
    keys.forEach((key, index) => {
      if (key.indexOf(':') == -1) {
        let v = attr[key];
        let isBind = false;
        if (key.indexOf('bind') === 0) {
          // key = key.replace('bind', 'on');
          isBind = true;
        }
        if (key.indexOf('on') === 0) {
          isBind = true;
        }
        let str = v.join ? joinNestArray(v) : v;

        if (str.indexOf('{{') === 0) {
          if (Array.isArray(v)) {
            attr[key] = '';
            v.forEach((item) => {
              if (item.includes('{{')) {
                attr[key] += '${' + braces(item) + '} ';
                return;
              }
              attr[key] += item;
            });
            attr[key] = '`' + attr[key] + '`';
          } else {
            attr[key] = braces(str);
          }

          result +=
            "'" + key + "': " + attr[key] + (maxIndex === index ? '' : ',');
        } else {
          attr[key] = bracesText(str);
          if (isImg && key === 'src') {
            result +=
              `'src': ${fixImgSrc(v)}` + (maxIndex === index ? '' : ',');
          } else if (isBind) {
            if (attr[key] !== '') {
              result +=
                "'" +
                key +
                "': store.page." +
                attr[key] +
                (maxIndex === index ? '' : ',');
            }
          } else {
            result +=
              "'" +
              key +
              "': `" +
              attr[key] +
              (maxIndex === index ? '`' : '`,');
          }
        }
      }
    });
    return (result += '}');
  }
  return null;
}

function joinNestArray(arr) {
  let str = '';
  arr.forEach((item) => {
    if (typeof item === 'string') {
      str += item + ' ';
    } else if (item.join) {
      str += joinNestArray(item);
    }
  });

  return str;
}

function fixImgSrc(src) {
  if (reURL.test(src)) {
    return src;
  } else {
    return `require('${src}')`;
  }
}

function braces(str) {
  return str.replace(/{{([\S\s]*?)}}/g, (a, b) => {
    return varPrefix(b);
  });
}

function bracesText(str) {
  return str.replace(/{{([\S\s]*?)}}/g, (a, b) => {
    return '${' + varPrefix(b) + '}';
  });
}

function varPrefix(str: string) {
  return "store.page.data." + str;
}

