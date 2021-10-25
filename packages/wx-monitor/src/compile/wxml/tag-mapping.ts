let map = {
  view: 'wx-view',

  animation: 'wx-animation',
  button: 'wx-button',
  canvas: 'wx-canvas',
  capture: 'wx-capture',
  catch: 'wx-catch',
  checkbox: 'wx-checkbox',
  checkboxGroup: 'wx-checkbox-group'
};

export function tagMapping(key: string) {
  key = camelize(key)
  if (map[key]) {
    return map[key];
  }
  return key;
}


const camelizeRE = /-(\w)/g;
function camelize(str: string): string {
  return str.replace(camelizeRE, (_, c) => c.toUpperCase());
}
