/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { __decorate } from "tslib";
import { html, css, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
// Note despite usual best practices, we should _not_ import
// @material/mwc-list-item directly, because @material/mwc-list already imports
// it, and this causes a duplicate registration error on unpkg.com because of
// redirects.
import '@material/mwc-list';
import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-menu/mwc-menu-surface.js';
import { PlaygroundConnectedElement } from './playground-connected-element.js';
/**
 * Floating controls for creating, deleting, and renaming files in playground
 * virtual file system.
 */
let PlaygroundFileSystemControls = class PlaygroundFileSystemControls extends PlaygroundConnectedElement {
    constructor() {
        super(...arguments);
        /**
         * The kind of control to display:
         *
         * -  closed: Hidden.
         * -    menu: Menu with "Rename" and "Delete" items.
         * -  rename: Control for renaming an existing file.
         * - newfile: Control for creating a new file.
         */
        this.state = 'closed';
        this._postStateChangeRenderDone = false;
    }
    update(changedProperties) {
        if (changedProperties.has('state')) {
            this._postStateChangeRenderDone = false;
        }
        super.update(changedProperties);
    }
    render() {
        return html `<mwc-menu-surface
      fixed
      quick
      .open=${this.state !== 'closed'}
      .anchor=${this.anchorElement}
      corner="BOTTOM_START"
      .classList=${this.state}
      @closed=${this._onSurfaceClosed}
      ><div class="wrapper">${this._surfaceContents}</div></mwc-menu-surface
    >`;
    }
    async updated() {
        if (this._postStateChangeRenderDone) {
            return;
        }
        if (this.state === 'menu') {
            // Focus the first item  so that keyboard controls work.
            const menuList = this._menuList;
            if (menuList) {
                await menuList.updateComplete;
                menuList.focusItemAtIndex(0);
            }
        }
        else if (this.state === 'rename' || this.state === 'newfile') {
            // Focus the filename input.
            const input = this._filenameInput;
            if (input) {
                await input.updateComplete;
                input.focus();
                if (this.state === 'rename') {
                    // Pre-select just the basename (e.g. "foo" in "foo.html"), since
                    // users typically don't want to edit the extension.
                    input.setSelectionRange(0, input.value.lastIndexOf('.'));
                }
            }
        }
        this._postStateChangeRenderDone = true;
    }
    get _surfaceContents() {
        switch (this.state) {
            case 'closed':
                return nothing;
            case 'menu':
                return this._menu;
            case 'rename':
                return this._rename;
            case 'newfile':
                return this._newFile;
        }
    }
    get _menu() {
        return html `
      <mwc-list class="menu-list" @action=${this._onMenuAction}>
        <mwc-list-item graphic="icon" id="renameButton">
          Rename
          <svg
            slot="graphic"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            fill="currentcolor"
          >
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            />
          </svg>
        </mwc-list-item>
        <mwc-list-item graphic="icon" id="deleteButton">
          Delete
          <svg
            slot="graphic"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentcolor"
          >
            <path
              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
            />
          </svg>
        </mwc-list-item>
      </mwc-list>
    `;
    }
    get _rename() {
        return html `
      <mwc-textfield
        class="filename-input"
        label="Filename"
        .value=${this.filename || ''}
        @input=${this._onFilenameInputChange}
        @keydown=${this._onFilenameInputKeydown}
      ></mwc-textfield>
      <div class="actions">
        <mwc-button outlined @click=${this._onClickCancel}>Cancel</mwc-button>
        <mwc-button
          raised
          class="submit-button"
          .disabled=${!this._filenameInputValid}
          @click=${this._onSubmitRename}
          >Rename</mwc-button
        >
      </div>
    `;
    }
    get _newFile() {
        return html `
      <mwc-textfield
        class="filename-input"
        label="Filename"
        @input=${this._onFilenameInputChange}
        @keydown=${this._onFilenameInputKeydown}
      ></mwc-textfield>
      <div class="actions">
        <mwc-button outlined @click=${this._onClickCancel}>Cancel</mwc-button>
        <mwc-button
          raised
          class="submit-button"
          .disabled=${!this._filenameInputValid}
          @click=${this._onSubmitNewFile}
          >Create</mwc-button
        >
      </div>
    `;
    }
    _onSurfaceClosed() {
        this.state = 'closed';
    }
    _onClickCancel() {
        this._surface.close();
    }
    _onMenuAction(event) {
        switch (event.detail.index) {
            case 0:
                return this._onMenuSelectRename();
            case 1:
                return this._onMenuSelectDelete();
        }
    }
    _onMenuSelectRename() {
        this.state = 'rename';
    }
    _onMenuSelectDelete() {
        this._surface.close();
        if (this._project && this.filename) {
            this._project.deleteFile(this.filename);
        }
    }
    _onFilenameInputChange() {
        // Force re-evaluation of the _filenameInputValid getter (instead of managing
        // an internal property).
        this.requestUpdate();
    }
    get _filenameInputValid() {
        return !!(this._project &&
            this._filenameInput &&
            this._project.isValidNewFilename(this._filenameInput.value));
    }
    _onFilenameInputKeydown(event) {
        var _a;
        // Slightly hacky... rather than needing to know which action to perform in
        // each context, we just click whatever submit button we're rendering.
        if (event.key === 'Enter' && ((_a = this._submitButton) === null || _a === void 0 ? void 0 : _a.disabled) === false) {
            event.preventDefault();
            this._submitButton.click();
        }
    }
    _onSubmitRename() {
        var _a;
        this._surface.close();
        const oldFilename = this.filename;
        const newFilename = (_a = this._filenameInput) === null || _a === void 0 ? void 0 : _a.value;
        if (this._project && oldFilename && newFilename) {
            this._project.renameFile(oldFilename, newFilename);
        }
    }
    _onSubmitNewFile() {
        var _a;
        this._surface.close();
        const filename = (_a = this._filenameInput) === null || _a === void 0 ? void 0 : _a.value;
        if (this._project && filename) {
            this._project.addFile(filename);
            this.dispatchEvent(new CustomEvent('newFile', {
                detail: { filename },
            }));
        }
    }
};
PlaygroundFileSystemControls.styles = css `
    mwc-menu-surface {
      --mdc-theme-primary: var(
        --playground-floating-controls-color,
        var(--playground-highlight-color, #6200ee)
      );
    }

    mwc-menu-surface.menu {
      --mdc-typography-subtitle1-font-size: 13px;
      --mdc-list-item-graphic-margin: 14px;
    }

    mwc-list-item {
      min-width: 100px;
      height: 40px;
    }

    mwc-menu-surface.rename > .wrapper,
    mwc-menu-surface.newfile > .wrapper {
      padding: 18px;
    }

    .actions {
      margin-top: 18px;
      display: flex;
      justify-content: flex-end;
    }

    .actions > * {
      margin-left: 12px;
    }
  `;
__decorate([
    property({ attribute: false })
], PlaygroundFileSystemControls.prototype, "anchorElement", void 0);
__decorate([
    property()
], PlaygroundFileSystemControls.prototype, "state", void 0);
__decorate([
    property()
], PlaygroundFileSystemControls.prototype, "filename", void 0);
__decorate([
    query('mwc-menu-surface')
], PlaygroundFileSystemControls.prototype, "_surface", void 0);
__decorate([
    query('.menu-list')
], PlaygroundFileSystemControls.prototype, "_menuList", void 0);
__decorate([
    query('.filename-input')
], PlaygroundFileSystemControls.prototype, "_filenameInput", void 0);
__decorate([
    query('.submit-button')
], PlaygroundFileSystemControls.prototype, "_submitButton", void 0);
PlaygroundFileSystemControls = __decorate([
    customElement('playground-file-system-controls')
], PlaygroundFileSystemControls);
export { PlaygroundFileSystemControls };
