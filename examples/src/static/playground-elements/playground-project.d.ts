/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { LitElement, PropertyValues } from 'lit';
import { SampleFile, ProjectManifest, CodeEditorChangeData } from './shared/worker-api.js';
import type { Diagnostic } from 'vscode-languageserver';
declare global {
    interface HTMLElementEventMap {
        filesChanged: FilesChangedEvent;
    }
}
export declare class FilesChangedEvent extends Event {
    projectLoaded: boolean;
    constructor(projectLoaded?: boolean);
}
/**
 * Coordinates <playground-file-editor> and <playground-preview> elements.
 */
export declare class PlaygroundProject extends LitElement {
    /**
     * A document-relative path to a project configuration file.
     *
     * When both `projectSrc` and `files` are set, the one set most recently wins.
     * Slotted children win only if both `projectSrc` and `files` are undefined
     */
    get projectSrc(): string | undefined;
    set projectSrc(url: string | undefined);
    /**
     * Get or set the project config.
     *
     * When both `projectSrc` and `config` are set, the one set most recently
     * wins. Slotted children win only if both `projectSrc` and `config` are
     * undefined.
     */
    get config(): ProjectManifest | undefined;
    set config(config: ProjectManifest | undefined);
    get files(): SampleFile[] | undefined;
    /**
     * This property is used to settle which of the multiple ways a project can be
     * specified was set most recently.
     */
    private _source;
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
    private _build?;
    /**
     * Map from filename to array of Language Server Protocol diagnostics
     * resulting from the latest compilation.
     */
    get diagnostics(): Map<string, Diagnostic[]> | undefined;
    private _completionInfo?;
    /**
     * A pristine copy of the original project files, used for the `modified`
     * getter.
     */
    private _pristineFiles?;
    /**
     * Cached value for the `modified` getter. When undefined, the modified state
     * is unknown and must be computed.
     */
    private _modified;
    /**
     * Indicates whether the user has modified, added, or removed any project
     * files. Resets whenever a new project is loaded.
     */
    get modified(): boolean;
    /**
     * A unique identifier for this instance so the service worker can keep an
     * independent cache of files for it.
     */
    private readonly _sessionId;
    /**
     * The active project files.
     */
    private _files?;
    private _serviceWorkerAPI?;
    private _deferredTypeScriptWorkerApi;
    private _validImportMap;
    private set _importMap(value);
    private get _importMap();
    private _slot;
    private _serviceWorkerProxyIframe;
    private get _normalizedSandboxBaseUrl();
    get baseUrl(): string | undefined;
    private get _serviceWorkerProxyIframeUrl();
    static styles: import("lit").CSSResult;
    update(changedProperties: PropertyValues): Promise<void>;
    private _loadProjectFromSource;
    render(): import("lit-html").TemplateResult<1>;
    private _slotChange;
    firstUpdated(): Promise<void>;
    private _onServiceWorkerProxyIframeLoad;
    private _onNewServiceWorkerPort;
    private _postMessageToServiceWorkerProxyIframe;
    private _getFile;
    /**
     * Build this project immediately, cancelling any previous build.
     */
    save(): Promise<void>;
    getCompletions(changeData: CodeEditorChangeData): Promise<import("./shared/worker-api.js").EditorCompletion[]>;
    private _getCompletionDetails;
    private lastSave;
    private savePending;
    /**
     * A simple debouncer that aims for maximal responsiveness when compiles are fast.
     *
     * There is no meaning to when the returned promise resolves.
     */
    saveDebounced(): Promise<void>;
    isValidNewFilename(name: string): boolean;
    editFile(file: SampleFile, newContent: string): void;
    addFile(name: string): void;
    deleteFile(filename: string): void;
    renameFile(oldName: string, newName: string): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'playground-project': PlaygroundProject;
    }
}
//# sourceMappingURL=playground-project.d.ts.map