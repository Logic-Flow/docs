/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { __decorate } from "tslib";
import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
/**
 * Base class that connects an element to a <playground-project>.
 */
export class PlaygroundConnectedElement extends LitElement {
    /**
     * The project that this element is associated with. Either the
     * `<playground-project>` node itself, or its `id` in the host scope.
     */
    set project(elementOrId) {
        if (typeof elementOrId === 'string') {
            // Defer querying the host to a rAF because if the host renders this
            // element before the one we're querying for, it might not quite exist
            // yet.
            requestAnimationFrame(() => {
                var _a;
                const root = this.getRootNode();
                this._project =
                    (_a = root.getElementById(elementOrId)) !== null && _a !== void 0 ? _a : undefined;
            });
        }
        else {
            this._project = elementOrId;
        }
    }
}
__decorate([
    property()
], PlaygroundConnectedElement.prototype, "project", null);
__decorate([
    state()
], PlaygroundConnectedElement.prototype, "_project", void 0);
