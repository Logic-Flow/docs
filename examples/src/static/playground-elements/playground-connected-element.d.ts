/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { LitElement } from 'lit';
import { PlaygroundProject } from './playground-project.js';
/**
 * Base class that connects an element to a <playground-project>.
 */
export declare class PlaygroundConnectedElement extends LitElement {
    /**
     * The project that this element is associated with. Either the
     * `<playground-project>` node itself, or its `id` in the host scope.
     */
    set project(elementOrId: PlaygroundProject | string);
    /**
     * The actual `<playground-project>` node, determined by the `project`
     * property.
     */
    protected _project?: PlaygroundProject;
}
//# sourceMappingURL=playground-connected-element.d.ts.map