/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { LitElement } from 'lit';
import type { PlaygroundInternalTab } from './tab.js';
/**
 * A horizontal bar of tabs.
 *
 * Slots:
 * - default: The <playground-internal-tab> tabs.
 */
export declare class PlaygroundInternalTabBar extends LitElement {
    static styles: import("lit").CSSResult;
    /**
     * Aria label of the tab list.
     */
    label?: string;
    /**
     * Get or set the active tab.
     */
    get active(): PlaygroundInternalTab | undefined;
    set active(tab: PlaygroundInternalTab | undefined);
    private _tabs;
    private _active;
    render(): import("lit-html").TemplateResult<1>;
    private _onSlotchange;
    private _activateTab;
    /**
     * If the given tab is not visible, or if not enough of its adjacent tabs are
     * visible, scroll so that the tab is centered.
     */
    private _scrollTabIntoViewIfNeeded;
    private _onKeydown;
    private _findEventTab;
}
declare global {
    interface HTMLElementTagNameMap {
        'playground-internal-tab-bar': PlaygroundInternalTabBar;
    }
}
//# sourceMappingURL=tab-bar.d.ts.map