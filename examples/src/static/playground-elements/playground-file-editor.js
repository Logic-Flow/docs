/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { __decorate } from "tslib";
import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import './playground-code-editor.js';
import { PlaygroundConnectedElement } from './playground-connected-element.js';
/**
 * A text editor associated with a <playground-project>.
 */
let PlaygroundFileEditor = class PlaygroundFileEditor extends PlaygroundConnectedElement {
    constructor() {
        super(...arguments);
        /**
         * If true, display a left-hand-side gutter with line numbers. Default false
         * (hidden).
         */
        this.lineNumbers = false;
        /**
         * If true, wrap for long lines. Default false
         */
        this.lineWrapping = false;
        /**
         * How to handle `playground-hide` and `playground-fold` comments.
         *
         * See https://github.com/google/playground-elements#hiding--folding for
         * more details.
         *
         * Options:
         * - on: Hide and fold regions, and hide the special comments.
         * - off: Don't hide or fold regions, but still hide the special comments.
         * - off-visible: Don't hide or fold regions, and show the special comments as
         *   literal text.
         */
        this.pragmas = 'on';
        /**
         * If true, this editor is not editable.
         */
        this.readonly = false;
        /**
         * If true, will disable code completions in the code-editor.
         */
        this.noCompletions = false;
        this._onProjectFilesChanged = () => {
            var _a, _b;
            (_a = this.filename) !== null && _a !== void 0 ? _a : (this.filename = (_b = this._files[0]) === null || _b === void 0 ? void 0 : _b.name);
            this.requestUpdate();
        };
        this._onCompileDone = () => {
            // Propagate diagnostics.
            this.requestUpdate();
        };
        this._onDiagnosticsChanged = () => {
            // Propagate diagnostics.
            this.requestUpdate();
        };
    }
    get _files() {
        var _a, _b;
        return (_b = (_a = this._project) === null || _a === void 0 ? void 0 : _a.files) !== null && _b !== void 0 ? _b : [];
    }
    get _currentFile() {
        return this.filename
            ? this._files.find((file) => file.name === this.filename)
            : undefined;
    }
    async update(changedProperties) {
        if (changedProperties.has('_project')) {
            const oldProject = changedProperties.get('_project');
            if (oldProject) {
                oldProject.removeEventListener('filesChanged', this._onProjectFilesChanged);
                oldProject.removeEventListener('compileDone', this._onCompileDone);
                oldProject.removeEventListener('diagnosticsChanged', this._onDiagnosticsChanged);
            }
            if (this._project) {
                this._project.addEventListener('filesChanged', this._onProjectFilesChanged);
                this._project.addEventListener('compileDone', this._onCompileDone);
                this._project.addEventListener('diagnosticsChanged', this._onDiagnosticsChanged);
            }
            this._onProjectFilesChanged();
        }
        super.update(changedProperties);
    }
    render() {
        var _a, _b, _c, _d, _e, _f;
        return html `
      ${this._files
            ? html `
            <playground-code-editor
              exportparts="diagnostic-tooltip, dialog"
              .value=${
            // We need live() because the lit's dirty-checking value for
            // content is not updated by user edits.
            live((_b = (_a = this._currentFile) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : '')}
              .documentKey=${this._currentFile}
              .type=${this._currentFile
                ? mimeTypeToTypeEnum(this._currentFile.contentType)
                : undefined}
              .lineNumbers=${this.lineNumbers}
              .lineWrapping=${this.lineWrapping}
              .readonly=${this.readonly || !this._currentFile}
              .pragmas=${this.pragmas}
              .diagnostics=${(_d = (_c = this._project) === null || _c === void 0 ? void 0 : _c.diagnostics) === null || _d === void 0 ? void 0 : _d.get((_f = (_e = this._currentFile) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : '')}
              .noCompletions=${this.noCompletions}
              @change=${this._onEdit}
              @request-completions=${this._onRequestCompletions}
            >
            </playground-code-editor>
          `
            : html `<slot></slot>`}
    `;
    }
    _onEdit() {
        if (this._project === undefined ||
            this._currentFile === undefined ||
            this._editor.value === undefined) {
            return;
        }
        this._project.editFile(this._currentFile, this._editor.value);
    }
    async _onRequestCompletions(e) {
        var _a, _b;
        const codeEditorChangeData = e.detail;
        codeEditorChangeData.fileName = (_a = this.filename) !== null && _a !== void 0 ? _a : '';
        const completions = await ((_b = this._project) === null || _b === void 0 ? void 0 : _b.getCompletions(codeEditorChangeData));
        if (completions) {
            codeEditorChangeData.provideCompletions(completions);
        }
    }
};
PlaygroundFileEditor.styles = css `
    :host {
      display: block;
      /* Prevents scrollbars from changing container size and shifting layout
      slightly. */
      box-sizing: border-box;
      height: 350px;
    }

    slot {
      height: 100%;
      display: block;
      background: var(--playground-code-background, unset);
    }

    playground-code-editor {
      height: 100%;
      border-radius: inherit;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  `;
__decorate([
    query('playground-code-editor')
], PlaygroundFileEditor.prototype, "_editor", void 0);
__decorate([
    property()
], PlaygroundFileEditor.prototype, "filename", void 0);
__decorate([
    property({ type: Boolean, attribute: 'line-numbers' })
], PlaygroundFileEditor.prototype, "lineNumbers", void 0);
__decorate([
    property({ type: Boolean, attribute: 'line-wrapping' })
], PlaygroundFileEditor.prototype, "lineWrapping", void 0);
__decorate([
    property()
], PlaygroundFileEditor.prototype, "pragmas", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], PlaygroundFileEditor.prototype, "readonly", void 0);
__decorate([
    property({ type: Boolean, attribute: 'no-completions' })
], PlaygroundFileEditor.prototype, "noCompletions", void 0);
PlaygroundFileEditor = __decorate([
    customElement('playground-file-editor')
], PlaygroundFileEditor);
export { PlaygroundFileEditor };
const mimeTypeToTypeEnum = (mimeType) => {
    // TODO: infer type based on extension too
    if (mimeType === undefined) {
        return;
    }
    const encodingSepIndex = mimeType.indexOf(';');
    if (encodingSepIndex !== -1) {
        mimeType = mimeType.substring(0, encodingSepIndex);
    }
    switch (mimeType) {
        // TypeScript: this is the mime-type returned by servers
        // .ts files aren't usually served to browsers, so they don't yet
        // have their own mime-type.
        case 'video/mp2t':
            return 'ts';
        case 'text/javascript':
        case 'application/javascript':
            return 'js';
        case 'text/jsx':
            return 'jsx';
        case 'text/typescript-jsx':
            return 'tsx';
        case 'application/json':
            return 'json';
        case 'text/html':
            return 'html';
        case 'text/css':
            return 'css';
    }
    return undefined;
};
