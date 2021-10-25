// @ts-ignore
import Style from './index.scss';
import { LitElement, html, css, unsafeCSS} from 'lit';
import { customElement, property, state} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';

@customElement('share-dialog')
class ShareDialog extends LitElement {
  static get styles() {
    return [unsafeCSS(Style)];
  }

  @property()
  dialogShow = false;

  render() {
    let styles = {display: this.dialogShow ? 'block' : 'none'}
    return html`
      <div class="shareDialog" style=${styleMap(styles)}>
        <div class="mask" @click="${this.hideDialog}"></div>
        <div class="more-show">
          <div class="body">
            <div class="title">
              wx333接口测试号
              <i class="more"></i>
            </div>
            <div class="scroll">
              <div class="item">
                <div class="icon-background">
                  <i class="icon share"></i>
                </div>
                <div class="text">发送给朋友</div>
              </div>
              <div class="item">
                <div class="icon-background">
                  <i class="icon fans-disabled"></i>
                </div>
                <div class="text">当前页面未设置分享</div>
              </div>
              <div class="item">
                <div class="icon-background">
                  <i class="icon favorite"></i>
                </div>
                <div class="text">收藏</div>
              </div>
            </div>
            <div class="scroll">
              <div class="item">
                <div class="icon-background">
                  <i class="icon seeting"></i>
                </div>
                <div class="text">设置</div>
              </div>
              <div class="item">
                <div class="icon-background">
                  <i class="icon reload"></i>
                </div>
                <div class="text">重新进入小程序</div>
              </div>
              <div class="item">
                <div class="icon-background">
                  <i class="icon link"></i>
                </div>
                <div class="text">复制短链</div>
              </div>
            </div>
          </div>
          <div class="foot">
            <div class="btn" @click="${this.hideDialog}">取消</div>
          </div>
        </div>
      </div>
    `;
  }

  hideDialog() {
    this.dialogShow = false
  }
}
