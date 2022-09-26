/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { PropertyValues, TemplateResult } from 'lit';
import '@material/mwc-icon-button';
import '@material/mwc-linear-progress';
import { PlaygroundConnectedElement } from './playground-connected-element.js';
import './internal/overlay.js';
/**
 * An HTML preview component consisting of an iframe and a floating reload
 * button.
 *
 * @fires reload - Fired when the user clicks the reload button
 */
export declare class PlaygroundPreview extends PlaygroundConnectedElement {
    static styles: import("lit").CSSResult;
    /**
     * The HTML file used in the preview.
     */
    htmlFile: string;
    /**
     * The string to display in the location bar.
     */
    location: string;
    iframe: HTMLIFrameElement | null;
    private _slot?;
    /**
     * Whether the iframe is currently loading.
     */
    private _loading;
    /**
     * Whether to show the loading bar.
     */
    private _showLoadingBar;
    /**
     * Whether the iframe has fired its "load" event at least once.
     */
    private _loadedAtLeastOnce;
    /**
     * An error to display instead of the iframe when something has gone wrong.
     */
    private _error?;
    constructor();
    update(changedProperties: PropertyValues): void;
    private get _indexUrl();
    render(): TemplateResult<1>;
    updated(): void;
    reload: () => void;
    firstUpdated(): Promise<void>;
    private _slotHasAnyVisibleChildren;
    private _onIframeLoad;
}
declare global {
    interface HTMLElementTagNameMap {
        'playground-preview': PlaygroundPreview;
    }
}
//# sourceMappingURL=playground-preview.d.ts.map