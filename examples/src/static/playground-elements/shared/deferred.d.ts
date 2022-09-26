/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export declare class Deferred<T> {
    readonly promise: Promise<T>;
    private _resolve;
    private _reject;
    settled: boolean;
    constructor();
    resolve(value: T): void;
    reject(reason: unknown): void;
}
//# sourceMappingURL=deferred.d.ts.map