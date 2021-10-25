// export interface Hattribute {
//   className?: string;
//   attrs?: object;
//   on?: object;
// }

export function h(
  tag: string,
  obj?: object,
  children?: (string | HTMLElement)[]
): HTMLElement {
  const ele = document.createElement(tag);

  // if (obj.className != null) {
  //   ele.className = obj.className;
  // }

  // if (obj.attrs != null) {
  //   Object.keys(obj.attrs).forEach((attr) => {
  //     ele.setAttribute(attr, obj.attrs[attr]);
  //   });
  // }

  // if (obj.on != null) {
  //   Object.keys(obj.on).forEach((eventKey) => {
  //     ele.addEventListener(eventKey, obj.on[eventKey]);
  //   });
  // }

  if (obj != null) {
    Object.keys(obj).forEach((key) => {
      if (key == 'class') {
        ele.className = obj[key];
      } else if (key.indexOf('bind') == 0) {
        const eventName = key.substr(4);
        console.log("eventName", eventName)
        ele.addEventListener(eventName, obj[key]);
      } else {
        ele.setAttribute(key, obj[key]);
      }
    });
  }

  ele.append(...children);

  return ele;
}
