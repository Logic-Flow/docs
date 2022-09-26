/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { LitElement, PropertyValues } from 'lit';
import './playground-project.js';
import './playground-tab-bar.js';
import './playground-file-editor.js';
import './playground-preview.js';
import { ProjectManifest } from './shared/worker-api.js';
/**
 * A multi-file code editor component with live preview that works without a
 * server.
 *
 * <playground-ide> loads a project configuration file and the set of source
 * files it describes from the network. The source files can be edited locally.
 * To serve the locally edited files to the live preview, <playground-ide>
 * registers a service worker to serve files to the preview from the main UI
 * thread directly, without a network roundtrip.
 *
 * The project manifest is a JSON file with a "files" property. "files" is an
 * object with properties for each file. The key is the filename, relative to
 * the project manifest.
 *
 * Example project manifest:
 * ```json
 * {
 *   "files": {
 *     "./index.html": {},
 *     "./my-element.js": {},
 *   }
 * }
 * ```
 *
 * Files can also be given as <script> tag children of <playground-ide>. The
 * type attribute must start with "sample/" and then the type of the file, one
 * of: "js", "ts", "html", or "css". The <script> must also have a "filename"
 * attribute.
 *
 * Example inline files:
 * ```html
 * <playground-ide>
 *   <script type="sample/html" filename="index.html">
 *     <script type="module" src="index.js">&lt;script>
 *     <h1>Hello World</h1>
 *   </script>
 *   <script type="sample/js" filename="index.js">
 *     document.body.append('<h2>Hello from JS</h2>');
 *   </script>
 * </playground>
 * ```
 */
export declare class PlaygroundIde extends LitElement {
    static styles: import("lit").CSSResult;
    /**
     * A document-relative path to a project configuration file.
     *
     * When both `projectSrc` and `files` are set, the one set most recently wins.
     * Slotted children win only if both `projectSrc` and `files` are undefined.
     */
    get projectSrc(): string | undefined;
    set projectSrc(src: string | undefined);
    /**
     * Get or set the project config.
     *
     * When both `projectSrc` and `config` are set, the one set most recently
     * wins. Slotted children win only if both `projectSrc` and `config` are
     * undefined.
     */
    get config(): ProjectManifest | undefined;
    set config(config: ProjectManifest | undefined);
    /**
     * Base URL for script execution sandbox.
     *
     * It is highly advised to change this property to a URL on a separate origin
     * which has no privileges to perform sensitive actions or access sensitive
     * data. This is because this element will execute arbitrary JavaScript, and
     * does not have the ability to sanitize or sandbox it.
     *
     * This URL must host the following files from the playground-elements
     * package:
     *   1. playground-service-worker.js
     *   2. playground-service-worker-proxy.html
     *
     * Defaults to the directory containing the script that defines this element
     * on the same origin (typically something like
     * "/node_modules/playground-elements/").
     */
    sandboxBaseUrl: string;
    /**
     * The service worker scope to register on
     */
    sandboxScope: string;
    /**
     * Allow the user to add, remove, and rename files in the project's virtual
     * filesystem. Disabled by default.
     */
    editableFileSystem: boolean;
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
     * If true, allow the user to change the relative size of the LHS editor and
     * RHS preview by clicking and dragging in the space between them.
     */
    resizable: boolean;
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
     * The HTML file used in the preview.
     */
    htmlFile: string;
    /**
     * If true, will disable code completions in the code-editor.
     */
    noCompletions: boolean;
    /**
     * Indicates whether the user has modified, added, or removed any project
     * files. Resets whenever a new project is loaded.
     */
    get modified(): boolean;
    private _project;
    private _resizeBar;
    private _rhs;
    private _configSetBeforeRender?;
    private _projectSrcSetBeforeRender?;
    render(): import("lit-html").TemplateResult<1>;
    firstUpdated(): void;
    update(changedProperties: PropertyValues<this>): Promise<void>;
    private _onResizeBarPointerdown;
}
declare global {
    interface HTMLElementTagNameMap {
        'playground-ide': PlaygroundIde;
    }
}
//# sourceMappingURL=playground-ide.d.ts.map