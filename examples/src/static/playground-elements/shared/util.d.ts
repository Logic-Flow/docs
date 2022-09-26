/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export declare const endWithSlash: (s: string) => string;
export declare const getRandomString: () => string;
/**
 * If the given URL object is a Skypack URL, perform an in-place update that
 * switches from optimized mode to raw mode.
 *
 * See https://github.com/google/playground-elements/issues/107
 */
export declare const forceSkypackRawMode: (url: URL) => URL;
export declare type Result<V, E> = {
    result: V;
    error?: undefined;
} | {
    result?: undefined;
    error: E;
};
//# sourceMappingURL=util.d.ts.map