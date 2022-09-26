/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { __decorate } from "tslib";
import { html, css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
/**
 * A tab in a <playground-internal-tab-bar>.
 *
 * Slots:
 * - default: Label or other contents of the tab.
 *
 * Parts:
 * - button: Button with tab role.
 */
let PlaygroundInternalTab = class PlaygroundInternalTab extends LitElement {
    constructor() {
        super(...arguments);
        /**
         * Whether this tab is currently active.
         */
        this.active = false;
        /**
         * The 0-indexed position of this tab within its <playground-internal-tab-bar>.
         *
         * Note this property is managed by the containing <playground-internal-tab-bar> and
         * should not be set directly.
         */
        this.index = 0;
    }
    render() {
        return html `<button
      role="tab"
      part="button"
      aria-selected=${this.active ? 'true' : 'false'}
      tabindex=${this.active ? '0' : '-1'}
    >
      <slot></slot>
    </button>`;
    }
    updated(changes) {
        if (changes.has('active') && this.active) {
            this.dispatchEvent(new CustomEvent('tabchange', {
                detail: { tab: this },
                bubbles: true,
            }));
        }
    }
    focus() {
        this._button.focus();
    }
};
PlaygroundInternalTab.styles = css `
    :host {
      display: flex;
    }

    button {
      flex: 1;
      border: none;
      font-size: inherit;
      font-family: inherit;
      color: inherit;
      background: transparent;
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
      outline: none;
    }

    button::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: currentcolor;
      opacity: 0;
      transition: opacity 150ms;
    }

    button:focus::before,
    button:hover::before {
      opacity: 10%;
    }

    button:active::before {
      opacity: 20%;
    }

    :host([active]) > button::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background: var(
        --playground-tab-bar-indicator-color,
        var(--playground-highlight-color, #6200ee)
      );
    }
  `;
__decorate([
    property({ type: Boolean, reflect: true })
], PlaygroundInternalTab.prototype, "active", void 0);
__decorate([
    query('button')
], PlaygroundInternalTab.prototype, "_button", void 0);
PlaygroundInternalTab = __decorate([
    customElement('playground-internal-tab')
], PlaygroundInternalTab);
export { PlaygroundInternalTab };
