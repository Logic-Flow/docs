/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { __decorate } from "tslib";
import { LitElement, css, html, nothing, render, } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { CodeMirror } from './internal/codemirror.js';
import playgroundStyles from './playground-styles.js';
import './internal/overlay.js';
const unreachable = (n) => n;
/**
 * A basic text editor with syntax highlighting for HTML, CSS, and JavaScript.
 */
let PlaygroundCodeEditor = class PlaygroundCodeEditor extends LitElement {
    constructor() {
        super(...arguments);
        /**
         * WeakMap associating a `documentKey` with CodeMirror document instance.
         * A WeakMap is used so that this component does not become the source of
         * memory leaks.
         */
        // eslint-disable-next-line @typescript-eslint/ban-types
        this._docCache = new WeakMap();
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
         * If true, this editor is not editable.
         */
        this.readonly = false;
        /**
         * If true, will disable code completions in the code-editor.
         */
        this.noCompletions = false;
        this._completionsOpen = false;
        this._currentCompletionSelectionLabel = '';
        this._currentCompletionRequestId = 0;
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
        this._showKeyboardHelp = false;
        this._resizing = false;
        this._valueChangingFromOutside = false;
        this._diagnosticMarkers = [];
        this._diagnosticsMouseoverListenerActive = false;
        // Using property assignment syntax so that it's already bound to `this` for
        // add/removeEventListener.
        this._onMouseOverWithDiagnostics = (event) => {
            var _a, _b, _c;
            if (!((_a = this.diagnostics) === null || _a === void 0 ? void 0 : _a.length)) {
                return;
            }
            // Find the diagnostic. Note we could use cm.findMarksAt() with the pointer
            // coordinates (like the built-in linter plugin does), but since we've
            // encoded the diagnostic index into a class, we can just extract it
            // directly from the target.
            const idxMatch = (_b = event.target.className) === null || _b === void 0 ? void 0 : _b.match(/diagnostic-(\d+)/);
            if (idxMatch === null) {
                this._tooltipDiagnostic = undefined;
                return;
            }
            const idx = Number(idxMatch[1]);
            const diagnostic = this.diagnostics[idx];
            if (diagnostic === ((_c = this._tooltipDiagnostic) === null || _c === void 0 ? void 0 : _c.diagnostic)) {
                // Already showing the tooltip for this diagnostic.
                return;
            }
            // Position the tooltip relative to the squiggly code span. To maximize
            // available space, place it above/below and left/right depending on which
            // quadrant the span is in.
            let position = '';
            const hostRect = this.getBoundingClientRect();
            const spanRect = event.target.getBoundingClientRect();
            const hostCenterY = hostRect.y + hostRect.height / 2;
            if (spanRect.y < hostCenterY) {
                // Note the rects are viewport relative, so the extra subtractions here
                // are to convert to host-relative.
                position += `top:${spanRect.y + spanRect.height - hostRect.y}px;`;
            }
            else {
                position += `bottom:${hostRect.bottom - spanRect.y}px;`;
            }
            const hostCenterX = hostRect.x + hostRect.width / 2;
            if (spanRect.left < hostCenterX) {
                position += `left:${Math.max(0, spanRect.x - hostRect.x)}px`;
            }
            else {
                position += `right:${Math.max(0, hostRect.right - spanRect.right)}px`;
            }
            this._tooltipDiagnostic = { diagnostic, position };
        };
    }
    get cursorPosition() {
        var _a;
        const cursor = (_a = this._codemirror) === null || _a === void 0 ? void 0 : _a.getCursor('start');
        if (!cursor)
            return { ch: 0, line: 0 };
        return {
            ch: cursor.ch,
            line: cursor.line,
        };
    }
    get cursorIndex() {
        const cm = this._codemirror;
        if (!cm)
            return 0;
        const cursorPosition = cm.getCursor('start');
        return cm.indexFromPos(cursorPosition);
    }
    get tokenUnderCursor() {
        const cm = this._codemirror;
        if (!cm)
            return { start: 0, end: 0, string: '' };
        const cursorPosition = cm.getCursor('start');
        const token = cm.getTokenAt(cursorPosition);
        return {
            start: token.start,
            end: token.end,
            string: token.string,
        };
    }
    get value() {
        return this._value;
    }
    set value(v) {
        const oldValue = this._value;
        this._value = v;
        this.requestUpdate('value', oldValue);
    }
    update(changedProperties) {
        var _a, _b, _c, _d, _e, _f;
        const cm = this._codemirror;
        if (cm === undefined) {
            this._createView();
        }
        else {
            const changedTyped = changedProperties;
            for (const prop of changedTyped.keys()) {
                switch (prop) {
                    case 'documentKey': {
                        const docKey = (_a = this.documentKey) !== null && _a !== void 0 ? _a : {};
                        let docInstance = this._docCache.get(docKey);
                        let createdNewDoc = false;
                        if (!docInstance) {
                            docInstance = new CodeMirror.Doc((_b = this.value) !== null && _b !== void 0 ? _b : '', this._getLanguageMode());
                            this._docCache.set(docKey, docInstance);
                            createdNewDoc = true;
                        }
                        else if (docInstance.getValue() !== this.value) {
                            // The retrieved document instance has contents which don't
                            // match the currently set `value`.
                            docInstance.setValue((_c = this.value) !== null && _c !== void 0 ? _c : '');
                        }
                        this._valueChangingFromOutside = true;
                        cm.swapDoc(docInstance);
                        if (createdNewDoc) {
                            // Swapping to a document instance doesn't trigger a change event
                            // which is required for document folding. Manually fold once on
                            // document instantiation.
                            this._applyHideAndFoldRegions();
                        }
                        this._valueChangingFromOutside = false;
                        break;
                    }
                    case 'value':
                        if (changedTyped.has('documentKey')) {
                            // If the `documentKey` has changed then all `value` change logic
                            // is handled in the documentKey case.
                            break;
                        }
                        this._valueChangingFromOutside = true;
                        cm.setValue((_d = this.value) !== null && _d !== void 0 ? _d : '');
                        this._valueChangingFromOutside = false;
                        break;
                    case 'lineNumbers':
                        cm.setOption('lineNumbers', this.lineNumbers);
                        break;
                    case 'lineWrapping':
                        if (this.lineWrapping) {
                            cm.on('renderLine', this._onRenderLine);
                        }
                        else {
                            cm.off('renderLine', this._onRenderLine);
                        }
                        cm.setOption('lineWrapping', this.lineWrapping);
                        break;
                    case 'type':
                        cm.setOption('mode', this._getLanguageMode());
                        break;
                    case 'readonly':
                        cm.setOption('readOnly', this.readonly);
                        break;
                    case 'pragmas':
                        this._applyHideAndFoldRegions();
                        break;
                    case 'diagnostics':
                        this._showDiagnostics();
                        break;
                    case 'cursorIndex':
                        cm.setCursor((_e = this.cursorIndex) !== null && _e !== void 0 ? _e : 0);
                        break;
                    case 'cursorPosition':
                        cm.setCursor((_f = this.cursorPosition) !== null && _f !== void 0 ? _f : { ch: 0, line: 0 });
                        break;
                    case '_completions':
                        this._showCompletions();
                        break;
                    case 'tokenUnderCursor':
                    case 'noCompletions':
                    case '_completionsOpen':
                        // Ignored
                        break;
                    default:
                        unreachable(prop);
                }
            }
        }
        super.update(changedProperties);
    }
    render() {
        var _a, _b;
        if (this.readonly) {
            return this._cmDom;
        }
        return html `
      <div
        id="focusContainer"
        tabindex="0"
        @mousedown=${this._onMousedown}
        @focus=${this._onFocus}
        @blur=${this._onBlur}
        @keydown=${this._onKeyDown}
      >
        ${this._showKeyboardHelp
            ? html `<playground-internal-overlay>
              <p id="keyboardHelp" part="dialog">
                Press <strong>Enter</strong> to start editing<br />
                Press <strong>Escape</strong> to exit editor
              </p>
            </playground-internal-overlay>`
            : nothing}
        ${this._cmDom}
        <div
          id="tooltip"
          ?hidden=${!this._tooltipDiagnostic}
          style=${ifDefined((_a = this._tooltipDiagnostic) === null || _a === void 0 ? void 0 : _a.position)}
        >
          <div part="diagnostic-tooltip">
            ${(_b = this._tooltipDiagnostic) === null || _b === void 0 ? void 0 : _b.diagnostic.message}
          </div>
        </div>
      </div>
    `;
    }
    connectedCallback() {
        // CodeMirror uses JavaScript to control whether scrollbars are visible. It
        // does so automatically on interaction, but won't notice container size
        // changes. If the browser doesn't have ResizeObserver, scrollbars will
        // sometimes be missing, but typing in the editor will fix it.
        if (typeof ResizeObserver === 'function') {
            this._resizeObserver = new ResizeObserver(() => {
                var _a;
                if (this._resizing) {
                    // Don't get in a resize loop.
                    return;
                }
                this._resizing = true;
                (_a = this._codemirror) === null || _a === void 0 ? void 0 : _a.refresh();
                this._resizing = false;
            });
            this._resizeObserver.observe(this);
        }
        super.connectedCallback();
    }
    disconnectedCallback() {
        var _a;
        (_a = this._resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        this._resizeObserver = undefined;
        super.disconnectedCallback();
    }
    _createView() {
        var _a;
        const cm = CodeMirror((dom) => {
            this._cmDom = dom;
            this._resizing = true;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    var _a;
                    // It seems that some dynamic layouts confuse CodeMirror, causing it
                    // to measure itself too soon, which then causes the position of
                    // interactions to be interpreted incorrectly. Here we hackily force
                    // a refresh after initial layout is usually done.
                    (_a = this._codemirror) === null || _a === void 0 ? void 0 : _a.refresh();
                    this._resizing = false;
                });
            });
        }, {
            value: (_a = this.value) !== null && _a !== void 0 ? _a : '',
            lineNumbers: this.lineNumbers,
            lineWrapping: this.lineWrapping,
            mode: this._getLanguageMode(),
            readOnly: this.readonly,
            inputStyle: 'contenteditable',
            // Don't allow naturally tabbing into the editor, because it's a
            // tab-trap. Instead, the container is focusable, and Enter/Escape are
            // used to explicitly enter the editable area.
            tabindex: -1,
            // Tab key inserts spaces instead of tab character
            extraKeys: {
                Tab: () => {
                    var _a;
                    cm.replaceSelection(Array((_a = cm.getOption('indentUnit')) !== null && _a !== void 0 ? _a : 2).join(' '));
                },
                // Ctrl + Space requests code completions.
                ['Ctrl-Space']: () => {
                    const tokenUnderCursor = this.tokenUnderCursor.string.trim();
                    this._requestCompletions({
                        isRefinement: false,
                        tokenUnderCursor,
                    });
                },
                ['Ctrl-/']: () => cm.toggleComment(),
                ['Cmd-/']: () => cm.toggleComment(),
            },
        });
        cm.on('change', (_editorInstance, changeObject) => {
            this._value = cm.getValue();
            // External changes are usually things like the editor switching which
            // file it is displaying.
            if (this._valueChangingFromOutside) {
                // Users can't change hide/fold regions.
                this._applyHideAndFoldRegions();
                this._showDiagnostics();
            }
            else {
                this.dispatchEvent(new Event('change'));
                this._requestCompletionsIfNeeded(changeObject);
            }
        });
        if (this.lineWrapping) {
            cm.on('renderLine', this._onRenderLine);
        }
        this._codemirror = cm;
    }
    _onRenderLine(editorInstance, line, elt) {
        // When wrapping a line the subsequent wrapped code
        // needs to keep the same formatting and have the
        // same amount of indentation.
        //
        // Each line has an initial `padding-left`, this needs
        // to be preserved with the indent:
        // - playground-styles.css#L39 - standard padding.
        // - playground-styles.css#L72 - extra with line numbers.
        const basePadding = 4;
        const gutter = editorInstance.getOption('lineNumbers')
            ? '0.7em'
            : `${basePadding}px`;
        const tabSize = editorInstance.getOption('tabSize') || basePadding;
        const off = CodeMirror.countColumn(line.text, null, tabSize);
        if (off > 0) {
            elt.style.textIndent = `-${off}ch`;
            elt.style.paddingLeft = `calc(${gutter} + ${off}ch)`;
        }
    }
    _requestCompletionsIfNeeded(changeObject) {
        if (this.noCompletions ||
            !this._currentFiletypeSupportsCompletion() ||
            !this._codemirror)
            return;
        const previousToken = this._codemirror.getTokenAt(changeObject.from);
        const tokenUnderCursor = this.tokenUnderCursor.string.trim();
        const tokenUnderCursorAsString = tokenUnderCursor.trim();
        // To help reduce round trips to a language service or a completion provider, we
        // are providing a flag if the completion is building on top of the earlier recommendations.
        // If the flag is true, the completion system can just filter the already stored
        // collection of completions again with the more precise input.
        // On deletion events, we want to query the LS again, since we might be in a new context after
        // removing characters from our code.
        const isInputEvent = changeObject.origin === '+input';
        const isRefinement = (tokenUnderCursor.length > 1 || previousToken.string === '.') &&
            isInputEvent;
        const changeWasCodeCompletion = changeObject.origin === 'complete';
        if (tokenUnderCursorAsString.length <= 0)
            return;
        if (changeWasCodeCompletion) {
            // If the case that the user triggered a code completion,
            // we want to empty out the completions until
            // a letter is input.
            this._completions = [];
            return;
        }
        this._requestCompletions({
            isRefinement,
            tokenUnderCursor,
        });
    }
    _requestCompletions({ isRefinement, tokenUnderCursor, }) {
        if (this.noCompletions ||
            !this._currentFiletypeSupportsCompletion() ||
            !this._codemirror)
            return;
        const id = ++this._currentCompletionRequestId;
        const cursorIndexOnRequest = this.cursorIndex;
        this.dispatchEvent(new CustomEvent('request-completions', {
            detail: {
                isRefinement,
                fileContent: this.value,
                tokenUnderCursor,
                cursorIndex: this.cursorIndex,
                provideCompletions: (completions) => this._onCompletionsProvided(id, completions, cursorIndexOnRequest),
            },
        }));
    }
    _onCompletionsProvided(id, completions, cursorIndex) {
        // To prevent race conditioning, check that the completions provided
        // are from the latest completions request.
        // We also check that the cursor hasn't moved to another position since the
        // completion request, causing the completion to be applied in a wrong spot.
        if (id !== this._currentCompletionRequestId ||
            cursorIndex !== this.cursorIndex) {
            return;
        }
        this._completions = completions;
    }
    _currentFiletypeSupportsCompletion() {
        // Currently we are only supporting code completion for TS. Change
        // this in a case that we start to support it for other languages too.
        return this.type === 'ts';
    }
    focus() {
        var _a;
        (_a = this._codemirrorEditable) === null || _a === void 0 ? void 0 : _a.focus();
    }
    _completionsAsHints(cm) {
        var _a, _b;
        const cursorPosition = cm.getCursor('start');
        const token = cm.getTokenAt(cursorPosition);
        const lineNumber = cursorPosition.line;
        const hintList = (_b = (_a = this._completions) === null || _a === void 0 ? void 0 : _a.map((comp, i) => ({
            text: comp.text,
            displayText: comp.displayText,
            render: (element, _data, hint) => {
                const codeEditorHint = hint;
                this._renderHint(element, _data, codeEditorHint, i === 0 ? comp.details : undefined // Only render the detail on the first item
                );
            },
            get details() {
                return comp.details;
            },
        }))) !== null && _b !== void 0 ? _b : [];
        const hints = {
            from: { line: lineNumber, ch: token.start },
            to: { line: lineNumber, ch: token.end },
            list: hintList,
        };
        CodeMirror.on(hints, 'select', async (hint, element) => {
            var _a;
            if (!this._isCodeEditorHint(hint))
                return;
            // If the current selection is the same, e.g. the completions were just
            // updated by user input, instead of moving through completions, we don't
            // want to re-render and re-fetch the details.
            if (this._currentCompletionSelectionLabel === hint.text)
                return;
            (_a = this._onCompletionSelectedChange) === null || _a === void 0 ? void 0 : _a.call(this);
            this._renderHint(element, hints, hint, hint.details);
        });
        // As CodeMirror doesn't let us directly query if the completion hints are shown,
        // we want to have our own local state following the completions menu state.
        CodeMirror.on(hints, 'shown', () => {
            // Delay updating the status by a frame so that key listeners still have
            // access to the correct state for the current situation.
            window.requestAnimationFrame(() => {
                this._completionsOpen = true;
            });
        });
        CodeMirror.on(hints, 'close', () => {
            window.requestAnimationFrame(() => {
                this._completionsOpen = false;
            });
        });
        return hints;
    }
    _isCodeEditorHint(hint) {
        return (typeof hint !== 'string' &&
            Object.prototype.hasOwnProperty.call(hint, 'details'));
    }
    _renderHint(element, _data, hint, detail) {
        var _a;
        if (!element)
            return;
        const itemIndex = _data.list.indexOf(hint);
        const completionData = (_a = this._completions) === null || _a === void 0 ? void 0 : _a[itemIndex];
        const objectName = this._buildHintObjectName(hint.displayText, completionData);
        // Render the actual completion item first
        this._renderCompletionItem(objectName, element);
        // And if we have the detail promise passed into this function,
        // we want to asynchronously update the detail info into our completion
        // item. We don't want to block the rendering, so we don't use await.
        //
        // The detail promise is passed into this function only for the item
        // currently highlighted from the completions list.
        if (detail !== undefined) {
            detail.then((detailResult) => {
                this._renderCompletionItemWithDetails(objectName, detailResult, element);
                // Set the current onSelectedChange to a callback to re-render
                // the currently selected element, but without the details. This is
                // then triggered when moving to another selection, removing the details
                // text from the previously selected element.
                this._onCompletionSelectedChange = () => this._renderHint(element, _data, hint);
                this._currentCompletionSelectionLabel = hint.text;
            });
        }
    }
    _renderCompletionItem(objectName, target) {
        render(html `<span class="hint-object-name">${objectName}</span>`, target);
    }
    _renderCompletionItemWithDetails(objectName, details, target) {
        render(html `<span class="hint-object-name">${objectName}</span>
        <span class="hint-object-details">${details.text}</span> `, target);
    }
    /**
     * Builds the name of the completable item for use in the completion UI.
     * Using marks, we can highlight the matching characters in the typed input
     * matching with the completion suggestion.
     */
    _buildHintObjectName(objectName, completionData) {
        var _a;
        const markedObjectName = objectName !== null && objectName !== void 0 ? objectName : '';
        const matches = (_a = completionData === null || completionData === void 0 ? void 0 : completionData.matches) !== null && _a !== void 0 ? _a : [];
        if (matches.length <= 0) {
            // In the situation, that none of the input matches with the
            // completion item suggestion, we exit early, leaving the objectName unmarked.
            return markedObjectName;
        }
        const firstMatch = matches[0];
        const firstMatchingIndex = firstMatch.indices[0];
        const start = firstMatchingIndex[0];
        const end = firstMatchingIndex[1];
        const preMarkContent = markedObjectName === null || markedObjectName === void 0 ? void 0 : markedObjectName.substring(0, start);
        const markedContent = markedObjectName === null || markedObjectName === void 0 ? void 0 : markedObjectName.substring(start, end + 1);
        const postMarkedContent = markedObjectName === null || markedObjectName === void 0 ? void 0 : markedObjectName.substring(end + 1);
        return html `
      ${preMarkContent}<mark>${markedContent}</mark>${postMarkedContent}
    `;
    }
    _showCompletions() {
        const cm = this._codemirror;
        if (!cm || !this._completions || this._completions.length <= 0)
            return;
        const options = {
            hint: this._completionsAsHints.bind(this),
            completeSingle: false,
            closeOnPick: true,
            closeOnUnfocus: true,
            container: this._focusContainer,
            alignWithWord: true,
        };
        cm.showHint(options);
    }
    _onMousedown() {
        var _a;
        // Directly focus editable region.
        (_a = this._codemirrorEditable) === null || _a === void 0 ? void 0 : _a.focus();
    }
    _onFocus() {
        // Outer container was focused, either by tabbing from outside, or by
        // pressing Escape.
        this._showKeyboardHelp = true;
    }
    _onBlur() {
        // Outer container was unfocused, either by tabbing away from it, or by
        // pressing Enter.
        this._showKeyboardHelp = false;
    }
    _onKeyDown(event) {
        var _a, _b;
        if (event.key === 'Enter' && event.target === this._focusContainer) {
            (_a = this._codemirrorEditable) === null || _a === void 0 ? void 0 : _a.focus();
            // Prevent typing a newline from this same event.
            event.preventDefault();
        }
        else if (event.key === 'Escape') {
            // If the user has completions selection UI opened up, Escape's default action
            // is to close the completion UI instead of escaping the code editor instance.
            // Therefore we only focus on the focusContainer in situations where the completions
            // UI is not open.
            if (!this._completionsOpen) {
                // Note there is no API for "select the next naturally focusable element",
                // so instead we just re-focus the outer container, from which point the
                // user can tab to move focus entirely elsewhere.
                (_b = this._focusContainer) === null || _b === void 0 ? void 0 : _b.focus();
            }
        }
    }
    /**
     * Create hidden and folded regions for playground-hide and playground-fold
     * comments.
     */
    async _applyHideAndFoldRegions() {
        const cm = this._codemirror;
        if (!cm) {
            return;
        }
        // Reset any existing hide/fold regions.
        for (const mark of cm.getAllMarks()) {
            mark.clear();
        }
        if (this.pragmas === 'off-visible') {
            return;
        }
        const pattern = this._maskPatternForLang();
        if (pattern === undefined) {
            return;
        }
        const doc = cm.getDoc();
        const fold = (fromIdx, toIdx) => {
            cm.foldCode(/* ignored by our rangeFinder */ 0, {
                widget: '…',
                rangeFinder: () => ({
                    from: doc.posFromIndex(fromIdx),
                    to: doc.posFromIndex(toIdx),
                }),
            });
        };
        const hide = (fromIdx, toIdx, readOnly) => {
            doc.markText(doc.posFromIndex(fromIdx), doc.posFromIndex(toIdx), {
                collapsed: true,
                readOnly,
            });
        };
        const value = cm.getValue();
        for (const match of value.matchAll(pattern)) {
            const [, opener, kind, content, closer] = match;
            const openerStart = match.index;
            if (openerStart === undefined) {
                continue;
            }
            const openerEnd = openerStart + opener.length;
            hide(openerStart, openerEnd, false);
            const contentStart = openerEnd;
            let contentEnd;
            if (content && closer) {
                contentEnd = contentStart + content.length;
                const closerStart = contentEnd;
                const closerEnd = contentEnd + closer.length;
                hide(closerStart, closerEnd, false);
            }
            else {
                // No matching end comment. Include the entire rest of the file.
                contentEnd = value.length;
            }
            if (this.pragmas === 'on') {
                if (kind === 'fold') {
                    fold(contentStart, contentEnd);
                }
                else if (kind === 'hide') {
                    hide(contentStart, contentEnd, true);
                }
            }
        }
    }
    _maskPatternForLang() {
        switch (this.type) {
            case 'js':
            case 'ts':
            case 'css':
            case 'jsx':
            case 'tsx':
                // We consume all leading whitespace and one trailing newline for each
                // start/end comment. This lets us put start/end comments on their own
                // line and indent them like the surrounding without affecting the
                // selected region.
                return /( *\/\* *playground-(?<kind>hide|fold) *\*\/\n?)(?:(.*?)( *\/\* *playground-\k<kind>-end *\*\/\n?))?/gs;
            case 'html':
                return /( *<!-- *playground-(?<kind>hide|fold) *-->\n?)(?:(.*?)( *<!-- *playground-\k<kind>-end *-->\n?))?/gs;
            default:
                return undefined;
        }
    }
    _getLanguageMode() {
        switch (this.type) {
            case 'ts':
                return 'google-typescript';
            case 'js':
            case 'json':
                // While the stock CodeMirror JavaScript mode has a restricted "json"
                // mode, the google-javascript mode does not (which we use because it
                // supports html-in-js highlighting). Adding the CodeMirror JavaScript
                // mode would add ~50KiB minified + brotli, so let's just put up with
                // the fact that you'll get highlighting for JS even though it's not
                // valid JSON.
                return 'google-javascript';
            case 'html':
                return 'google-html';
            case 'css':
                return 'css';
            case 'jsx':
            case 'tsx':
                return 'jsx';
        }
        return undefined;
    }
    _showDiagnostics() {
        const cm = this._codemirror;
        if (cm === undefined) {
            return;
        }
        cm.operation(() => {
            var _a, _b, _c;
            this._tooltipDiagnostic = undefined;
            while (this._diagnosticMarkers.length > 0) {
                this._diagnosticMarkers.pop().clear();
            }
            if (!((_a = this.diagnostics) === null || _a === void 0 ? void 0 : _a.length)) {
                if (this._diagnosticsMouseoverListenerActive) {
                    (_b = this._cmDom) === null || _b === void 0 ? void 0 : _b.removeEventListener('mouseover', this._onMouseOverWithDiagnostics);
                    this._diagnosticsMouseoverListenerActive = false;
                }
                return;
            }
            if (!this._diagnosticsMouseoverListenerActive) {
                (_c = this._cmDom) === null || _c === void 0 ? void 0 : _c.addEventListener('mouseover', this._onMouseOverWithDiagnostics);
                this._diagnosticsMouseoverListenerActive = true;
            }
            for (let i = 0; i < this.diagnostics.length; i++) {
                const diagnostic = this.diagnostics[i];
                this._diagnosticMarkers.push(cm.markText({
                    line: diagnostic.range.start.line,
                    ch: diagnostic.range.start.character,
                }, {
                    line: diagnostic.range.end.line,
                    ch: diagnostic.range.end.character,
                }, {
                    className: `diagnostic diagnostic-${i}`,
                }));
            }
        });
    }
};
PlaygroundCodeEditor.styles = [
    css `
      :host {
        display: block;
      }

      #focusContainer {
        height: 100%;
        position: relative;
      }
      #focusContainer:focus {
        outline: none;
      }

      .CodeMirror {
        height: 100% !important;
        border-radius: inherit;
      }

      .CodeMirror-foldmarker {
        font-family: sans-serif;
      }
      .CodeMirror-foldmarker:hover {
        cursor: pointer;
        /* Pretty much any color from the theme is good enough. */
        color: var(--playground-code-keyword-color, #770088);
      }

      #keyboardHelp {
        font-size: 18px;
        font-family: sans-serif;
        padding: 10px 20px;
      }

      .diagnostic {
        position: relative;
      }

      .diagnostic::before {
        /* It would be nice to use "text-decoration: red wavy underline" here,
           but unfortunately it renders nothing at all for single characters.
           See https://bugs.chromium.org/p/chromium/issues/detail?id=668042. */
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sJDw4cOCW1/KIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAHElEQVQI12NggIL/DAz/GdA5/xkY/qPKMDAwAADLZwf5rvm+LQAAAABJRU5ErkJggg==');
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
      }

      #tooltip {
        position: absolute;
        padding: 7px;
        z-index: 4;
        font-family: var(--playground-code-font-family, monospace);
      }

      #tooltip > div {
        background: var(--playground-code-background, #fff);
        color: var(--playground-code-default-color, #000);
        /* Kind of hacky... line number color tends to work out as a good
           default border, because it's usually visible on top of the
           background, but slightly muted. */
        border: 1px solid var(--playground-code-linenumber-color, #ccc);
        padding: 5px;
      }
    `,
    playgroundStyles,
];
__decorate([
    property()
], PlaygroundCodeEditor.prototype, "value", null);
__decorate([
    property({ attribute: false })
], PlaygroundCodeEditor.prototype, "documentKey", void 0);
__decorate([
    property()
], PlaygroundCodeEditor.prototype, "type", void 0);
__decorate([
    property({ type: Boolean, attribute: 'line-numbers', reflect: true })
], PlaygroundCodeEditor.prototype, "lineNumbers", void 0);
__decorate([
    property({ type: Boolean, attribute: 'line-wrapping', reflect: true })
], PlaygroundCodeEditor.prototype, "lineWrapping", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], PlaygroundCodeEditor.prototype, "readonly", void 0);
__decorate([
    property({ type: Boolean, attribute: 'no-completions' })
], PlaygroundCodeEditor.prototype, "noCompletions", void 0);
__decorate([
    property({ attribute: false })
], PlaygroundCodeEditor.prototype, "diagnostics", void 0);
__decorate([
    state()
], PlaygroundCodeEditor.prototype, "_completions", void 0);
__decorate([
    state()
], PlaygroundCodeEditor.prototype, "_completionsOpen", void 0);
__decorate([
    property()
], PlaygroundCodeEditor.prototype, "pragmas", void 0);
__decorate([
    state()
], PlaygroundCodeEditor.prototype, "_tooltipDiagnostic", void 0);
__decorate([
    state()
], PlaygroundCodeEditor.prototype, "_showKeyboardHelp", void 0);
__decorate([
    query('#focusContainer')
], PlaygroundCodeEditor.prototype, "_focusContainer", void 0);
__decorate([
    query('.CodeMirror-code')
], PlaygroundCodeEditor.prototype, "_codemirrorEditable", void 0);
PlaygroundCodeEditor = __decorate([
    customElement('playground-code-editor')
], PlaygroundCodeEditor);
export { PlaygroundCodeEditor };
