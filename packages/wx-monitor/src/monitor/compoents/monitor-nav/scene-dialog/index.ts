// @ts-ignore
import Style from './index.scss';
import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import scenes from '../../common/scene.config';

@customElement('scene-dialog')
class SceneDialog extends LitElement {
  static get styles() {
    return [unsafeCSS(Style)];
  }

  @property()
  dialogShow = false;

  render() {
    let styles = { display: this.dialogShow ? 'block' : 'none' };
    return html`
      <div class="ui-mask" style=${styleMap(styles)}>
        <div class="scene">
          <div class="scene-hd">
            <div class="scene-hd-icon">
              <i class="magnifier"></i>
            </div>
            <div class="scene-hd-input-box">
              <input
                type="text"
                placeholder="查找场景值"
                class="input"
                v-model="searchValue"
              />
            </div>
          </div>

          <div class="scene-bd">
            ${Object.keys(scenes).map(
              (key) => html`
                <div
                  class="scene-bd-item"
                  @click=${() => this.closeDialog(key)}
                >
                  <p class="name" title="${key + ': ' + scenes[key]}">
                    ${key + ':' + scenes[key]}
                  </p>
                </div>
              `
            )}
          </div>
        </div>
      </div>
    `;
  }

  closeDialog(scene) {
    console.log('scene', scene);
    this.dialogShow = false;
  }
}
