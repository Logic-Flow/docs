/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import type { CompletionInfo } from 'typescript';
import { EditorCompletion, CompletionEntryWithDetails, CompletionInfoWithDetails, EditorCompletionDetails } from './worker-api.js';
export declare function sortCompletionItems(completions: CompletionEntryWithDetails[] | undefined, searchWord: string): EditorCompletion[];
export declare function completionEntriesAsEditorCompletions(completions: CompletionEntryWithDetails[] | undefined, prefix?: string): EditorCompletion[];
/**
 * Create a array of completion entries with a details fetching
 * function built in, so that the code editor can use it to fetch
 * the details when needed itself, instead of having to ask the project
 * layer for them.
 */
export declare function populateCompletionInfoWithDetailGetters(completionInfo: CompletionInfo, filename: string, cursorIndex: number, getCompletionDetailsFunction: (filename: string, cursorIndex: number, completionWord: string) => Promise<EditorCompletionDetails>): CompletionInfoWithDetails;
//# sourceMappingURL=completion-utils.d.ts.map