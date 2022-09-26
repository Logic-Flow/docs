/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { LitElement, PropertyValues, TemplateResult } from 'lit';
import { CodeMirror } from './internal/codemirror.js';
import './internal/overlay.js';
import type { Diagnostic } from 'vscode-languageserver';
import type { Hint, Hints } from 'codemirror';
import { EditorCompletion, EditorCompletionDetails, EditorPosition, EditorToken } from './shared/worker-api.js';
export interface CodeEditorHint {
    details?: Promise<EditorCompletionDetails>;
    text: string;
    displayText?: string | undefined;
    render?: ((element: HTMLLIElement, data: Hints, cur: Hint) => void) | undefined;
}
/**
 * A basic text editor with syntax highlighting for HTML, CSS, and JavaScript.
 */
export declare class PlaygroundCodeEditor extends LitElement {
    static styles: import("lit").CSSResult[];
    protected _codemirror?: ReturnType<typeof CodeMirror>;
    get cursorPosition(): EditorPosition;
    get cursorIndex(): number;
    get tokenUnderCursor(): EditorToken;
    private _value?;
    get value(): string | undefined;
    set value(v: string | undefined);
    /**
     * Provide a `documentKey` to create a CodeMirror document instance which
     * isolates history and value changes per `documentKey`.
     *
     * Use to keep edit history separate between files while reusing the same
     * playground-code-editor instance.
     */
    documentKey?: object;
    /**
     * WeakMap associating a `documentKey` with CodeMirror document instance.
     * A WeakMap is used so that this component does not become the source of
     * memory leaks.
     */
    private readonly _docCache;
    /**
     * The type of the file being edited, as represented by its usual file
     * extension.
     */
    type: 'js' | 'ts' | 'html' | 'css' | 'json' | 'jsx' | 'tsx' | undefined;
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
     * If true, this editor is not editable.
     */
    readonly: boolean;
    /**
     * If true, will disable code completions in the code-editor.
     */
    noCompletions: boolean;
    /**
     * Diagnostics to display on the current file.
     */
    diagnostics?: Array<Diagnostic>;
    _completions?: EditorCompletion[];
    _completionsOpen: boolean;
    private _onCompletionSelectedChange?;
    private _currentCompletionSelectionLabel;
    private _currentCompletionRequestId;
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
    private _tooltipDiagnostic?;
    private _showKeyboardHelp;
    private _focusContainer?;
    private _codemirrorEditable?;
    private _resizeObserver?;
    private _resizing;
    private _valueChangingFromOutside;
    private _cmDom?;
    private _diagnosticMarkers;
    private _diagnosticsMouseoverListenerActive;
    update(changedProperties: PropertyValues): void;
    render(): HTMLElement | TemplateResult<1> | undefined;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _createView;
    private _onRenderLine;
    private _requestCompletionsIfNeeded;
    private _requestCompletions;
    private _onCompletionsProvided;
    private _currentFiletypeSupportsCompletion;
    focus(): void;
    private _completionsAsHints;
    private _isCodeEditorHint;
    private _renderHint;
    private _renderCompletionItem;
    private _renderCompletionItemWithDetails;
    /**
     * Builds the name of the completable item for use in the completion UI.
     * Using marks, we can highlight the matching characters in the typed input
     * matching with the completion suggestion.
     */
    private _buildHintObjectName;
    private _showCompletions;
    private _onMousedown;
    private _onFocus;
    private _onBlur;
    private _onKeyDown;
    /**
     * Create hidden and folded regions for playground-hide and playground-fold
     * comments.
     */
    private _applyHideAndFoldRegions;
    private _maskPatternForLang;
    private _getLanguageMode;
    private _showDiagnostics;
    private _onMouseOverWithDiagnostics;
}
declare global {
    interface HTMLElementTagNameMap {
        'playground-code-editor': PlaygroundCodeEditor;
    }
}
//# sourceMappingURL=playground-code-editor.d.ts.map