/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { PropertyValues } from 'lit';
import '@material/mwc-list';
import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-menu/mwc-menu-surface.js';
import { PlaygroundConnectedElement } from './playground-connected-element.js';
/**
 * Floating controls for creating, deleting, and renaming files in playground
 * virtual file system.
 */
export declare class PlaygroundFileSystemControls extends PlaygroundConnectedElement {
    static styles: import("lit").CSSResult;
    /**
     * The element that these controls will be positioned adjacent to.
     */
    anchorElement?: HTMLElement;
    /**
     * The kind of control to display:
     *
     * -  closed: Hidden.
     * -    menu: Menu with "Rename" and "Delete" items.
     * -  rename: Control for renaming an existing file.
     * - newfile: Control for creating a new file.
     */
    state: 'closed' | 'menu' | 'rename' | 'newfile';
    /**
     * When state is "menu" or "newfile", the name of the relevant file.
     */
    filename?: string;
    private _surface;
    private _menuList?;
    private _filenameInput?;
    private _submitButton?;
    private _postStateChangeRenderDone;
    update(changedProperties: PropertyValues): void;
    render(): import("lit-html").TemplateResult<1>;
    updated(): Promise<void>;
    private get _surfaceContents();
    private get _menu();
    private get _rename();
    private get _newFile();
    private _onSurfaceClosed;
    private _onClickCancel;
    private _onMenuAction;
    private _onMenuSelectRename;
    private _onMenuSelectDelete;
    private _onFilenameInputChange;
    private get _filenameInputValid();
    private _onFilenameInputKeydown;
    private _onSubmitRename;
    private _onSubmitNewFile;
}
declare global {
    interface HTMLElementTagNameMap {
        'playground-file-system-controls': PlaygroundFileSystemControls;
    }
}
//# sourceMappingURL=playground-file-system-controls.d.ts.map