import { parseWxml } from '../../../src/compile/wxml/wxmlParse';
import { h } from '../../../src/compile/wxml/h';

describe('parse', () => {
  const testWxml = `
  <view>
    <button class="{{fff}}" bindtap="aaa">{{aaa}}</button>

    <checkbox-group> </checkbox-group>
  </view>
`;

  test('parse', () => {
    // HTMLParser("ff")
    console.log(parseWxml(testWxml, 'render'));
  });
});
