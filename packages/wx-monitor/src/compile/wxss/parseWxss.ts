import postcss from 'postcss-browser8';
import { rpx2px } from './plugins/rpx2px';

export function parseWxss(wxss: string) {
  const result = postcss([rpx2px()]).process(wxss);

  return result;
}
