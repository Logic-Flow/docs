/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// Our own specialized CodeMirror bundle (see rollup.config.js).
import '../_codemirror/codemirror-bundle.js';
/**
 * CodeMirror function.
 *
 * This function is defined as window.CodeMirror, but @types/codemirror doesn't
 * declare that.
 */
export const CodeMirror = window.CodeMirror;
