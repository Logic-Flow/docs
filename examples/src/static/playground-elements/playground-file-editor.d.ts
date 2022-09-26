/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { PropertyValues } from 'lit';
import './playground-code-editor.js';
import { PlaygroundConnectedElement } from './playground-connected-element.js';
/**
 * A text editor associated with a <playground-project>.
 */
export declare class PlaygroundFileEditor extends PlaygroundConnectedElement {
    static styles: import("lit").CSSResult;
    private _editor;
    /**
     * The name of the project file that is currently being displayed.
     */
    filename?: string;
    /**
     * If true, display a left-hand-side gutter with line numbers. Default false
     * (hidden).
     */
    lineNumbers: boolean;
    /**
     * If true, wrap for long lines. Default false
     */
    lineWrapping: boolean;
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
    pragmas: 'on' | 'off' | 'off-visible';
    /**
     * If true, this editor is not editable.
     */
    readonly: boolean;
    /**
     * If true, will disable code completions in the code-editor.
     */
    noCompletions: boolean;
    private get _files();
    private get _currentFile();
    update(changedProperties: PropertyValues): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
    private _onProjectFilesChanged;
    private _onCompileDone;
    private _onDiagnosticsChanged;
    private _onEdit;
    private _onRequestCompletions;
}
declare global {
    interface HTMLElementTagNameMap {
        'playground-file-editor': PlaygroundFileEditor;
    }
}
//# sourceMappingURL=playground-file-editor.d.ts.map