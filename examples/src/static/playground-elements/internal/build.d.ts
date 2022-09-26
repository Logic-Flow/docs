/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import type { SampleFile, BuildOutput, HttpError } from '../shared/worker-api.js';
import type { Diagnostic } from 'vscode-languageserver';
declare type State = 'active' | 'done' | 'cancelled';
/**
 * The results of a particular Playground build.
 */
export declare class PlaygroundBuild {
    diagnostics: Map<string, Diagnostic[]>;
    private _state;
    private _stateChange;
    private _files;
    private _diagnosticsCallback;
    private _diagnosticsDebounceId;
    /**
     * @param diagnosticsCallback Function that will be invoked when one or more
     * new diagnostics have been received. Fires at most once per animation frame.
     */
    constructor(diagnosticsCallback: () => void);
    /**
     * The current state of this build.
     */
    state(): State;
    /**
     * Promise of the next state change.
     */
    get stateChange(): Promise<void>;
    /**
     * Set this build's state to cancelled, ignore any future build results, and
     * fail any pending file gets.
     */
    cancel(): void;
    /**
     * Return a promise of a build output with the given name. If the file is not
     * received before the build is completed or cancelled, this promise will be
     * rejected.
     */
    getFile(name: string): Promise<SampleFile | HttpError>;
    /**
     * Handle a worker build output.
     */
    onOutput(output: BuildOutput): void;
    private _changeState;
    private _onFile;
    private _onDiagnostic;
    private _onDone;
    private _errorPendingFileRequests;
}
export {};
//# sourceMappingURL=build.d.ts.map