/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import Fuse from 'fuse.js';
export function sortCompletionItems(completions, searchWord) {
    if (!completions)
        return [];
    // If the user input a letter or a partial word, we want to offer
    // the closest matches first, and the weaker matches after. We will use
    // Fuse to score our completions by their fuzzy matches.
    // See https://fusejs.io/api/options.html
    const fuse = new Fuse(completions !== null && completions !== void 0 ? completions : [], {
        // Keep the threshold a bit lower than the default
        // so that the matching isn't too forgiving/confusing, but so
        // that a small typo doesn't delete all of the matches
        threshold: 0.3,
        shouldSort: true,
        isCaseSensitive: true,
        includeScore: true,
        includeMatches: true,
        keys: ['name'],
        // Match characters so that at least most of the word matches
        minMatchCharLength: Math.max(searchWord.length / 1.2, 1),
    });
    const relevantCompletions = fuse.search(searchWord);
    const editorCompletions = relevantCompletions
        // Map the relevant info from fuse scoring
        .map((item) => {
        var _a;
        return ({
            text: item.item.name,
            displayText: item.item.name,
            score: (_a = item.score) !== null && _a !== void 0 ? _a : 0,
            matches: item.matches,
            get details() {
                return item.item.details;
            },
        });
    })
        // Sort the completions by how well they matched the given keyword
        .sort((a, b) => {
        if (a.score === b.score) {
            return a.text.localeCompare(b.text);
        }
        return a.score - b.score;
    });
    return editorCompletions;
}
export function completionEntriesAsEditorCompletions(completions, prefix = '') {
    var _a;
    return ((_a = completions === null || completions === void 0 ? void 0 : completions.map((comp) => ({
        // Since the completion engine will only append the word
        // given as the text property here, auto-completing from a period
        // would replace the period with the word. This is why we need
        // to append the period into the text property. This is not visible to the
        // user however, so no harm is done.
        text: prefix + comp.name,
        displayText: comp.name,
        score: Number.parseInt(comp.sortText),
        get details() {
            return comp.details;
        },
    }))) !== null && _a !== void 0 ? _a : []);
}
/**
 * Create a array of completion entries with a details fetching
 * function built in, so that the code editor can use it to fetch
 * the details when needed itself, instead of having to ask the project
 * layer for them.
 */
export function populateCompletionInfoWithDetailGetters(completionInfo, filename, cursorIndex, getCompletionDetailsFunction) {
    const completionInfoWithDetails = completionInfo;
    completionInfoWithDetails.entries = completionInfo === null || completionInfo === void 0 ? void 0 : completionInfo.entries.map((entry) => ({
        ...entry,
        // Details are fetched using a proxy pattern, in which the details
        // are not instantiated until requested for. When asking for details
        // from the completion item, the getter is called, launching the
        // query if needed.
        _details: undefined,
        get details() {
            if (!this._details) {
                this._details = getCompletionDetailsFunction(filename, cursorIndex, entry.name);
            }
            return this._details;
        },
    }));
    return completionInfoWithDetails;
}
