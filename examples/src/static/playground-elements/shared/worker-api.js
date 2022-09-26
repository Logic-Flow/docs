/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Sent from the project to the proxy, with configuration and a port for further
 * messages.
 */
export const CONFIGURE_PROXY = 1;
/**
 * Sent from the proxy to the service worker, with a port that will be connected
 * to the project.
 */
export const CONNECT_SW_TO_PROJECT = 2;
/**
 * Sent from the proxy to the project, with a port that will be connected to the
 * service worker.
 */
export const CONNECT_PROJECT_TO_SW = 3;
/**
 * Sent from the service worker to the project, to confirm that the port was
 * received.
 */
export const ACKNOWLEDGE_SW_CONNECTION = 4;
/**
 * Sent from the service worker to the proxy, to notify when a file API is
 * missing and hence a re-connection is probably required.
 */
export const MISSING_FILE_API = 5;
/**
 * Sent from the project to the service worker proxy when there is a version
 * mismatch to request a call to ServiceWorkerRegistration.update().
 */
export const UPDATE_SERVICE_WORKER = 6;
