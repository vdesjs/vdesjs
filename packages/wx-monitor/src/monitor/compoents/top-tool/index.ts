// @ts-ignore
import Style from './index.scss';
import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('top-tool')
class TopTool extends LitElement {
  static get styles() {
    return [unsafeCSS(Style)];
  }

  render() {
    return html`<div class="top-tool">
      <div class="ordered-left">
        <div class="deviceList">
          <div class="select">
            <div class="render">iphone6</div>
            <span class="arrow">
              <i class="arrow-down">
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  class=""
                  data-icon="down"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"
                  ></path>
                </svg>
              </i>
            </span>
          </div>

          <div class="dropdown"> </div>
        </div>
      </div>
    </div>`;
  }
}
