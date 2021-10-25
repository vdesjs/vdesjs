// @ts-ignore
import Style from './index.scss';
import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('monitor-top-bar')
class MonitorTopBar extends LitElement {
  static get styles() {
    return [unsafeCSS(Style)];
  }

  @property()
  title = 'WeChat';

  @state()
  protected _time;

  constructor() {
    super();

    this._time = this.getTime();
    setInterval(() => {
      this._time = this.getTime();
    }, 1000);
  }

  getTime(): string {
    const date = new Date();
    const time =
      date.getHours().toString().padStart(2, '0') +
      ':' +
      date.getMinutes().toString().padStart(2, '0');
    return time;
  }

  render() {
    return html`<div class="topbar">
      <div>
        <span>
          <i class="point"></i>
        </span>
        <span style="margin: 0px 2px">${this.title}</span>
        <span>
          <i class="wifi"></i>
        </span>
      </div>
      <div class="time"> ${this._time} </div>
      <div class="electricity">
        <span class="text">100%</span>
        <span>
          <div class="icon">
            <div class="right"></div>
            <div class="center"></div>
          </div>
        </span>
      </div>
    </div>`;
  }
}
