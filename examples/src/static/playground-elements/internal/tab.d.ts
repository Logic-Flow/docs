/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { LitElement, PropertyValues } from 'lit';
/**
 * A tab in a <playground-internal-tab-bar>.
 *
 * Slots:
 * - default: Label or other contents of the tab.
 *
 * Parts:
 * - button: Button with tab role.
 */
export declare class PlaygroundInternalTab extends LitElement {
    static styles: import("lit").CSSResult;
    /**
     * Whether this tab is currently active.
     */
    active: boolean;
    private _button;
    /**
     * The 0-indexed position of this tab within its <playground-internal-tab-bar>.
     *
     * Note this property is managed by the containing <playground-internal-tab-bar> and
     * should not be set directly.
     */
    index: number;
    render(): import("lit-html").TemplateResult<1>;
    updated(changes: PropertyValues): void;
    focus(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'playground-internal-tab': PlaygroundInternalTab;
    }
}
//# sourceMappingURL=tab.d.ts.map