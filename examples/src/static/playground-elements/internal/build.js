/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { Deferred } from '../shared/deferred.js';
const unreachable = (n) => n;
const errorNotFound = {
    status: /* Not Found */ 404,
    body: 'Playground file not found',
};
const errorCancelled = {
    status: /* Service Unavailable */ 503,
    body: 'Playground build cancelled',
};
/**
 * The results of a particular Playground build.
 */
export class PlaygroundBuild {
    /**
     * @param diagnosticsCallback Function that will be invoked when one or more
     * new diagnostics have been received. Fires at most once per animation frame.
     */
    constructor(diagnosticsCallback) {
        this.diagnostics = new Map();
        this._state = 'active';
        this._stateChange = new Deferred();
        this._files = new Map();
        this._diagnosticsCallback = diagnosticsCallback;
    }
    /**
     * The current state of this build.
     */
    state() {
        // Note this could be a getter, but TypeScript optimistically preserves
        // type-narrowing on properties between awaits, which makes usage awkward in
        // this case (see https://github.com/microsoft/TypeScript/issues/31429).
        return this._state;
    }
    /**
     * Promise of the next state change.
     */
    get stateChange() {
        return this._stateChange.promise;
    }
    /**
     * Set this build's state to cancelled, ignore any future build results, and
     * fail any pending file gets.
     */
    cancel() {
        this._errorPendingFileRequests(errorCancelled);
        this._changeState('cancelled');
    }
    /**
     * Return a promise of a build output with the given name. If the file is not
     * received before the build is completed or cancelled, this promise will be
     * rejected.
     */
    async getFile(name) {
        let deferred = this._files.get(name);
        if (deferred === undefined) {
            if (this._state === 'done') {
                return errorNotFound;
            }
            else if (this._state === 'cancelled') {
                return errorCancelled;
            }
            deferred = new Deferred();
            this._files.set(name, deferred);
        }
        return deferred.promise;
    }
    /**
     * Handle a worker build output.
     */
    onOutput(output) {
        if (this._state !== 'active') {
            return;
        }
        if (output.kind === 'file') {
            this._onFile(output);
        }
        else if (output.kind === 'diagnostic') {
            this._onDiagnostic(output);
        }
        else if (output.kind === 'done') {
            this._onDone();
        }
        else {
            throw new Error(`Unexpected BuildOutput kind: ${unreachable(output).kind}`);
        }
    }
    _changeState(state) {
        this._state = state;
        this._stateChange.resolve();
        this._stateChange = new Deferred();
    }
    _onFile(output) {
        let deferred = this._files.get(output.file.name);
        if (deferred === undefined) {
            deferred = new Deferred();
            this._files.set(output.file.name, deferred);
        }
        deferred.resolve(output.file);
    }
    _onDiagnostic(output) {
        let arr = this.diagnostics.get(output.filename);
        if (arr === undefined) {
            arr = [];
            this.diagnostics.set(output.filename, arr);
        }
        arr.push(output.diagnostic);
        if (this._diagnosticsDebounceId === undefined) {
            this._diagnosticsDebounceId = requestAnimationFrame(() => {
                if (this._state !== 'cancelled') {
                    this._diagnosticsDebounceId = undefined;
                    this._diagnosticsCallback();
                }
            });
        }
    }
    _onDone() {
        this._errorPendingFileRequests(errorNotFound);
        this._changeState('done');
    }
    _errorPendingFileRequests(error) {
        for (const file of this._files.values()) {
            if (!file.settled) {
                file.resolve(error);
            }
        }
    }
}
