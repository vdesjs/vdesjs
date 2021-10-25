// @ts-ignore
import Style from './index.scss';
import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import './share-dialog';
import './scene-dialog';

@customElement('monitor-nav')
class MonitorNav extends LitElement {
  static get styles() {
    return [unsafeCSS(Style)];
  }

  @property()
  title: string = 'Wechat';

  @property()
  loading = false;

  @state()
  dialogShare = 'false';

  render() {
    return html`
      <div class="nav" v-if="mobileGlobal.title">
        <div class="back" @click="onBack">
          <i class="icon"></i>
        </div>
        <div class="title">
          <h3 class="text">
            ${this.loading ? html` <i class="loading"></i> ` : ''} ${this.title}
          </h3>
        </div>
        <div class="function">
          <div class="wrap">
            <div class="share" @click="${this.shareShow}">
              <i class="icon"></i>
            </div>
            <span class="split"></span>
            <div class="quit" @click="${this.sceneShow}">
              <i class="icon"></i>
            </div>
          </div>
        </div>
      </div>
      <share-dialog></share-dialog>
      <scene-dialog></scene-dialog>
    `;
  }

  shareShow() {
    this.shadowRoot
      .querySelector('share-dialog')
      .setAttribute('dialogShow', 'true');
  }

  sceneShow() {
    this.shadowRoot
      .querySelector('scene-dialog')
      .setAttribute('dialogShow', 'true');
  }
}
