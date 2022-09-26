/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { PropertyValues } from 'lit';
import '@material/mwc-icon-button';
import './internal/tab-bar.js';
import './internal/tab.js';
import './playground-file-system-controls.js';
import { PlaygroundConnectedElement } from './playground-connected-element.js';
import type { PlaygroundFileEditor } from './playground-file-editor.js';
/**
 * A horizontal bar of tabs for switching between playground files, with
 * optional controls for create/delete/rename.
 */
export declare class PlaygroundTabBar extends PlaygroundConnectedElement {
    static styles: import("lit").CSSResult;
    /**
     * Allow the user to add, remove, and rename files in the project's virtual
     * filesystem. Disabled by default.
     */
    editableFileSystem: boolean;
    private _activeFileName;
    private _activeFileIndex;
    private _fileSystemControls?;
    /**
     * The actual `<playground-file-editor>` node, determined by the `editor`
     * property.
     */
    private _editor?;
    /**
     * The editor that this tab bar controls. Either the
     * `<playground-file-editor>` node itself, or its `id` in the host scope.
     */
    set editor(elementOrId: PlaygroundFileEditor | string);
    private get _visibleFiles();
    update(changedProperties: PropertyValues): void;
    render(): import("lit-html").TemplateResult<1>;
    private _onProjectFilesChanged;
    private _handleFilesChanged;
    private _onTabchange;
    private _onOpenMenu;
    private _onClickAddFile;
    private _onNewFile;
    /**
     * Whenever a file is created, deleted, or renamed, figure out what the best
     * new active tab should be.
     */
    private _setNewActiveFile;
}
declare global {
    interface HTMLElementTagNameMap {
        'playground-tab-bar': PlaygroundTabBar;
    }
}
//# sourceMappingURL=playground-tab-bar.d.ts.map