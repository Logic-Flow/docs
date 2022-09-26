/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { CompletionEntry, CompletionInfo, WithMetadata } from 'typescript';
import type { Diagnostic } from 'vscode-languageserver';
/**
 * Sent from the project to the proxy, with configuration and a port for further
 * messages.
 */
export declare const CONFIGURE_PROXY = 1;
/**
 * Sent from the proxy to the service worker, with a port that will be connected
 * to the project.
 */
export declare const CONNECT_SW_TO_PROJECT = 2;
/**
 * Sent from the proxy to the project, with a port that will be connected to the
 * service worker.
 */
export declare const CONNECT_PROJECT_TO_SW = 3;
/**
 * Sent from the service worker to the project, to confirm that the port was
 * received.
 */
export declare const ACKNOWLEDGE_SW_CONNECTION = 4;
/**
 * Sent from the service worker to the proxy, to notify when a file API is
 * missing and hence a re-connection is probably required.
 */
export declare const MISSING_FILE_API = 5;
/**
 * Sent from the project to the service worker proxy when there is a version
 * mismatch to request a call to ServiceWorkerRegistration.update().
 */
export declare const UPDATE_SERVICE_WORKER = 6;
export declare type PlaygroundMessage = {
    type: typeof CONFIGURE_PROXY;
    url: string;
    scope: string;
    port: MessagePort;
} | {
    type: typeof CONNECT_SW_TO_PROJECT;
    port: MessagePort;
} | {
    type: typeof CONNECT_PROJECT_TO_SW;
    port: MessagePort;
} | {
    type: typeof ACKNOWLEDGE_SW_CONNECTION;
    version: string;
} | {
    type: typeof MISSING_FILE_API;
} | {
    type: typeof UPDATE_SERVICE_WORKER;
};
export interface ServiceWorkerAPI {
    setFileAPI(fileAPI: FileAPI, sessionID: string): void;
}
export interface WorkerConfig {
    importMap: ModuleImportMap;
    cdnBaseUrl?: string;
}
export interface EditorToken {
    /** The character (on the given line) at which the token starts. */
    start: number;
    /** The character at which the token ends. */
    end: number;
    /** Code string under the cursor. */
    string: string;
}
export interface EditorPosition {
    ch: number;
    line: number;
}
declare type RangeTuple = [number, number];
export declare type EditorCompletionMatch = {
    indices: ReadonlyArray<RangeTuple>;
};
export interface EditorCompletion {
    text: string;
    displayText: string;
    score: number;
    matches?: EditorCompletionMatch[];
    details: Promise<EditorCompletionDetails>;
}
export interface EditorTagInfo {
    name: string;
    text?: EditorTag[];
}
export interface EditorTag {
    text: string;
    kind: string;
}
export interface EditorCompletionDetails {
    text: string;
    tags: EditorTagInfo[];
    documentation: string[];
}
export interface WorkerAPI {
    compileProject(files: Array<SampleFile>, config: WorkerConfig, emit: (result: BuildOutput) => void): Promise<void>;
    getCompletions(filename: string, fileContent: string, tokenUnderCursor: string, cursorIndex: number, config: WorkerConfig): Promise<WithMetadata<CompletionInfo> | undefined>;
    getCompletionItemDetails(filename: string, cursorIndex: number, config: WorkerConfig, completionWord: string): Promise<EditorCompletionDetails>;
}
export interface HttpError {
    status: number;
    body: string;
}
export interface FileAPI {
    getFile(name: string): Promise<SampleFile | HttpError>;
}
export interface SampleFile {
    /** Filename. */
    name: string;
    /** Optional display label. */
    label?: string;
    /** File contents. */
    content: string;
    /** MIME type. */
    contentType?: string;
    /** Don't display in tab bar. */
    hidden?: boolean;
    /** Whether the file should be selected when loaded */
    selected?: boolean;
}
export interface FileOptions {
    /** Optional file content. If omitted, files are fetched by name. */
    content?: string;
    /**
     * Optional content MIME type. If omitted, type is taken from fetch
     * Content-Type header if available, otherwise inferred from filename.
     */
    contentType?: string;
    /** Optional display label. */
    label?: string;
    /** Don't display in tab bar. */
    hidden?: boolean;
    /** Whether the file should be selected when loaded */
    selected?: boolean;
}
export interface ProjectManifest {
    /** Optional project manifest URL to extend from */
    extends?: string;
    files?: {
        [filename: string]: FileOptions;
    };
    importMap?: ModuleImportMap;
}
export interface ModuleImportMap {
    imports?: {
        [name: string]: string;
    };
}
export interface CodeEditorChangeData {
    isRefinement: boolean;
    fileName: string;
    fileContent: string;
    tokenUnderCursor: string;
    cursorIndex: number;
    provideCompletions: (completions: EditorCompletion[]) => void;
}
export interface CompletionEntryWithDetails extends CompletionEntry {
    _details: undefined | Promise<EditorCompletionDetails>;
    details: Promise<EditorCompletionDetails>;
}
export interface CompletionInfoWithDetails extends WithMetadata<CompletionInfo> {
    entries: CompletionEntryWithDetails[];
}
export declare type BuildOutput = FileBuildOutput | DiagnosticBuildOutput | DoneOutput;
export declare type FileBuildOutput = {
    kind: 'file';
    file: SampleFile;
};
export declare type DiagnosticBuildOutput = {
    kind: 'diagnostic';
    filename: string;
    diagnostic: Diagnostic;
};
export declare type DoneOutput = {
    kind: 'done';
};
export {};
//# sourceMappingURL=worker-api.d.ts.map